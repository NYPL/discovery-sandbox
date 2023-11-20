import { parse as parseDuration, toSeconds } from 'iso8601-duration'
import nyplCoreObjects from '@nypl/nypl-core-objects'
const fulfillments = nyplCoreObjects('by-fulfillment')
import nyplApiClient from '../../server/routes/nyplApiClient'

const cache = {}
const estimator = {}

/**
 *  Given a DiscoverApi item, an optional delivery location id, and a optional request timestamp, returns an object defining:
 *   - time: An ISO8601 formatted timestamp represeting the estimated time of arrival at the holdshelf
 *   - estimate: A "friendly" statement built from the estimated time
 *
 *  The process for estimating arrival-at-holdshelf is:
 *   - Compute arrivalAtDestination as:
 *     - If onsite, it's now
 *     - If offsite:
 *       - Determine earliest processing time at origin (now if currently open; otherwise start of next operating hours)
 *       - Add depository specific travel time
 *   - Compute destinationServiceTime as:
 *     - Determine earliest processing time at destination starting at arrivalAtDestination
 *   - Compute arrivalAtHoldshelf as:
 *     - Add location specific onsite travel time to destinationServiceTime
 *     - Bump to next delivery time for rooms with special delivery schoedules
 */
estimator.getPickupTimeEstimate = async (item, deliveryLocationId, fromTimestamp = estimator._now()) => {
  const fulfillment = fulfillments[item.physFulfillment]

  // If no deliveryLocation specified, fall back on the one associated with the
  // fulfillment or just 'ma' (which is a fine default for offsite requests)
  deliveryLocationId = deliveryLocationId || fulfillment.location || 'ma'

  const rationale = [{ time: fromTimestamp, activity: 'request time' }]

  const originLocationId = estimator._locationId(item)

  // Assume onsite request (i.e. already arrived at "destination" building)
  let arrivalAtDestination = fromTimestamp

  // If offsite:
  if (/^rc/.test(originLocationId)) {
    const originServiceTime = await estimator._getServiceTime(originLocationId, fromTimestamp)

    rationale.push({ time: originServiceTime, activity: 'origin service time' })

    const offsiteTravelDuration = estimator._parseOffsiteTravelDuration(fulfillment.estimatedTime)
    arrivalAtDestination = estimator._addMinutes(originServiceTime, offsiteTravelDuration)

    rationale.push({ time: arrivalAtDestination, activity: 'travel to destination' })
  }

  // Bump time to next available service time at destination:
  const destinationServiceTime = await estimator._getServiceTime(deliveryLocationId, arrivalAtDestination)
  rationale.push({ time: destinationServiceTime, activity: 'destination service time' })

  // Account for travel to reading room:
  let arrivalAtHoldshelf = await estimator._addOnsiteTravelDuration(destinationServiceTime, deliveryLocationId)
  rationale.push({ time: arrivalAtHoldshelf, activity: 'onsite travel time' })

  // Adjust to special delivery schedules for special rooms:
  let hasSpecialDeliverySchedule
  ({ arrivalAtHoldshelf, hasSpecialDeliverySchedule } = estimator._adjustToSpecialSchedule(deliveryLocationId, arrivalAtHoldshelf))
  // console.log(`Rationale for request from ${originLocationId} to ${deliveryLocationId}:`, rationale)

  // Return the specific `time` and a human readable `estimate` string
  return {
    time: arrivalAtHoldshelf,
    estimate: estimator._makeFriendly(
      arrivalAtHoldshelf, {
        useTodayAtTime: hasSpecialDeliverySchedule,
        useTodayByTime: await estimator._isAtOrBeforeServiceHours(deliveryLocationId, destinationServiceTime)
      }
    )
  }
}

/**
 *  Given an ISO8601 Duration {string} representing the an offsite fulfillment
 *  turnaround, returns {int} number of minutes it should represent (for the
 *  purpose of estimating arrival)
 */
