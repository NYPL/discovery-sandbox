import sinon, { stub } from 'sinon'
import { expect } from 'chai'
import querystring from 'querystring'

import NyplApiClient from '@nypl/nypl-data-api-client';
import estimator from '../../src/app/utils/pickupTimeEstimator'

import nyplCoreObjects from '@nypl/nypl-core-objects'

let nowTimestamp
let tzNote = ''

describe('pickupTimeEstimator', () => {
  let clientStub
  const hoursArray = {
    sc: [
      {
        day: 'Thursday',
        startTime: '2023-06-01T14:00:00.000Z',
        endTime: '2023-06-01T23:00:00.000Z',
        today: true
      },
      {
        day: 'Friday',
        startTime: '2023-06-02T14:00:00.000Z',
        endTime: '2023-06-02T23:00:00.000Z',
        nextDeliverableDay: true
      },
      {
        day: 'Saturday',
        startTime: '2023-06-03T14:00:00.000Z',
        endTime: '2023-06-03T23:00:00.000Z'
      },
      {
        day: 'Monday',
        startTime: '2023-06-05T14:00:00.000Z',
        endTime: '2023-06-05T23:00:00.000Z'
      },
      {
        day: 'Tuesday',
        startTime: '2023-06-06T14:00:00.000Z',
        endTime: '2023-06-06T20:00:00.000Z'
      },
      {
        day: 'Wednesday',
        startTime: '2023-06-07T14:00:00.000Z',
        endTime: '2023-06-07T20:00:00.000Z'
      }
    ],
    ma: [
      {
        day: 'Thursday',
        startTime: '2023-06-01T14:00:00+00:00',
        endTime: '2023-06-01T23:00:00+00:00',
        today: true
      },
      {
        day: 'Friday',
        startTime: '2023-06-02T14:00:00+00:00',
        endTime: '2023-06-02T23:00:00+00:00',
        nextDeliverableDay: true
      },
      {
        day: 'Saturday',
        startTime: '2023-06-03T14:00:00+00:00',
        endTime: '2023-06-03T23:00:00+00:00'
      },
      {
        day: 'Monday',
        startTime: '2023-06-05T14:00:00+00:00',
        endTime: '2023-06-05T23:00:00+00:00'
      },
      {
        day: 'Tuesday',
        startTime: '2023-06-06T14:00:00+00:00',
        endTime: '2023-06-06T20:00:00+00:00'
      },
      {
        day: 'Wednesday',
        startTime: '2023-06-07T14:00:00+00:00',
        endTime: '2023-06-07T20:00:00+00:00'
      }
    ],
    rc: [
      {
        day: 'Thursday',
        startTime: '2023-06-01T14:00:00+00:00',
        endTime: '2023-06-01T22:00:00+00:00',
        today: true
      },
      {
        day: 'Friday',
        startTime: '2023-06-02T14:00:00+00:00',
        endTime: '2023-06-02T22:00:00+00:00',
        nextDeliverableDay: true
      },
      {
        day: 'Monday',
        startTime: '2023-06-05T14:00:00+00:00',
        endTime: '2023-06-05T22:00:00+00:00'
      },
      {
        day: 'Tuesday',
        startTime: '2023-06-06T14:00:00+00:00',
        endTime: '2023-06-06T22:00:00+00:00'
      },
      {
        day: 'Wednesday',
        startTime: '2023-06-07T14:00:00+00:00',
        endTime: '2023-06-07T22:00:00+00:00'
      }
    ]
  }

  beforeEach(() => {
    nowTimestamp = '2023-06-01T12:00:00'

    clientStub = stub(NyplApiClient.prototype, 'get').callsFake((path) => {
      // Read location_code from query string:
      const locationCode = querystring.parse(path.split('?').pop()).location_codes
      if (['sc', 'ma', 'rc'].includes(locationCode)) {
        return Promise.resolve({
          // Return relevant fixture:
          [locationCode]: [{ label: null, hours: hoursArray[locationCode] }]
        })
      }
      else return Promise.resolve({})
    })

    sinon.stub(estimator, '_now').callsFake(() => nowTimestamp)

    // When running tests with TZ set to anything other than ET, let's expect
    // all statements about time of day to end in "ET":
    tzNote = (process.env.TZ && process.env.TZ !== 'America/New_York') ? ' ET' : ''
    console.log(`Set tzNote to '${tzNote}'`)
  })

  afterEach(() => {
    clientStub.resetHistory()
    clientStub.restore()
    estimator._now.restore()
  })

  describe('_findNextAvailableHours', () => {
    const hours = [
      {
        day: 'Thursday',
        startTime: '2023-06-01T14:00:00.000Z',
        endTime: '2023-06-01T23:00:00.000Z',
        today: true
      },
      {
        day: 'Friday',
        startTime: '2023-06-02T14:00:00.000Z',
        endTime: '2023-06-02T23:00:00.000Z'
      }
    ]

    it('returns today\'s hours when called during business hours', async () => {
      nowTimestamp = '2023-06-01T10:00:00-04:00'
      expect(await estimator._findNextAvailableHours(hours)).to.equal(hours[0])
      nowTimestamp = '2023-06-01T10:31:00-04:00'
      expect(await estimator._findNextAvailableHours(hours)).to.equal(hours[0])
      // At 6:59pm, techinically the next avail hours are still today:
      nowTimestamp = '2023-06-01T18:59:00-04:00'
      expect(await estimator._findNextAvailableHours(hours)).to.equal(hours[0])
    })

    it('returns tomorrow\'s hours when called after business hours', async () => {
      // At 7pm, next avail hours are tomorrow:
      nowTimestamp = '2023-06-01T19:00:00-04:00'
      expect(await estimator._findNextAvailableHours(hours)).to.equal(hours[1])
      // At 9pm, next avail hours are tomorrow:
      nowTimestamp = '2023-06-01T21:00:00-04:00'
      expect(await estimator._findNextAvailableHours(hours)).to.equal(hours[1])
    })
  })

  describe('_getNextServiceHours', () => {
    // Each of these times is strictly within the service-hours for Thursday:
    ; [
      '2023-06-01T10:30:00-04:00',
      '2023-06-01T12:00:00-04:00',
      '2023-06-01T17:59:59-04:00'
    ].forEach(async (timestamp) => {
      it(`should return today\'s hours when called mid-service-hours (${timestamp})`, async () => {
        nowTimestamp = timestamp
        expect(await estimator._getNextServiceHours('sc')).to.deep.equal({
          day: 'Thursday',
          startTime: '2023-06-01T14:00:00.000Z',
          endTime: '2023-06-01T22:00:00.000Z',
          today: true
        })
      })
    })

    it('should return tomorrow when called at end of service hours', async () => {
      nowTimestamp = '2023-06-01T18:00:00'
      expect(await estimator._getNextServiceHours('sc')).to.deep.equal({
        day: 'Friday',
        startTime: '2023-06-02T14:00:00.000Z',
        endTime: '2023-06-02T22:00:00.000Z',
        nextDeliverableDay: true
      })
    })

    // Each of these times is afterhours
    ; [
      // 7pm closing:
      '2023-06-01T19:00:09',
      // 8pm:
      '2023-06-01T20:00:00',
      // 2am:
      '2023-06-02T02:00:00'
    ].forEach(async (timestamp) => {
      it(`should return tomorrow when called after service hours (${timestamp})`, async () => {
        nowTimestamp = timestamp
        expect(await estimator._getNextServiceHours('sc')).to.deep.equal({
          day: 'Friday',
          startTime: '2023-06-02T14:00:00.000Z',
          endTime: '2023-06-02T22:00:00.000Z',
          nextDeliverableDay: true
        })
      })
    })
  })

  describe('_getServiceTime', () => {
    it('should return start of tomorrow\'s service time when after hours', async () => {
      nowTimestamp = '2023-06-01T23:00:00'
      expect(await estimator._getServiceTime('sc')).to.equal('2023-06-02T14:00:00.000Z')
    })

    it('should return now when during service hours', async () => {
      // nowTimestamp defaults to '2023-06-01T12:00:00'
      expect(await estimator._getServiceTime('sc')).to.equal(nowTimestamp)
    })

    it('should return the given time if it falls within the next destination service time', async () => {
      expect(await estimator._getServiceTime('sc', '2023-06-01T12:00:00')).to.equal('2023-06-01T12:00:00')
    })

    it('should return the start of the next service time if given time falls outside of service hours', async () => {
      // Request at 6:01pm ET:
      expect(await estimator._getServiceTime('sc', '2023-06-01T22:01:00-04:00')).to.equal('2023-06-02T14:00:00.000Z')
      // Request at 7pm ET:
      expect(await estimator._getServiceTime('sc', '2023-06-01T23:00:00-04:00')).to.equal('2023-06-02T14:00:00.000Z')
      // Request at 9pm ET:
      expect(await estimator._getServiceTime('sc', '2023-06-02T02:00:00-04:00')).to.equal('2023-06-02T14:00:00.000Z')
    })
  })

  describe('_timestampIsGreater', () => {
    it('identifies timestamps that are greater regardless of timezone offsite', () => {
      // GT checks:
      expect(estimator._timestampIsGreater('2023-01-01T01:00:00.001Z', '2023-01-01T01:00:00.000Z')).to.equal(true)
      expect(estimator._timestampIsGreater('2023-01-01T10:00:01-04:00', '2023-01-01T14:00:00.000Z')).to.equal(true)
      expect(estimator._timestampIsGreater('2023-01-01T14:00:01-00:00', '2023-01-01T10:00:00-04:00')).to.equal(true)
      // LTE checks:
      expect(estimator._timestampIsGreater('2023-01-01T01:00:00.000Z', '2023-01-01T01:00:00.000Z')).to.equal(false)
      expect(estimator._timestampIsGreater('2023-01-01T01:00:00.000Z', '2023-01-01T01:00:00.001Z')).to.equal(false)
    })
  })

  describe('_timestampIsLTE', () => {
    it('identifies timestamps that are less than or equal regardless of timezone offsite', () => {
      // Equal checks:
      expect(estimator._timestampIsLTE('2023-01-01T01:00:00.000Z', '2023-01-01T01:00:00.000Z')).to.equal(true)
      expect(estimator._timestampIsLTE('2023-01-01T01:00:00.000Z', '2023-01-01T01:00:00.000Z')).to.equal(true)
      // Less than checks:
      expect(estimator._timestampIsLTE('2023-01-01T01:00:00.000Z', '2023-01-01T01:00:00.001Z')).to.equal(true)
      expect(estimator._timestampIsLTE('2023-01-01T14:00:00.000Z', '2023-01-01T10:00:01-04:00')).to.equal(true)
      expect(estimator._timestampIsLTE('2023-01-01T10:00:00-04:00', '2023-01-01T14:00:01-00:00')).to.equal(true)
      // GT checks:
      expect(estimator._timestampIsLTE('2023-06-01T14:01:00.000Z', '2023-06-01T14:00:00+00:00')).to.equal(false)
      expect(estimator._timestampIsLTE('2023-01-01T14:00:01-00:00', '2023-01-01T10:00:00-04:00')).to.equal(false)
    })
  })

  describe('_serviceHours', () => {
    afterEach(() => estimator._resetCacheForTesting())
    it('should return servic hours array', async () => {
      expect(await estimator._serviceHours('sc')).to.deep.equal([
        {
          day: 'Thursday',
          // Note that service hours are not padded on the front because
          // technically staff can service requests immediately at opening.
          // Standard intra-building travel times apply.
          startTime: '2023-06-01T14:00:00.000Z',
          endTime: '2023-06-01T22:00:00.000Z',
          today: true
        },
        {
          day: 'Friday',
          startTime: '2023-06-02T14:00:00.000Z',
          endTime: '2023-06-02T22:00:00.000Z',
          nextDeliverableDay: true
        },
        {
          day: 'Saturday',
          startTime: '2023-06-03T14:00:00.000Z',
          endTime: '2023-06-03T22:00:00.000Z'
        },
        {
          day: 'Monday',
          startTime: '2023-06-05T14:00:00.000Z',
          endTime: '2023-06-05T22:00:00.000Z'
        },
        {
          day: 'Tuesday',
          startTime: '2023-06-06T14:00:00.000Z',
          endTime: '2023-06-06T19:00:00.000Z'
        },
        {
          day: 'Wednesday',
          startTime: '2023-06-07T14:00:00.000Z',
          endTime: '2023-06-07T19:00:00.000Z'
        }
      ])
    })
  })

  describe('_setHoursMinutes', () => {
    it('should set hours and minutes', () => {
      // This is the zulu representation of 230 eastern:
      const local230 = '2023-06-07T18:30:00.000Z'
      // Eastern:
      expect(estimator._setHoursMinutes('2023-06-07T18:00:00-04:00', 14, 30)).to.equal(local230)
      // Zulu time; return Eastern:
      expect(estimator._setHoursMinutes('2023-06-07T22:00:00+00:00', 14, 30)).to.equal(local230)
    })
  })

  describe('_addMinutes', () => {
    it('should add 30 mins', () => {
      // Eastern time
      expect(estimator._addMinutes('2023-06-07T14:00:00-04:00', 30)).to.equal('2023-06-07T18:30:00.000Z')
      // Zulu time
      expect(estimator._addMinutes('2023-06-07T14:00:00+00:00', 30)).to.equal('2023-06-07T14:30:00.000Z')
    })

    it('should sub 30 mins', () => {
      expect(estimator._addMinutes('2023-06-07T14:00:00+00:00', -30)).to.equal('2023-06-07T13:30:00.000Z')
    })

    it('should add 1 hour, rolling over to tomorrow', () => {
      expect(estimator._addMinutes('2023-06-07T23:00:00+00:00', 60)).to.equal('2023-06-08T00:00:00.000Z')
    })
  })

  describe('_operatingHours', () => {
    afterEach(() => estimator._resetCacheForTesting())
    it('should return operating hours array', async () => {
      expect(await estimator._operatingHours('sc')).to.deep.equal(hoursArray.sc)
    })
    it('should return an empty array if response is mangled', async () => {
      expect(await estimator._operatingHours('xx')).to.deep.equal([])
    })
    it('should only make one get request for successive calls', async () => {
      await estimator._operatingHours('sc')
      await estimator._operatingHours('sc')
      const hours = await estimator._operatingHours('sc')
      expect(sinon.assert.calledOnce(clientStub))
      expect(hours).to.deep.equal(hoursArray.sc)
    })
    it('should fetch new hours if it is expired', async () => {
      // set cache with expired time
      estimator._resetCacheForTesting(1687449047066)
      await estimator._operatingHours('sc')
      await estimator._operatingHours('sc')
      expect(sinon.assert.calledOnce(clientStub))
    })
  })

  describe('_dateDiff', () => {
    it('should return days, hours, minutes difference from d2 - d1', () => {
      // 12am ET
      nowTimestamp = '2023-01-01T00:00:00'

      // Same time:
      expect(estimator._dateDifference('2023-01-01T00:00:00')).to.deep.equal({
        days: 0,
        hours: 0,
        minutes: 0
      })
      // next day at 2:03am: EST:
      expect(estimator._dateDifference('2023-01-02T02:03:00')).to.deep.equal({
        days: 1,
        hours: 0,
        minutes: 0
      })
      // Same day at 10:30am EST:
      expect(estimator._dateDifference('2023-01-01T10:30:00')).to.deep.equal({
        days: 0,
        hours: 10,
        minutes: 0
      })
    })

    it('should consider any time after midnight as 1 day even if < 24h pass', () => {
      // At closing, 10am tomorrow is "1 day away" (even though it's fewer than 24h)
      nowTimestamp = '2023-01-01T19:00:00'
      expect(estimator._dateDifference('2023-01-02T10:00:00')).to.deep.equal({
        days: 1,
        hours: 0,
        minutes: 0
      })

      // One minute after midnight is, colloquially, 1 day later:
      nowTimestamp = '2023-01-01T23:59:00'
      expect(estimator._dateDifference('2023-01-02T00:01:00')).to.deep.equal({
        days: 1,
        hours: 0,
        minutes: 0
      })
    })
  })

  describe('_makeFriendly', () => {
    it('considers 45-59minutes to be \'in an hour\'', () => {
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect(estimator._makeFriendly('2023-06-01T15:15:00.000Z')).to.equal('in an hour')
      expect(estimator._makeFriendly('2023-06-01T15:29:00.000Z')).to.equal('in an hour')
    })

    it('renders 1h+ as specific time', () => {
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect(estimator._makeFriendly('2023-06-01T17:30:00.000Z')).to.equal(`today by 1:30pm${tzNote}`)
      expect(estimator._makeFriendly('2023-06-01T15:30:00.000Z')).to.equal(`today by 11:30am${tzNote}`)
    })

    it('renders dates happening tomorrow as "tomorrow"', () => {
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect(estimator._makeFriendly('2023-06-02T14:30:00.000Z')).to.equal(`tomorrow (6/2) by 10:30am${tzNote}`)
    })

    it('renders dates happening today within 45 minutes as "today by approximately ..."', () => {
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect(estimator._makeFriendly('2023-06-01T15:05:00.000Z')).to.equal(`today by approximately 11:15am${tzNote}`)
    })

    it('renders dates happening today within 45 minutes as "today by approximately ..."', () => {
      nowTimestamp = '2023-06-01T15:10:00.000Z'
      expect(estimator._makeFriendly('2023-06-01T15:10:00.000Z', { useTodayByTime: true })).to.equal(`today by 11:15am${tzNote}`)
    })

    it('renders specific time when showTime is enabled', () => {
      nowTimestamp = '2023-06-01T14:10:00.000Z'
      expect(estimator._makeFriendly('2023-06-01T14:30:00.000Z', { useTodayByTime: true })).to.equal(`today by 10:30am${tzNote}`)
      // Without the use-today-by-time flag, the default is to use "approximately":
      expect(estimator._makeFriendly('2023-06-01T14:30:00.000Z')).to.equal(`today by approximately 10:30am${tzNote}`)
    })
  })

  describe('_formatDateAndTime', () => {
    it('should format date and time', () => {
      nowTimestamp = '2023-06-01T14:10:00.000Z'
      expect(estimator._formatDateAndTime(new Date('2023-06-01T14:30:00.000Z'))).to.deep.equal({
        time: `10:30am${tzNote}`,
        date: '6/1',
        dayOfWeek: 'Thursday'
      })
      expect(estimator._formatDateAndTime(new Date('2023-06-02T22:12:34.000Z'))).to.deep.equal({
        time: `6:12pm${tzNote}`,
        date: '6/2',
        dayOfWeek: 'Friday'
      })
    })
  })

  describe('_roundToQuarterHour', () => {
    it('should return same date if already rounded', () => {
      expect(estimator._roundToQuarterHour(new Date('2023-06-01T14:30:00.000Z')).toISOString())
        .to.equal('2023-06-01T14:30:00.000Z')
    })

    it('should round date to next quarter hour', () => {
      expect(estimator._roundToQuarterHour(new Date('2023-06-01T14:31:00.000Z')).toISOString())
        .to.equal('2023-06-01T14:45:00.000Z')
    })
  })

  describe('getPickupTimeEstimate', () => {
    it('should return a pickup time estimate of 30mins for requests placed on-site at any location *before* business hours', async () => {
      // estimator.getPickupTimeEstimate = async (item, deliveryLocation, fromDate) => {
      const item = {
        holdingLocation: [{ id: 'ma' }],
        physFulfillment: 'fulfillment:sasb-onsite',
        idNyplSourceId: { '@type': 'SierraNypl' }
      }
      // 9am:
      nowTimestamp = '2023-06-01T13:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-01T14:30:00.000Z')
      // 10am:
      nowTimestamp = '2023-06-01T14:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-01T14:30:00.000Z')

      // Try SC:
      item.holdingLocation[0].id = 'sc'
      nowTimestamp = '2023-06-01T14:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'sc')).time).to.equal('2023-06-01T14:30:00.000Z')
    })

    it('should return a pickup time estimate of 15mins for requests placed on-site at SC during business hours', async () => {
      // estimator.getPickupTimeEstimate = async (item, deliveryLocation, fromDate) => {
      const item = {
        holdingLocation: [{ id: 'sc' }],
        physFulfillment: 'fulfillment:sc-onsite',
        idNyplSourceId: { '@type': 'SierraNypl' }
      }
      // 10:01am
      nowTimestamp = '2023-06-01T14:01:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'sc')).time).to.equal('2023-06-01T14:16:00.000Z')

      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'sc')).time).to.equal('2023-06-01T14:45:00.000Z')

      nowTimestamp = '2023-06-01T15:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'sc')).time).to.equal('2023-06-01T15:15:00.000Z')
    })
     
    it('should return a pickup time estimate of 45mins for requests placed on-site at MA during business hours', async () => {
      // estimator.getPickupTimeEstimate = async (item, deliveryLocation, fromDate) => {
      const item = {
        holdingLocation: [{ id: 'ma' }],
        physFulfillment: 'fulfillment:sasb-onsite',
        idNyplSourceId: { '@type': 'SierraNypl' }
      }
      // 10:01am:
      nowTimestamp = '2023-06-01T14:01:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-01T14:46:00.000Z')
      // 11am:
      nowTimestamp = '2023-06-01T15:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-01T15:45:00.000Z')
      // 4pm:
      nowTimestamp = '2023-06-01T20:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-01T20:45:00.000Z')
    })

    it('should return a on-site pickup time estimate of Monday if placed late Sat', async () => {
      // estimator.getPickupTimeEstimate = async (item, deliveryLocation, fromDate) => {
      const item = {
        holdingLocation: [{ id: 'ma' }],
        physFulfillment: 'fulfillment:sasb-onsite',
        idNyplSourceId: { '@type': 'SierraNypl' }
      }
      // 6pm: (closes 7pm)
      nowTimestamp = '2023-06-03T22:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-05T14:30:00.000Z')
    })

    it('should return a pickup time estimate of tomorrow for ReCAP requests placed during Recap service hours', async () => {
      // estimator.getPickupTimeEstimate = async (item, deliveryLocation, fromDate) => {
      const item = {
        holdingLocation: [{ id: 'rc' }],
        physFulfillment: 'fulfillment:recap-offsite'
      }
      // 10:30am:
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-02T14:30:00.000Z')
      // 1:30pm:
      nowTimestamp = '2023-06-01T17:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-02T14:30:00.000Z')
    })

    it('should return a pickup time estimate of 2 days for ReCAP requests placed after Recap service hours', async () => {
      const item = {
        holdingLocation: [{ id: 'rc' }],
        physFulfillment: 'fulfillment:recap-offsite'
      }
      // 2:30pm ET:
      nowTimestamp = '2023-06-01T18:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-03T14:30:00.000Z')
      // 4:30pm ET:
      nowTimestamp = '2023-06-01T20:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-03T14:30:00.000Z')
      // 11:30pm ET:
      nowTimestamp = '2023-06-02T03:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-03T14:30:00.000Z')
    })

    it('should return a pickup time of tues for ReCAP requests placed after Recap service hours on a Friday', async () => {
      const item = {
        holdingLocation: [{ id: 'rc' }],
        physFulfillment: 'fulfillment:recap-offsite'
      }
      // 2:30pm ET on a Friday:
      nowTimestamp = '2023-06-02T18:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-06T14:30:00.000Z')
      // 5:30pm ET on a Friday:
      nowTimestamp = '2023-06-02T21:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-06T14:30:00.000Z')
      // 8:00am ET on a Mon:
      nowTimestamp = '2023-06-05T12:00:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-06T14:30:00.000Z')
    })

    it('should return a pickup time estimate of 2 business days for HD requests placed during Recap service hours', async () => {
      const item = {
        holdingLocation: [{ id: 'rc' }],
        physFulfillment: 'fulfillment:hd-offsite'
      }
      // 10:30am:
      nowTimestamp = '2023-06-01T14:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-03T14:30:00.000Z')
      // 1:30pm:
      nowTimestamp = '2023-06-01T17:30:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-03T14:30:00.000Z')
    })

    it('should return a pickup time estimate of 3 business days for HD requests placed after Recap service hours', async () => {
      const item = {
        holdingLocation: [{ id: 'rc' }],
        physFulfillment: 'fulfillment:hd-offsite'
      }
      // 14:30am:
      nowTimestamp = '2023-06-01T18:30:00.000Z'
      // No Sunday service, so it gets bumped to Monday:
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-05T14:30:00.000Z')
      // 14:31pm:
      nowTimestamp = '2023-06-01T18:31:00.000Z'
      expect((await estimator.getPickupTimeEstimate(item, 'ma')).time).to.equal('2023-06-05T14:30:00.000Z')
    })

    describe('estimate without a chosen destination', () => {
      it('items in HD should build estimate as if being sent to SASB by default', async () => {
        const item = {
          holdingLocation: [{ id: 'rc' }],
          physFulfillment: 'fulfillment:hd-offsite'
        }
        // 14:30am:
        nowTimestamp = '2023-06-01T18:30:00.000Z'
        // No Sunday service, so it gets bumped to Monday:
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          time: '2023-06-05T14:30:00.000Z',
          estimate: `Monday (6/5) by 10:30am${tzNote}`
        })
      })

      it('items in SASB', async () => {
        const item = {
          holdingLocation: [{ id: 'ma' }],
          physFulfillment: 'fulfillment:sasb-onsite',
          idNyplSourceId: { '@type': 'SierraNypl' }
        }
        // 9am:
        nowTimestamp = '2023-06-01T13:00:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          estimate: `today by 10:30am${tzNote}`,
          time: '2023-06-01T14:30:00.000Z'
        })
        // 10am:
        nowTimestamp = '2023-06-01T14:00:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          estimate: `today by 10:30am${tzNote}`,
          time: '2023-06-01T14:30:00.000Z'
        })
      })

      it('items in SC', async () => {
        const item = {
          holdingLocation: [{ id: 'sc' }],
          physFulfillment: 'fulfillment:sasb-onsite',
          idNyplSourceId: { '@type': 'SierraNypl' }
        }
        // After hours:
        nowTimestamp = '2023-06-01T22:00:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          time: '2023-06-02T14:30:00.000Z',
          estimate: `tomorrow (6/2) by 10:30am${tzNote}`
        })
        // Before opening:
        nowTimestamp = '2023-06-01T13:59:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          time: '2023-06-01T14:30:00.000Z',
          estimate: `today by 10:30am${tzNote}`
        })
        // At opening:
        nowTimestamp = '2023-06-01T14:00:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item)).to.deep.equal({
          time: '2023-06-01T14:30:00.000Z',
          estimate: `today by 10:30am${tzNote}`
        })
      })
    })

    describe('active hold requests', () => {
      it('should render approximate pickup time as it draws near', async () => {
        const item = {
          holdingLocation: [{ id: 'ma' }],
          physFulfillment: 'fulfillment:sasb-onsite',
          idNyplSourceId: { '@type': 'SierraNypl' }
        }
        // It's 9:00am
        nowTimestamp = '2023-06-01T13:00:00.000Z'
        // Without an active hold request, the estimate is:
        expect(await estimator.getPickupTimeEstimate(item, 'ma')).to.deep.equal({
          time: '2023-06-01T14:30:00.000Z',
          estimate: `today by 10:30am${tzNote}`
        })
        // At 10:00am I consider placing a hold request:
        nowTimestamp = '2023-06-01T14:00:00.000Z'
        // Without an active hold request, the estimate is:
        expect(await estimator.getPickupTimeEstimate(item, 'ma')).to.deep.equal({
          time: '2023-06-01T14:30:00.000Z',
          estimate: `today by 10:30am${tzNote}`
        })
        // At 10:05 I place a hold request:
        nowTimestamp = '2023-06-01T14:05:00.000Z'
        const holdPlaced = nowTimestamp
        expect(await estimator.getPickupTimeEstimate(item, 'ma', holdPlaced)).to.deep.equal({
          // 10:05 + 45mins === 10:50am
          time: '2023-06-01T14:50:00.000Z',
          // Initially it's 45 mins, so rounds up to about "an hour"
          estimate: 'in an hour'
        })
        // 1 min later...
        nowTimestamp = '2023-06-01T14:06:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item, 'ma', holdPlaced)).to.deep.equal({
          time: '2023-06-01T14:50:00.000Z',
          estimate: `today by approximately 11:00am${tzNote}`
        })
        // 20 min later...
        nowTimestamp = '2023-06-01T14:06:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item, 'ma', holdPlaced)).to.deep.equal({
          time: '2023-06-01T14:50:00.000Z',
          estimate: `today by approximately 11:00am${tzNote}`
        })
        // 45 min later...
        nowTimestamp = '2023-06-01T14:50:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item, 'ma', holdPlaced)).to.deep.equal({
          time: '2023-06-01T14:50:00.000Z',
          estimate: `today by approximately 11:00am${tzNote}`
        })
        // 45 min later...
        nowTimestamp = '2023-06-01T14:51:00.000Z'
        expect(await estimator.getPickupTimeEstimate(item, 'ma', holdPlaced)).to.deep.equal({
          time: '2023-06-01T14:50:00.000Z',
          estimate: `today by approximately 11:00am${tzNote}`
        })
      })
    })

    describe('human readable estimate', () => {
      const item = {
        holdingLocation: [{ id: 'ma' }],
        physFulfillment: 'fulfillment:sasb-onsite',
        idNyplSourceId: { '@type': 'SierraNypl' }
      }

      it('onsite sasb pre-request', async () => {
        // 10:30am ET on a Friday:
        nowTimestamp = '2023-06-02T14:30:00.000Z'
        expect((await estimator.getPickupTimeEstimate(item, 'ma')).estimate).to.equal('in an hour')
        // 2:30pm ET on a Friday:
        nowTimestamp = '2023-06-02T18:30:00.000Z'
        expect((await estimator.getPickupTimeEstimate(item, 'ma')).estimate).to.equal('in an hour')
      })

      it('by approximately OPENING TOMORROW', async () => {
        expect((await estimator.getPickupTimeEstimate(item, 'ma', '2023-06-01T22:00:00+00:00')).estimate)
          .to.equal(`tomorrow (6/2) by 10:30am${tzNote}`)
      })

      it('request made after request cutoff time, library is closed tomorrow', async () => {
        expect((await estimator.getPickupTimeEstimate(item, 'ma', '2023-06-03T22:00:00+00:00')).estimate)
          .to.equal(`Monday (6/5) by 10:30am${tzNote}`)
      })
    })
  })
})
