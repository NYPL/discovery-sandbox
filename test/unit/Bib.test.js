/* eslint-env mocha */
import { expect } from 'chai';
import { stub } from 'sinon';
import fs from 'fs';

import NyplApiClient from '@nypl/nypl-data-api-client';

import Bib from './../../src/server/ApiRoutes/Bib';

describe('Bib', () => {
  /* holding could lack location, as shown in second holding */
  const mockBib = {
    extent: ['99 bottles of beer'],
    dimensions: ['99 x 99 cm'],
    holdings: [
      {
        location: [{
          label: 'Mid-Manhattan',
          code: 'mm',
        }],
        format: 'Text',
        checkInBoxes: [
          {
            position: 1,
            status: 'available',
            coverage: '1000',
            shelfMark: 'abcd',
          },
          {
            position: 3,
            status: 'available',
            coverage: '1001',
            shelfMark: 'efgh',
          },
        ],
      },
      {
        format: 'AV',
        checkInBoxes: [
          {
            position: 2,
            status: 'available',
            coverage: '1002',
            shelfMark: 'ijkl',
          },
          {
            position: 4,
            status: 'Expected',
            coverage: '1003',
            shelfMark: 'mnop',
          },
        ],
      },
    ],
  };

  describe('nyplApiClientCall', () => {
    let apiClientStub
    let urlRecord
    before(() => {
      apiClientStub = stub(NyplApiClient.prototype, 'get').callsFake((url) => {
        urlRecord = url
        return { bib: { id: '123' } }
      })
    });
    afterEach(() => {
      urlRecord = null
    })
    after(() => {
      apiClientStub.restore();
    });
    it('.annotated-marc', () => {
      const query = 'b12345678.annotated-marc'
      Bib.nyplApiClientCall(query)
      expect(apiClientStub.calledWith(`/discovery/resources/${query}`))
    })
    it('regular bib call', async function () {
      const query = 'b12345678'
      const itemFrom = 3
      const itemFilterStr = 'items_location=loc:123'
      await Bib.nyplApiClientCall(query, itemFrom, itemFilterStr)
      expect(urlRecord).to.equal('/discovery/resources/b12345678?items_size=20&items_from=3&items_location=loc:123&merge_checkin_card_items=true')
    })
    it('with no itemFrom', async function () {
      const query = 'b12345678'
      const itemFilterStr = 'items_location=loc:123'
      await Bib.nyplApiClientCall(query, undefined, itemFilterStr)
      expect(urlRecord).to.equal('/discovery/resources/b12345678?items_location=loc:123&merge_checkin_card_items=true')
    })
    it('with no itemFilterStr', async function () {
      const query = 'b12345678'
      const itemFrom = 3
      await Bib.nyplApiClientCall(query, itemFrom,)
      expect(urlRecord).to.equal('/discovery/resources/b12345678?items_size=20&items_from=3&merge_checkin_card_items=true')
    })
    it('with neither itemFrom nor itemFilterStr', async function () {
      const query = 'b12345678'
      await Bib.nyplApiClientCall(query, undefined,)
      expect(urlRecord).to.equal('/discovery/resources/b12345678?merge_checkin_card_items=true')
    })
  })
});