estimator._parseOffsiteTravelDuration = (duration) => {
  const statedDurationMinutes = toSeconds(parseDuration(duration)) / 60
  // Calculate travel time as the stated duration (e.g. PT2D, PT1D) minus 12H
  // (artificially reduced to translate the colloquial "T2D" into the more
  // accurate "T1D12H")
  return statedDurationMinutes - 12 * 60
}

/**
 *  Given a serviceTime representing the start of staff processing and a
 *  location id, returns an updated timestamp estimating arrival at a holdshelf
 *  in the same building
 */
estimator._addOnsiteTravelDuration = async (serviceTime, locationId) => {
  let onsiteTravelDuration
  // If hold placed before opening, travel time is 30mins
  if (await estimator._isAtOrBeforeServiceHours(locationId, serviceTime)) {
    onsiteTravelDuration = 'PT30M'
  } else {
    // If hold placed after opening, travel time depends on location:
    onsiteTravelDuration = estimator._onsiteFulfillmentDuration(locationId)
  }
  return estimator._addDuration(serviceTime, onsiteTravelDuration)
}

/**
 * Given a location id and a timestamp string, returns an object with:
 * hasSpecialDeliverySchedule: a Boolean which is true if the location matches a
 * location with a special delivery schedule
 * adjustedSpecialScheduleTime: a timestamp string, representing the future delivery time for
 * the given known delivery schedule
 */
estimator._adjustToSpecialSchedule = (locationId, time) => {
  let hasSpecialDeliverySchedule = false
  let adjustedSpecialScheduleTime = new Date(time)
  let secondFloorScholarRooms = ['mal17', 'mala', 'malc', 'maln', 'malw']
  let mapRooms = ['mapp8', 'mapp9', 'map08']
  let firstHour
  let getNextHour
  let lastHour

  if (secondFloorScholarRooms.includes(locationId)) {
    hasSpecialDeliverySchedule = true
    firstHour = 10
    lastHour = 16
    getNextHour = hour => 2*(parseInt(hour/2 + 1))
  }

  if (mapRooms.includes(locationId)) {
    hasSpecialDeliverySchedule = true
    firstHour = 11
    lastHour = 15
    getNextHour = hour => 2*(parseInt(hour/2 + 0.5)) + 1
  }

  if (hasSpecialDeliverySchedule) {
    adjustedSpecialScheduleTime.setMilliseconds(
      adjustedSpecialScheduleTime.getMilliseconds() - 1
    )

    let nextHour = getNextHour(adjustedSpecialScheduleTime.getHours())
    adjustedSpecialScheduleTime.setHours(nextHour)
    adjustedSpecialScheduleTime.setMinutes(0)
    adjustedSpecialScheduleTime.setSeconds(0)
    adjustedSpecialScheduleTime.setMilliseconds(0)

    if (adjustedSpecialScheduleTime.getHours() < firstHour) {
      console.log('setting to first hour')
      adjustedSpecialScheduleTime.setHours(firstHour)
    }

    if (adjustedSpecialScheduleTime.getHours() > lastHour) {
      console.log('setting for last hour ', adjustedSpecialScheduleTime)
      adjustedSpecialScheduleTime.setDate(
        adjustedSpecialScheduleTime.getDate() + 1
      )
      adjustedSpecialScheduleTime.setHours(firstHour)
      console.log('set for last hour ', adjustedSpecialScheduleTime)
    }

    let day = adjustedSpecialScheduleTime.getDay()
    if (day === 0 || day === 6) {
      console.log('incrementing day ', adjustedSpecialScheduleTime)
      let daysToIncrement = (8 - day) % 7
      adjustedSpecialScheduleTime.setDate(
        adjustedSpecialScheduleTime.getDate() + daysToIncrement
      )
      adjustedSpecialScheduleTime.setHours(firstHour)
      console.log('incremented day ', adjustedSpecialScheduleTime)
    }
  }

  let arrivalAtHoldshelf = adjustedSpecialScheduleTime.toISOString()

  return {
    hasSpecialDeliverySchedule,
    arrivalAtHoldshelf
  }
}

