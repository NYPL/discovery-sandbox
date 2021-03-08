/* eslint-env mocha */
import { expect } from 'chai';
// Import the component that is going to be tested
import Bib from './../../src/server/ApiRoutes/Bib';

describe('addCheckInItems', () => {
  const mockBib = {
    holdings: [
      {
        location: [{
          label: 'fake',
          code: 'fake:fake',
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
        location: [{
          label: 'mock',
          code: 'mock:mock',
        }],
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
      {
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
      }
    ],
  };

  it('should add correctly structured checkInItems', () => {
    Bib.addCheckInItems(mockBib);
    expect(mockBib.checkInItems).to.deep.equal([
      {
        accessMessage: {
          '@id': 'accessMessage: 1',
          prefLabel: 'Use in library',
        },
        available: true,
        callNumber: 'efgh',
        format: 'Text',
        holdingLocationCode: 'fake:fake',
        isSerial: true,
        location: 'fake',
        locationUrl: undefined,
        position: 3,
        requestable: false,
        status: {
          prefLabel: 'available',
        },
        volume: '1001',
      },
      {
        accessMessage: {
          '@id': 'accessMessage: 1',
          prefLabel: 'Use in library',
        },
        available: true,
        callNumber: 'ijkl',
        format: 'AV',
        isSerial: true,
        location: 'mock',
        locationUrl: undefined,
        holdingLocationCode: 'mock:mock',
        position: 2,
        requestable: false,
        status: {
          prefLabel: 'available',
        },
        volume: '1002',
      },
      {
        accessMessage: {
          '@id': 'accessMessage: 1',
          prefLabel: 'Use in library',
        },
        available: true,
        callNumber: 'abcd',
        format: 'Text',
        holdingLocationCode: 'fake:fake',
        isSerial: true,
        location: 'fake',
        locationUrl: undefined,
        position: 1,
        requestable: false,
        status: {
          prefLabel: 'available',
        },
        volume: '1000',
      },
    ]);
  });
});
