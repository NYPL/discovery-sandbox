/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { mockRouterContext } from '../helpers/routing';
import item from '../fixtures/libraryItems';
import appConfig from '../../src/app/data/appConfig';

// Import the component that is going to be tested
import ItemTableRow from '../../src/app/components/Item/ItemTableRow';

const context = mockRouterContext();

describe('ItemTableRow - search view', () => {
  describe('No rendered row', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTableRow isDesktop={true} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTableRow isDesktop={true} item={{}} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if the item is an electronic resource', () => {
      const component = shallow(
        <ItemTableRow isDesktop={true} item={{ isElectronicResource: true }} />,
      );

      expect(component.type()).to.equal(null);
    });
  });

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isDesktop={true} item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.html().startsWith('<tr')).to.be.true;
      });

      it('should return three <td>', () => {
        expect(component.find('td').length).to.equal(3);
      });

      it('should not have a format as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal(' ');
      });

      it('should not have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should not have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal('');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isDesktop={true} item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.html().startsWith('<tr')).to.be.true;
      });

      it('should return three <td>', () => {
        expect(component.find('td').length).to.equal(3);
      });

      it('should have a format as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal('Text');
      });

      it('should have call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a location as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(
          'SASB M1 - General Research - Room 315',
        );
      });
    });

    describe('Requestable non-ReCAP NYPL item', () => {
      const data = item.requestable_nonReCAP_NYPL;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isDesktop={true} item={data} />);
      });

      it('should have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a location as the third <td> column data and not a button', () => {
        expect(component.find('td').at(2).render().text()).to.equal(
          'SASB M1 - General Research - Room 315',
        );
      });
    });

    describe('Non-Requestable non-ReCAP NYPL item', () => {
      const data = item.nonrequestable_nonReCAP_NYPL;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isDesktop={true} item={data} />);
      });

      it('should have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('JFE 07-5007 ---');
      });
      it('should have a location as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(
          'SASB M1 - General Research - Room 315',
        );
      });
    });

    describe('with "on-site-edd" feature flag', () => {
      let component;

      describe('unrequestable NYPL item', () => {
        before(() => {
          const data = item.full;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(
            <ItemTableRow isDesktop={true} item={data} bibId='b12345' />,
          );
        });
      });

      describe('requestable NYPL item', () => {
        before(() => {
          const data = item.requestable_nonReCAP_NYPL;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(
            <ItemTableRow isDesktop={true} item={data} bibId='b12345' />,
          );
        });
        it('should render `Email for access options` and mailto link in the fourth <td> column data', () => {
          expect(component.find('td').find('div').length).to.equal(0);
          expect(component.find('td').find('a').length).to.equal(0);
        });
      });
    });

    describe('closure scenarios', () => {
      it('should not show request button for recap if recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [''];

        after(() => (appConfig.recapClosedLocations = []));

        before(() => {
          component = mount(
            <ItemTableRow isDesktop={true} item={data} bibId='b12345' />,
            { context },
          );
        });

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal(
            'Request',
          );
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });

      it('should show request button for recap if non-recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [];

        before(() => {
          component = mount(
            <ItemTableRow isDesktop={true} item={data} bibId='b12345' />,
            { context },
          );
        });

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal(
            'Request',
          );
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });

      it('should not show request button for recap if everything is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.closedLocations = [];

        before(() => {
          component = mount(
            <ItemTableRow isDesktop={true} item={data} bibId='b12345' />,
            { context },
          );
        });

        after(() => (appConfig.closedLocations = []));

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal(
            'Request',
          );
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });
    });
  });
});