/**
 *  Given a timestamp string (ISO8601 format), returns a phrase like
 *   - "in an hour" - if time is about an hour away
 *   - "today by 10:45am" - if time is today and gte 1h
 *   - "tomorrow (M/D) by HH:MM" - if time is tomorrow
 *   - "Monday (M/D) by HH:MM" - e.g. if time is beyond tomorrow
 *   - "today 2pm" - e.g. if time is today at 2 and options.useTodayAtTime is set
 *
 *  Options:
 *   - useTodayAtTime: When true and time is mere hours away, renders "today HH:MM"
 *   - useTodayByTime: When true and time is mere hours away, renders "today by HH:MM"
 */
estimator._makeFriendly = (time, options = {}) => {
  options = Object.assign({
    useTodayAtTime: false,
    useTodayByTime: false
  }, options)

  const { days, hours, minutes } = estimator._dateDifference(time)

  let date = new Date(time)
  date = estimator._roundToQuarterHour(date)

  const { time: formattedTime, date: formattedDate, dayOfWeek } = estimator._formatDateAndTime(date)

  // One or more days:
  if (days && days === 1) {
    return `tomorrow (${formattedDate}) by ${formattedTime}`
  } else if (days) {
    return `${dayOfWeek} (${formattedDate}) by ${formattedTime}`
  }
  // Use exacting language? (for fixed special schedules)
  if (options.useTodayAtTime) {
    return `today ${formattedTime}`
  }
  // One or more hours:
  if (hours >= 1 || options.useTodayByTime) {
    return `today by ${formattedTime}`
  }
  // Call 45+ minutes "an hour":
  if (minutes >= 45) {
    return 'in an hour'
  } else {
    return `today by approximately ${formattedTime}`
  }
}

/**
 *  Given a Date object, returns a plainobject with:
 *   - date {string} A string representation of the date (e.g. '10/1')
 *   - time {string} A string representation of the time of day (e.g. '10:30am')
 *   - dayOfWeek {string} The day of the week (e.g. 'Wednesday')
 */
estimator._formatDateAndTime = (date) => {
  const formatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    timeZone: 'America/New_York'
  }

  const values = Intl.DateTimeFormat('en', formatOptions)
    .formatToParts(date)
    .reduce((h, part) => Object.assign(h, { [part.type]: part.value }), {})


  // In Node 10, this one comes through all lowercase:
  values.dayPeriod = values.dayperiod || values.dayPeriod || ''

  values.dayPeriod = values.dayPeriod && values.dayPeriod.toLowerCase()

  const showTimezone = estimator._nyOffset() !== (new Date(estimator._now())).getTimezoneOffset() / 60
  const timezoneSuffix = showTimezone ? ' ET' : ''

  return {
    date: `${values.month}/${values.day}`,
    time: `${values.hour}:${values.minute}${values.dayPeriod}${timezoneSuffix}`,
    dayOfWeek: values.weekday
  }
}

/**
 *  Given a DiscoveryAPI item, returns the holding location id
 *
 *  If item is a partner record, returns 'rc'
 */
estimator._locationId = (item) => {
  const nyplSource = item.idNyplSourceId && item.idNyplSourceId['@type']

  if (nyplSource !== 'SierraNypl') return 'rc'

  return item.holdingLocation && item.holdingLocation[0] && item.holdingLocation[0].id
}

/**
 *  Given a location id, returns the fulfillment duration as a ISO8601
 *  Duration string
 */
estimator._onsiteFulfillmentDuration = (locationId) => {
  if (!locationId || locationId.length < 2) return null

  const buildingCode = {
    ma: 'sasb',
    pa: 'lpa',
    sc: 'sc'
  }[locationId.slice(0, 2)]

  const fulfillment = fulfillments[`fulfillment:${buildingCode}-onsite`]
  return fulfillment.estimatedTime
}

/**
 *  Given a location, and an optional timestamp (default now), returns true if
 *  the timestamp is less than or equal to the start of the service hours for
 *  the location
 */
