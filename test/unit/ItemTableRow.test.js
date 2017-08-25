/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Import the component that is going to be tested
import ItemTableRow from './../../src/app/components/Item/ItemTableRow.jsx';

const item = {
  full: {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    available: true,
    barcode: '33433078478272',
    callNumber: 'JFE 07-5007 ---',
    id: 'i17326129',
    isElectronicResource: false,
    isOffsite: false,
    isRecap: false,
    itemSource: 'sierra-nypl',
    location: 'SASB M1 - General Research - Room 315',
    nonRecapNYPL: true,
    requestable: false,
    status: {
      '@id': 'status:a',
      prefLabel: 'Available',
    },
    suppressed: false,
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
  missingData: {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: '',
    },
    availability: 'available',
    available: true,
    barcode: '33433078478272',
    callNumber: '',
    id: 'i17326129',
    isElectronicResource: false,
    isOffsite: false,
    isRecap: false,
    itemSource: 'sierra-nypl',
    location: '',
    nonRecapNYPL: true,
    requestable: false,
    status: {
      '@id': 'status:a',
      prefLabel: '',
    },
    suppressed: false,
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
  requestable_nonReCAP_NYPL: {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    available: true,
    barcode: '33433078478272',
    callNumber: 'JFE 07-5007 ---',
    id: 'i17326129',
    isElectronicResource: false,
    isOffsite: false,
    isRecap: false,
    itemSource: 'sierra-nypl',
    location: 'SASB M1 - General Research - Room 315',
    nonRecapNYPL: true,
    requestable: true,
    status: {
      '@id': 'status:a',
      prefLabel: 'Available',
    },
    suppressed: false,
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
  requestable_ReCAP: {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    available: true,
    barcode: '33433078478272',
    callNumber: 'JFE 07-5007 ---',
    id: 'i17326129',
    isElectronicResource: false,
    isOffsite: false,
    isRecap: false,
    itemSource: 'sierra-nypl',
    location: 'SASB M1 - General Research - Room 315',
    nonRecapNYPL: true,
    requestable: true,
    status: {
      '@id': 'status:a',
      prefLabel: 'Available',
    },
    suppressed: false,
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
};

describe('ItemTableRow', () => {
  describe('No rendered row', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTableRow />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTableRow item={{}} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if the item is an electronic resource', () => {
      const component = shallow(<ItemTableRow item={{ isElectronicResource: true }} />);

      expect(component.type()).to.equal(null);
    });
  });

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
      });
    });
  });
});
