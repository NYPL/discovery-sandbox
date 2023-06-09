import { parse as parseDuration, toSeconds } from 'iso8601-duration'
import nyplCoreObjects from '@nypl/nypl-core-objects'
const fulfillments = nyplCoreObjects('by-fulfillment')
import nyplApiClient from '../../server/routes/nyplApiClient'


const OPENING_BUFFER = 1 * 60 * 60 * 1000
const REQUEST_CUTOFF_TIME = 2 * 60 * 60 * 1000

// is fromDate after endtime - request_cutoff+time ? next_day + buffer
// else
// is fromDate + duration greater than startTime and less than endTime, return fromDate + duration
// else

// otherwise return next starttime + buffer
// return the next time that this book will probably be ready



export const getPickupTimeEstimate = (fulfillmentId, deliveryLocation, fromDate = new Date()) => {
	// Look up item’s linked fulfillment entity in NYPL-Core:
	const fulfillment = fulfillments[fulfillmentId]
	// Convert duration to seconds:
	const durationSeconds = toSeconds(parseDuration(fulfillment.estimatedTime))
	// Create date offset by duration:
	let estimatedTime = new Date(fromDate + durationSeconds * 1000)

	// Adjust duration based on opening hours:
	let adjustedTime = _expectedAvailableDay(estimatedTime)
	// Use fulfillment linked location if no deliveryLocation specified:
	deliveryLocation = deliveryLocation || fulfillment.location

	// if (deliveryLocation && (
	// 	adjustedTime = _expectedAvailableDay(deliveryLocation, estimatedTime)
	// ) {
	// 	estimatedTime = adjustedTime
	// 	// Consider returning this?
	// 	adjustment = {
	// 		reason: 'hour',
	// 		hours: _operatingHours(deliveryLocation)
	// 	}
	// }

	// 	// Create human-readable estimate rounded to nearest 5mins:
	// 	let mins = durationSeconds / 60
	// 	mins = mins - mins % 5
	// 	const approximateDurationString = mins > 24 * 60 ?
	//    '1 day' :
	// mins > 60 ?
	//      '1 + hour' :
	// `${mins} minutes`

	// return {
	// 	estimatedTime,
	// 	approximateDurationString
	// }
}

// Delivery location should be sc, ma, or my (2 letter codes for each research branch)
export const _expectedAvailableDay = async (deliveryLocation, requestTime, duration) => {
	const locationHours = await _operatingHours(deliveryLocation)

	return locationHours.filter((day, i) => {
		const { endTime } = day
		const endTimeInMs = Date.parse(endTime)
		const estimatedDeliveryTimeMs = Date.parse(requestTime) + duration
		const requestTimeMs = Date.parse(requestTime)
		const finalRequestTimeMs = endTimeInMs - REQUEST_CUTOFF_TIME
		// if request was made after request cutoff time, today is not your day
		if (requestTimeMs > finalRequestTimeMs) return false
		// return first day that estimated delivery time is before the end of the day
		return estimatedDeliveryTimeMs < endTimeInMs
	})[0]
}

export const _operatingHours = async (deliveryLocation) => {
	const client = await nyplApiClient()
	const resp = await client.get(`/locations?location_codes=${deliveryLocation}&fields=hours`)
	if (!resp || !resp[deliveryLocation] || !resp[deliveryLocation][0] || !resp[deliveryLocation][0].hours) {
		return []
	}
	return resp[deliveryLocation][0].hours
}