estimator._isAtOrBeforeServiceHours = async (locationId, time = estimator._now()) => {
  const nextServiceHours = await estimator._getNextServiceHours(locationId, time)
  const timeIsBeforeServiceHours = estimator._timestampIsLTE(time, nextServiceHours.startTime)
  return timeIsBeforeServiceHours
}

/**
 *  Given a location,
 */
estimator._getServiceTime = async (locationId, afterTimestamp = estimator._now()) => {
  const holdServiceHours = await estimator._getNextServiceHours(locationId, afterTimestamp)

  // If we're in the middle of the service window, service-time is now:
  return estimator._maximumTimestamp(afterTimestamp, holdServiceHours.startTime)
}

/**
 *  Given a location id (e.g. rc, mal, sc1234) returns the next available
 *  window in which staff may process a request.
 *
 *  The return object defines:
 *   - startTime
 *   - endTime
 */
estimator._getNextServiceHours = async (locationId, afterTimestamp = estimator._now()) => {
  const allHours = await estimator._serviceHours(locationId)
  const hours = estimator._findNextAvailableHours(allHours, afterTimestamp)
  if (!hours) {
    console.error(`Error: could not find next available hours for ${locationId} after (${afterTimestamp})`, allHours)
  }
  return hours
}

/**
 *  Given an array of hours such as is returned from the LocationsService,
 *  returns the first aviailable entry (i.e. the entry that either includes
 *  now or is tomorrow)
 */
estimator._findNextAvailableHours = (hours, afterTimestamp = estimator._now()) => {
  return hours
    // Only consider hours that have not passed (in practice, all hours
    // considered will be current or future, but let's be sure)
    .filter((hours) => estimator._timestampIsGreater(hours.endTime, afterTimestamp))
    // Sort hours ascending, so soonest is first:
    .sort((h1, h2) => estimator._timestampIsGreater(h1.startTime, h2.startTime) ? 1 : -1)
    // Get first day:
    .shift()
}

/**
 *  Given a holdingLocation, returns an array of hours such as that returned
 *  from the LocationsService, which has been adjusted to represent the hours
 *  during which staff can service a request.
 */
estimator._serviceHours = async (locationId) => {
  const hours = await estimator._operatingHours(locationId)

  return hours
    .map((hours) => {
      // Copy object so we don't mutate original:
      hours = Object.assign({}, hours)

      // If it's at ReCAP, cut-off is 2:30pm:
      if (/^rc/.test(locationId)) {
        hours.endTime = estimator._setHoursMinutes(hours.endTime, 14, 30)
      } else {
        // Otherwise, cut-off is 1h before closing:
        hours.endTime = estimator._addMinutes(hours.endTime, -60)
      }
      return hours
    })
}

/**
 *  Returns now as an ISO8601 timestamp
 */
estimator._now = () => (new Date()).toISOString()

/**
 *  Given a 8601 timestamp and a 8601 Duration string, adds the two together
 *  and returns the result as a timestamp string
 */
estimator._addDuration = (timestamp, duration) => {
  const minutes = toSeconds(parseDuration(duration)) / 60
  return estimator._addMinutes(timestamp, minutes)
}

/**
 *  Given a 8601 timestamp string and a number of minutes, adds the two
 *  together and returns the result as a timestamp string
 */
estimator._addMinutes = (dateString, minutes) => {
  const date = new Date(dateString)
  date.setTime(date.getTime() + minutes * 60 * 1000)
  return date.toISOString()
}


/**
 *  Return the current hours offset for NY (either 4 or 5)
 *
 *  This accepts an optiona timestamp so that we can calculate the
 *  NY offset for both now and some date in the future (important for
 *  calculating estimates just before/after Daylight Savings days)
 */
