/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { shallow, mount } from 'enzyme';
import { mockRouterContext } from '../helpers/routing';
import item from '../fixtures/item';
import AppConfigStore from '../../src/app/stores/AppConfigStore';

// Import the component that is going to be tested
import ItemTableRow from './../../src/app/components/Item/ItemTableRow';

const context = mockRouterContext();

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
        expect(component.find('td').at(2).render().text()).to.equal('Request');
        expect(component.find('td').find('Link').length).to.equal(1);
      });

      it('should have an access message as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('USE IN LIBRARY');
      });
    });

    describe('Non-Requestable non-ReCAP NYPL item', () => {
      const data = item.nonrequestable_nonReCAP_NYPL;
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
      let component;
      let getItemRecord;

      before(() => {
        getItemRecord = spy(ItemTableRow.prototype, 'getItemRecord');
        component =
          mount(<ItemTableRow item={data} bibId="b12345" />, { context });
      });

      it('should render the Request button the third <td> column data', () => {
        expect(component.find('td').at(2).render().text()).to.equal('Request');
        expect(component.find('td').find('Link').length).to.equal(1);
      });

      it('should call the getItemRecord function when the Request button is clicked', () => {
        const link = component.find('td').find('Link');
        link.simulate('click', { preventDefault: () => {} });
        expect(getItemRecord.calledOnce).to.equal(true);
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

    describe('with "on-site-edd" feature flag', () => {
      let component;
      let appConfigStoreStub;
      const generalResearchEmail = 'example@nypl.com';
      before(() => {
        appConfigStoreStub = stub(AppConfigStore, 'getState').returns({
          generalResearchEmail,
          features: ['on-site-edd'],
          closedLocations: [],
        });
      });
      after(() => {
        appConfigStoreStub.restore();
      });

      describe('unrequestable NYPL item', () => {
        before(() => {
          const data = item.full;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(<ItemTableRow item={data} bibId="b12345" />);
        });
        it('should render `Email for access options` and mailto link in the fourth <td> column data', () => {
          expect(component.find('td').find('a').length).to.equal(1);
          expect(component.find('td').find('a').text()).to.equal(generalResearchEmail);
          expect(component.find('td').find('a').props().href).to.include(generalResearchEmail);
        });
      });

      describe('requestable NYPL item', () => {
        before(() => {
          const data = item.requestable_nonReCAP_NYPL;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(<ItemTableRow item={data} bibId="b12345" />);
        });
        it('should render `Email for access options` and mailto link in the fourth <td> column data', () => {
          expect(component.find('td').find('div').length).to.equal(0);
          expect(component.find('td').find('a').length).to.equal(0);
        });
      });
    });
  });
});
