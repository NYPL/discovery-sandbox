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

  describe('addLocationUrls', () => {
    before(() => {
      stub(NyplApiClient.prototype, 'get').callsFake(() => Promise.resolve(
        JSON.parse(
          fs.readFileSync(
            './test/fixtures/locations-service-mm.json', 'utf8'))));
    });
    after(() => {
      NyplApiClient.prototype.get.restore();
    });
    it('should add location URLs', () => {
      Bib.addLocationUrls(mockBib).then((resp) => {
        expect(resp.holdings).to.deep.equal([
          {
            location: [{
              label: 'Mid-Manhattan',
              code: 'mm',
              url: 'http://www.nypl.org/locations/mid-manhattan-library',
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
        ]);
      });
    });
  });
  describe('nyplApiClientCall', () => {
    let apiClientStub
    before(() => {
      apiClientStub = stub(NyplApiClient.prototype, 'get').returns({ bib: { id: '123' } })
    });
    after(() => {
      apiClientStub.restore();
    });
    it('.annotated-marc', () => {
      const query = 'b12345678.annotated-marc'
      Bib.nyplApiClientCall(query)
      expect(apiClientStub.calledWith(`/discovery/resources/${query}`))
    })
    it('regular bib call', () => {
      const query = 'b12345678'
      const itemFrom = 3
      const itemFilterStr = 'items_location=loc:123'
      Bib.nyplApiClientCall(query, itemFrom,)
      expect(apiClientStub.calledWith(`/discovery/resources/${query}${itemFilterStr}&merge_checkin_card_items=true`))
    })
  })
});