estimator._nyOffset = (timestamp = estimator._now()) => {
  // TODO: This should be driven by server time, i.e.:
  //
  // Assume we build a nyOffsets var on the server representing the next week
  // of offsets and make it available as:
  //   window.nyOffsets = { '2023-01-01': 5, '2023-01-02': 5, ...}
  // Then this function can determine the NY offset for the requested
  // timestamp via:
  //   const day = timestamp.split('T').shift()
  //   const offset = window && window.nyOffsets ? window.nyOffsets[day] : new Date(timestamp).getTimezoneOffset() / 60

  const offset = new Date(timestamp).getTimezoneOffset() / 60
  return offset
}

/**
 *  Given a 8601 timestamp string and a specific time of day (represented as
 *  integer hours and minutes), sets the time of the timestamp and together and
 *  returns the result as a timestamp string
 */
estimator._setHoursMinutes = (timestamp, hours, minutes = 0) => {
  hours = hours + estimator._nyOffset(timestamp)
  const date = new Date(timestamp)
  date.setUTCHours(hours, minutes)
  return date.toISOString()
}

/**
 *  Given a Date object, returns a new Date object rounded to the next quarter hour
 */
estimator._roundToQuarterHour = (date) => {
  const roundTo = 15
  const minutesToAdd = (60 + roundTo - date.getMinutes()) % roundTo

  return new Date(date.getTime() + minutesToAdd * 60_000)
}

/**
 *  Given a location id, returns an array of operating hours.
 */
estimator._operatingHours = async (locationId) => {
  const client = await nyplApiClient()
  let hours
  // if cache is less than one hour old, it is still valid
  if (cache[locationId] && cache[locationId].hours && Date.now() - cache[locationId].updatedAt < 60 * 60 * 1000) {
    hours = await cache[locationId].hours
  }
  else {
    cache[locationId] = {}
    cache[locationId].hours = client.get(`/locations?location_codes=${locationId}&fields=hours`)
    cache[locationId].updatedAt = Date.now()
    hours = await cache[locationId].hours
  }
  if (!hours || !hours[locationId] || !hours[locationId][0] || !hours[locationId][0].hours) {
    return []
  }
  return hours[locationId][0].hours
}

/**
 *  Given a timestamp, returns an object with one of three properties set:
 *   - days: The number of calendar calendar days away the timestamp is from now
 *   - hours: The number of hours away the timestamp is from now
 *   - minutes: The number of minutes away the timestamp is from now
 */
estimator._dateDifference = (d1, d2 = estimator._now()) => {
  const date1 = Date.parse(d1)
  const date2 = Date.parse(d2)

  const date1Date = new Date(d1)
  const date2Date = new Date(d2)

  const diffMs = date1 - date2

  let days = Math.floor(diffMs / 86400000)
  // If date is in a couple days, recalculate it in terms of calendar days:
  if (days < 2) {
    days = ((7 + date1Date.getDay()) - date2Date.getDay()) % 7
  }

  const hours = days ? 0 : Math.floor((diffMs % 86400000) / 3600000)
  const minutes = days || hours ? 0 : Math.round(((diffMs % 86400000) % 3600000) / 60000)
  return {
    days,
    hours,
    minutes
  }
}

/**
 *  Given two datestrings, returns the version that represents a larger date
 */
estimator._maximumTimestamp = (d1, d2) => {
  return Date.parse(d1) > Date.parse(d2) ? d1 : d2
}

/**
 * Given two ISO8601 formatted timestamps, returns true if the first represents
 * a date that is greater than the second.
 */
estimator._timestampIsGreater = (d1, d2) => {
  return Date.parse(d1) > Date.parse(d2)
}

/**
 * Given two ISO8601 formatted timestamps, returns true if the first represents
 * a date that is greater than the second.
 */
estimator._timestampIsLTE = (d1, d2) => {
  return Date.parse(d1) <= Date.parse(d2)
}


estimator._resetCacheForTesting = (time = null) => {
  Object.keys(cache).forEach((deliveryLocation) => {
    cache[deliveryLocation].updatedAt = time
    cache[deliveryLocation].hours = undefined
  })
}

module.exports = estimator
