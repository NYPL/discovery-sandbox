import { stub } from 'sinon'
import { expect } from 'chai'

import NyplApiClient from '@nypl/nypl-data-api-client';

import { _expectedAvailableDay, _operatingHours, getPickupTimeEstimate } from '../../src/app/utils/pickupTimeEstimator'

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
	})
	it('request made one week before today, duration ')
})