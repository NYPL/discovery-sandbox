/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
// Import the component that is going to be tested
import ItemTableRow from './../../src/app/components/Item/ItemTableRow';

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
  requestable_ReCAP_available: {
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
    isRecap: true,
    itemSource: 'sierra-nypl',
    location: 'SASB M1 - General Research - Room 315',
    nonRecapNYPL: false,
    requestable: true,
    status: {
      '@id': 'status:a',
      prefLabel: 'Available',
    },
    suppressed: false,
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
  requestable_ReCAP_not_available: {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    available: false,
    barcode: '33433078478272',
    callNumber: 'JFE 07-5007 ---',
    id: 'i17326129',
    isElectronicResource: false,
    isOffsite: false,
    isRecap: true,
    itemSource: 'sierra-nypl',
    location: 'SASB M1 - General Research - Room 315',
    nonRecapNYPL: false,
    requestable: true,
    status: {
      '@id': 'status:a',
      prefLabel: 'Available',
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
        expect(component.prop('className')).to.equal('available');
      });

      it('should return four <td>', () => {
        expect(component.find('td').length).to.equal(4);
      });

      it('should not have a location as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal(' ');
      });

      it('should not have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should not have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });

      it('should not have an access message as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal(' ');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
        expect(component.prop('className')).to.equal('available');
      });

      it('should return four <td>', () => {
        expect(component.find('td').length).to.equal(4);
      });

      it('should a location as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal('SASB M1 - General Research - Room 315');
      });

      it('should have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal('Available');
      });

      it('should have an access message as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('USE IN LIBRARY');
      });
    });

    describe('Requestable non-ReCAP NYPL item', () => {
      const data = item.requestable_nonReCAP_NYPL;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should a location as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal('SASB M1 - General Research - Room 315');
      });

      it('should have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a status as the third <td> column data and not a button', () => {
        expect(component.find('td').at(2).text()).to.equal('Available');
        expect(component.find('td').at(2).render().find('Link').length).to.equal(0);
      });

      it('should have an access message as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('USE IN LIBRARY');
      });
    });

    describe('Requestable ReCAP available item', () => {
      const data = item.requestable_ReCAP_available;
      let dummyBibId;
      let dummyItemId;
      let component;
      const getRecord = (e, bibId, itemId) => {
        dummyBibId = bibId;
        dummyItemId = itemId;
      };

      before(() => {
        component =
          shallow(<ItemTableRow item={data} getRecord={getRecord} bibId="b12345" />);
      });

      it('should render the Request button the third <td> column data', () => {
        expect(component.find('td').at(2).render().text()).to.equal('Request');
        expect(component.find('td').find('Link').length).to.equal(1);
      });

      it('should call the getRecord prop function when the Request button is clicked', () => {
        const link = component.find('td').find('Link');

        expect(dummyBibId).to.equal(undefined);
        expect(dummyItemId).to.equal(undefined);
        link.simulate('click');
        expect(dummyBibId).to.equal('b12345');
        expect(dummyItemId).to.equal('i17326129');
      });
    });

    describe('Requestable ReCAP unavailable item', () => {
      const data = item.requestable_ReCAP_not_available;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} bibId="b12345" />);
      });

      it('should not render the Request button the third <td> column data', () => {
        expect(component.find('td').find('Link').length).to.equal(0);
      });

      it('should render "In Use" as the request label', () => {
        expect(component.find('td').at(2).text()).to.equal('In Use');
      });
    });
  });
});
