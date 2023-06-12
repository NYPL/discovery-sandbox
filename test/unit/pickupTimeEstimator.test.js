import { stub } from 'sinon'
import { expect } from 'chai'

import NyplApiClient from '@nypl/nypl-data-api-client';

import { _calculateNextBusinessDay, _expectedAvailableDay, _operatingHours, getPickupTimeEstimate } from '../../src/app/utils/pickupTimeEstimator'

describe.only('pickupTimeEstimator', () => {
	before(() => {
		stub(NyplApiClient.prototype, 'get').callsFake((path) => {
			if (path.includes('sc')) {
				return Promise.resolve({
					sc:
						[{
							label: null, hours:
								[{
									day: 'Thursday', startTime: '2023-06-01T10:00:00+00:00',
									endTime: '2023-06-01T18:00:00+00:00', today: true
								},
								{
									day: 'Friday', startTime: '2023-06-02T10:00:00+00:00',
									endTime: '2023-06-02T18:00:00+00:00', nextBusinessDay: true
								},
								{
									day: 'Saturday', startTime: '2023-06-03T10:00:00+00:00',
									endTime: '2023-06-03T18:00:00+00:00'
								},
								{
									day: 'Sunday', startTime: '2023-06-04T13:00:00+00:00',
									endTime: '2023-06-04T17:00:00+00:00'
								},
								{
									day: 'Monday', startTime: '2023-06-05T10:00:00+00:00',
									endTime: '2023-06-05T18:00:00+00:00'
								},
								{
									day: 'Tuesday', startTime: '2023-06-06T10:00:00+00:00',
									endTime: '2023-06-06T20:00:00+00:00'
								},
								{
									day: 'Wednesday', startTime: '2023-06-07T10:00:00+00:00',
									endTime: '2023-06-07T20:00:00+00:00'
								}]
						}]
				})
			}
			else return Promise.resolve({})
		})
	})

	describe('_operatingHours', () => {
		it('should return hours array', async () => {
			expect(await _operatingHours('sc')).to.deep.equal([{
				day: 'Thursday',
				startTime: '2023-06-01T10:00:00+00:00',
				endTime: '2023-06-01T18:00:00+00:00',
				today: true
			},
			{
				day: 'Friday',
				startTime: '2023-06-02T10:00:00+00:00',
				endTime: '2023-06-02T18:00:00+00:00',
				nextBusinessDay: true
			},
			{
				day: 'Saturday',
				startTime: '2023-06-03T10:00:00+00:00',
				endTime: '2023-06-03T18:00:00+00:00'
			},
			{
				day: 'Sunday',
				startTime: '2023-06-04T13:00:00+00:00',
				endTime: '2023-06-04T17:00:00+00:00'
			},
			{
				day: 'Monday',
				startTime: '2023-06-05T10:00:00+00:00',
				endTime: '2023-06-05T18:00:00+00:00'
			},
			{
				day: 'Tuesday',
				startTime: '2023-06-06T10:00:00+00:00',
				endTime: '2023-06-06T20:00:00+00:00'
			},
			{
				day: 'Wednesday',
				startTime: '2023-06-07T10:00:00+00:00',
				endTime: '2023-06-07T20:00:00+00:00'
			}])
		})
		it('should return an empty array if response is mangled', async () => {
			expect(await _operatingHours('xx')).to.deep.equal([])
		})
	})

	describe('_expectedAvailableDay', () => {
		it('request made in time for today', async () => {
			const fromDate = '2023-06-01T11:00:00+00:00'
			const availableDay = await _expectedAvailableDay('sc', fromDate, 270000)
			expect(availableDay.today)
			expect(availableDay.day).to.equal('Thursday')
		})
		it('request made after cutoff time today', async () => {
			const fromDate = '2023-06-01T17:30:00+00:00'
			const availableDay = await _expectedAvailableDay('sc', fromDate, .75 * 3600 * 1000)
			expect(availableDay.nextBusinessDay)
			expect(availableDay.day).to.equal('Friday')
		})
		it('request made before cutoff but too late for duration today', async () => {
			const fromDate = '2023-06-01T15:00:00+00:00'
			const availableDay = await _expectedAvailableDay('sc', fromDate, 4 * 3600 * 1000)
			expect(availableDay.day).to.equal('Friday')
		})
		it('request made before cutoff but too late for duration today - loong duration', async () => {
			const fromDate = '2023-06-01T15:00:00+00:00'
			const availableDay = await _expectedAvailableDay('sc', fromDate, 72 * 3600 * 1000)
			expect(availableDay.day).to.equal('Sunday')
		})
		it('request made one week before today, duration 2 hrs', async () => {
			const fromDate = '2023-05-25T15:00:00+00:00'
			const availableDay = await _expectedAvailableDay('sc', fromDate, 2 * 3600 * 1000)
			expect(availableDay.day).to.equal('Thursday')
		})
	})
	describe.only('_calculateNextBusinessDay', () => {
		it('today is tuesday and delivery day is wednesday', () => {
			expect(_calculateNextBusinessDay(2, 3)).to.equal('tomorrow')
		})
		it('today is saturday and delivery day is sunday', () => {
			expect(_calculateNextBusinessDay(0, 1)).to.equal('tomorrow')
		})
		it('index is 0', () => {
			// the today and estimated times don't matter in this case, because we only
			// execute this function after we've determined that the current day,
			// that is, the day at index i, is the estimated delivery day.
			expect(_calculateNextBusinessDay(100, 90, 0)).to.equal('today')
		})
		it('today is monday and delivery day is wednesday', () => {
			expect(_calculateNextBusinessDay(1, 3)).to.equal('two or more days')
		})
	})
})