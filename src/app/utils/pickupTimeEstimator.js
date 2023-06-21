import { parse as parseDuration, toSeconds } from 'iso8601-duration'
import nyplCoreObjects from '@nypl/nypl-core-objects'
const fulfillments = nyplCoreObjects('by-fulfillment')
import nyplApiClient from '../../server/routes/nyplApiClient'


const OPENING_BUFFER = 1 * (60 * 60 * 1000)
const REQUEST_CUTOFF_BUFFER = 2 * (60 * 60 * 1000)
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.']

export const getPickupTimeEstimate = async (fulfillmentId, deliveryLocation, fromDate) => {
	let activeHoldRequest
	if (!fromDate) {
		activeHoldRequest = false
		fromDate = new Date()
	}
	// maybe check for allowed fulfillment id's... ie that they arent lpa or schomburg
	// Look up item’s linked fulfillment entity in NYPL-Core:
	const fulfillment = fulfillments[fulfillmentId]
	if (!fulfillment) return null
	// Convert duration to seconds:
	const duration = toSeconds(parseDuration(fulfillment.estimatedTime))

	// Use fulfillment linked location if no deliveryLocation specified:
	deliveryLocation = deliveryLocation || fulfillment.location

	const availableDay = await _expectedAvailableDay(deliveryLocation, fromDate, duration * 1000)

	return _buildEstimationString(availableDay, activeHoldRequest, fulfillment.estimatedTime)
}

// expects a day object: {available (string), estimatedDeliveryTime (Date object), day (string)}, a boolean, and a duration in seconds. Returns delivery estimation string
export const _buildEstimationString = (availableDay, activeHoldRequest, duration) => {
	let string
	const time = _buildTimeString(availableDay.estimatedDeliveryTime)
	const earliest = time
	const window = _calculateWindow(duration)
	const estTime = availableDay.estimatedDeliveryTime
	const date = MONTHS[estTime.getMonth()] + ' ' + estTime.getDate()
	switch (availableDay.available) {
		case 'today':
			string = activeHoldRequest ?
				`at approximately ${time} TODAY` :
				`in approximately ${window} TODAY`
			break;
		case 'tomorrow':
			string = `by approximately ${earliest} TOMORROW`
			break;
		case 'two or more days':
			string = `by approximately ${earliest} ${availableDay.day} ${date}`
			break;
	}
	return string
}

export const _calculateWindow = (duration) => {
	const { minutes, hours } = parseDuration(duration)
	let str = ''
	let { hours: roundedHours, minutes: roundedMinutes } = _roundToQuarterHour(hours, minutes)
	const plural = (n) => n === 1 ? '' : 's'
	if (roundedHours !== 0) str += `${roundedHours} hour${plural(roundedHours)}`
	if (roundedHours !== 0 && roundedMinutes !== 0) str += ' '
	if (minutes !== 0) str += `${roundedMinutes} minutes`
	return str
}

// round up to the nearest quarter hour, with special accounting for the 
// last quarter before the hour, because the hour needs to increment
export const _roundToQuarterHour = (hours, minutes) => {
	if (minutes < 60 && minutes > 45) {
		hours++
		minutes = 0
	}
	if (minutes % 15 !== 0) {
		minutes += 15 - (minutes % 15)
	}
	return { hours, minutes }
}

// expects a timestamp (integer), returns a string
export const _buildTimeString = (estimatedDeliveryTime) => {
	let minutes = estimatedDeliveryTime.getMinutes()
	let hours = estimatedDeliveryTime.getHours()
	let { hours: roundedHours, minutes: roundedMinutes } = _roundToQuarterHour(hours, minutes)

	if (roundedMinutes < 10) roundedMinutes = `0${roundedMinutes}`
	const amOrPm = roundedHours > 11 ? 'pm' : 'am'
	roundedHours = roundedHours % 12 === 0 ? 12 : roundedHours % 12
	return `${roundedHours}:${roundedMinutes} ${amOrPm}`
}

// Delivery location should be sc, ma, or my (2 letter codes for each research branch). Request time is a Date object
export const _expectedAvailableDay = async (deliveryLocation, requestTime, duration) => {
	const locationHours = await _operatingHours(deliveryLocation)
	let available
	let today = new Date(locationHours[0].startTime).getDay()
	let provisionalDeliveryTime
	const hours = locationHours.find((day, i) => {
		// convert everything into ms:
		const { endTime, startTime } = day
		const endTimeInMs = Date.parse(endTime)
		// have to add opening buffer and or duration
		const startTimeInMs = Date.parse(startTime) + OPENING_BUFFER
		const requestTimeMs = Date.parse(requestTime)
		provisionalDeliveryTime = requestTimeMs + duration
		const finalRequestTimeMs = endTimeInMs - REQUEST_CUTOFF_BUFFER
		// if request was made after request cutoff time, today is not your day
		if (requestTimeMs > finalRequestTimeMs) return false
		// if estimated delivery time is before the end of the current day, current
		// day is the day.
		if (provisionalDeliveryTime < endTimeInMs) {
			const nextDeliverableTime = provisionalDeliveryTime > startTimeInMs ? provisionalDeliveryTime : startTimeInMs
			// determine if that is today, tomorrow, or two days from now.
			const nextDeliverableday = new Date(nextDeliverableTime).getDay()
			available = _determineNextDeliverableDay(today, nextDeliverableday)
			return true
		}
	})

	return {
		available,
		estimatedDeliveryTime: _calculateDeliveryTime(available, provisionalDeliveryTime, hours.startTime),
		day: hours.day
	}
}

// If it can be delivered today, the provisional estimation still serves.
// Otherwise, estimated delivery time is the startTime plus the amount
// of time the branch needs to get their ducks in a row.
export const _calculateDeliveryTime = (dayAvailable, provisionalDeliveryTime, startTime) => {
	if (dayAvailable === 'today') return new Date(provisionalDeliveryTime)
	else {
		return new Date(Date.parse(startTime) + OPENING_BUFFER)
	}
}

// today and nextDeliverableDay are both numbers that correspond to days of the week,
// according to Date.getDay(). today is today, ie the day the code is running.
// nextDeliverableDay is the calculated next day an item can be delivered.
export const _determineNextDeliverableDay = (today, nextDeliverableday) => {
	if (nextDeliverableday === today) return 'today'
	// today and nextDeliverableday are one day apart and today is not Saturday
	if (nextDeliverableday - today === 1) return 'tomorrow'
	// today is saturday and delivery day is sunday
	if (today === 6 && nextDeliverableday === 0) return 'tomorrow'
	// next business day is not tomorrow
	else return 'two or more days'
	// TO DO: what happens if the library is closed for a week?
}

export const _operatingHours = async (deliveryLocation) => {
	const client = await nyplApiClient()
	const resp = await client.get(`/locations?location_codes=${deliveryLocation}&fields=hours`)
	if (!resp || !resp[deliveryLocation] || !resp[deliveryLocation][0] || !resp[deliveryLocation][0].hours) {
		return []
	}
	return resp[deliveryLocation][0].hours
}