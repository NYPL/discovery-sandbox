import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { stub } from 'sinon';
import appConfig from '../../src/app/data/appConfig';
import { noop } from '../../src/app/utils/utils';
import item from '../fixtures/libraryItems';
import { mockRouterContext } from '../helpers/routing';
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
      const component = shallow(
        <ItemTableRow item={{ isElectronicResource: true }} />,
      );

      expect(component.type()).to.equal(null);
    });
  });

  describe('Rendered row[s]', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = mount(<ItemTableRow item={data} />);
      });

      // This will return a fragment with a children list of <tr> elements
      // On BibPage only one row, others, two rows
      it('should return a <tr>', () => {
        const bibPage = shallow(<ItemTableRow item={data} page='BibPage' />);
        expect(bibPage.find('tr')).to.have.lengthOf(1);

        expect(component.find('tr')).to.have.lengthOf(2);
        expect(component.find('tr').at(0).prop('className')).to.equal(
          'available',
        );
      });

      it('should return four <td>', () => {
        expect(component.find('td').length).to.equal(4);
      });

      it('should not have a format as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal(' ');
      });

      it('should not have a call number as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should not have a location as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });

      it('should not have a Availability && Access message as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;
      let tdList;

      before(() => {
        component = mount(<ItemTableRow item={data} />);
        tdList = component.find('td');
      });

      it('should return a <tr>', () => {
        const bibPage = shallow(<ItemTableRow item={data} page='BibPage' />);
        expect(bibPage.find('tr')).to.have.lengthOf(1);

        expect(component.find('tr')).to.have.lengthOf(2);
        expect(component.find('tr').at(0).prop('className')).to.equal(
          'available',
        );
      });

      it('should return four <td>', () => {
        expect(tdList.length).to.equal(4);
      });

      it('should have a format as the first <td> column data', () => {
        expect(tdList.at(0).text()).to.equal(data.format);
      });

      it('should have a call number as the second <td> column data', () => {
        expect(tdList.at(1).text()).to.equal(data.callNumber);
      });

      it('should have a location as the third <td> column data', () => {
        expect(tdList.at(2).text()).to.equal(data.location);
      });

      it('should have an availability message as the fourth <td> column data', () => {
        expect(tdList.at(3).text()).to.equal(data.status.prefLabel);
      });

      // TODO: Relevance, are we using this message?
      // it('should have an access message as the second <td> column data', () => {
      //   expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      // });
    });

    describe('Requestable non-ReCAP NYPL item', () => {
      const data = item.requestable_nonReCAP_NYPL;
      let component;
      let tdList;

      before(() => {
        component = mount(<ItemTableRow item={data} />);
        tdList = component.find('td');
      });

      it('should return four <td>', () => {
        expect(tdList.length).to.equal(4);
      });

      it('should not have a format as the first <td> column data', () => {
        // NOTE: No Format was passed in from data item
        expect(tdList.at(0).text()).to.equal(' ');
      });

      it('should have a call number as the second <td> column data', () => {
        expect(tdList.at(1).text()).to.equal(data.callNumber);
      });

      it('should have a location as the third <td> column data', () => {
        expect(tdList.at(2).text()).to.equal(data.location);
      });

      it('should not be physically requestable with a Status message', () => {
        expect(tdList.at(3).find('Link').length).to.equal(0);
        expect(tdList.at(3).text()).to.equal('Available');
      });

      // NOTE: Relevance? Are we using messages
      // it('should have an access message as the second <td> column data', () => {
      //   expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      // });
    });

    describe('Non-Requestable non-ReCAP NYPL item', () => {
      const data = item.nonrequestable_nonReCAP_NYPL;
      let component;
      let tdList;

      before(() => {
        component = mount(<ItemTableRow item={data} />);
        tdList = component.find('td');
      });

      it('should return four <td>', () => {
        expect(tdList.length).to.equal(4);
      });

      it('should not have a format as the first <td> column data', () => {
        // NOTE: No Format was passed in from data item
        expect(tdList.at(0).text()).to.equal(' ');
      });

      it('should have a call number as the second <td> column data', () => {
        expect(tdList.at(1).text()).to.equal(data.callNumber);
      });

      it('should have a location as the third <td> column data', () => {
        expect(tdList.at(2).text()).to.equal(data.location);
      });

      it('should have a availability string as the fourth <td> column data', () => {
        expect(tdList.at(3).find('Link').length).to.equal(0);
        expect(tdList.at(3).text()).to.equal('Available');
      });

      // TODO: NOTE: Relevance? Are we using messages
      // it('should have an access message as the second <td> column data', () => {
      //   expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      // });
    });

    describe('Requestable ReCAP available item', () => {
      const data = item.requestable_ReCAP_available;
      let component;
      let getItemRecord;
      let tdList;

      before(function () {
        getItemRecord = stub(ItemTableRow.prototype, 'getItemRecord').callsFake(
          noop,
        );
        component = mount(<ItemTableRow item={data} bibId='b12345' />, {
          context,
        });
        tdList = component.find('td');
      });

      after(function () {
        getItemRecord.restore();
      });

      it('should render the Physical Request button in the fourth <td> column', () => {
        const link = tdList.at(3).find('Link');
        expect(link.length).to.equal(2);
        expect(link.at(0).text()).to.equal('Request for Onsite Use');
      });

      it('should call the getItemRecord function when the Request button is clicked', () => {
        const link = tdList.at(3).find('Link');
        link.at(0).simulate('click');
        expect(getItemRecord.calledOnce).to.equal(true);
      });
    });

    describe('Requestable ReCAP unavailable item', () => {
      const data = item.requestable_ReCAP_not_available;
      let component;
      let tdList;

      before(() => {
        component = mount(<ItemTableRow item={data} bibId='b12345' />);
        tdList = component.find('td');
      });

      it('should not render the Physical Request button', () => {
        expect(tdList.find('Link').length).to.equal(0);
      });

      it('should render the status preLabel property as the request label', () => {
        expect(tdList.at(3).text()).to.equal(data.status.prefLabel);
      });
    });

    describe('Aeon-requestable item without params', () => {
      const data = item.aeonRequestableWithoutParams;
      let component;
      const expectedUrl = `https://specialcollections.nypl.org/aeon/Aeon.dll?Action=10&Form=30&Title=%5BSongs+and+piano+solos+%2F&Site=SCHMA&Author=Bechet%2C+Sidney%2C&Date=1941-1960.&ItemInfo3=https%3A%2F%2Fnypl-sierra-test.nypl.org%2Frecord%3Db11545018x&ReferenceNumber=b11545018x&ItemInfo1=USE+IN+LIBRARY&Genre=Score&Location=Schomburg+Center&shelfmark=Sc+Scores+Bechet&itemid=33299542&ItemISxN=i33299542&itemNumber=45678&CallNumber=Sc+Scores+Bechet`;

      before(() => {
        component = mount(<ItemTableRow item={data} bibId='b12345' />);
        tdList = component.find('td');
      });

      it('should have a link to aeon', () => {
        expect(tdList.at(3).find('Link').at(0).text()).to.equal(
          'Make Appointment',
        );
        expect(tdList.at(3).find('Link').at(0).prop('href')).to.equal(
          expectedUrl,
        );
      });

      it('should have a span with appointment required text', () => {
        const span = component.find('.nypl-request-btn-label');
        expect(span.length).to.equal(1);
        expect(span.at(0).text()).to.equal('Appointment Required. Details');
      });
    });

    describe('Aeon-requestable item with params', () => {
      const data = item.aeonRequestableWithParams;
      let component;
      const expectedUrl = `https://specialcollections.nypl.org/aeon/Aeon.dll?Action=10&Form=30&Title=%5BSongs+and+piano+solos+%2F&Site=SCHMA&CallNumber=Sc+Scores+Bechet&Author=Bechet%2C+Sidney%2C&Date=1941-1960.&ItemInfo3=https%3A%2F%2Fnypl-sierra-test.nypl.org%2Frecord%3Db11545018x&ReferenceNumber=b11545018x&ItemInfo1=USE+IN+LIBRARY&ItemISxN=i33299542&Genre=Score&Location=Schomburg+Center&shelfmark=Sc+Scores+Bechet&itemid=33299542&itemNumber=45678`;

      before(() => {
        component = mount(<ItemTableRow item={data} bibId='b12345' />);
        tdList = component.find('td');
      });

      it('should have a link to aeon', () => {
        expect(tdList.at(3).find('Link').at(0).text()).to.equal(
          'Make Appointment',
        );
        expect(tdList.at(3).find('Link').at(0).prop('href')).to.equal(
          expectedUrl,
        );
      });

      it('should have a span with appointment required text', () => {
        const span = component.find('.nypl-request-btn-label');
        expect(span.length).to.equal(1);
        expect(span.at(0).text()).to.equal('Appointment Required. Details');
      });
    });

    describe('with "on-site-edd" feature flag', () => {
      let component;

      describe('unrequestable NYPL item', () => {
        before(() => {
          const data = item.full;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(<ItemTableRow item={data} bibId='b12345' />);
        });
      });

      describe('requestable NYPL item', () => {
        before(() => {
          const data = item.requestable_nonReCAP_NYPL;
          data.holdingLocationCode = 'loc:mal82';
          component = mount(<ItemTableRow item={data} bibId='b12345' />);
        });

        it('should render `Email for access options` and mailto link in the fourth <td> column data', () => {
          // TODO: Relevance: Should we get rid of this.
          // expect(component.find('td').find('div').length).to.equal(0);
          // expect(component.find('td').find('a').length).to.equal(0);
        });
      });
    });

    // TODO: Relevance: Should we get rid of this.
    // The current implementation of the new Request buttons do not
    // implement the Closed Locations scenarios
    // Investigate wether this is still desirec.
    describe('closed locations scenarios', () => {
      it('should not show request button for recap if recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [''];

        after(() => (appConfig.recapClosedLocations = []));

        before(() => {
          component = mount(<ItemTableRow item={data} bibId='b12345' />, {
            context,
          });
        });

        // TODO: This does not get exectuted by Mocha
        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(3).text()).to.equal('Request');
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });

      it('should show request button for recap if non-recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [];

        before(() => {
          component = mount(<ItemTableRow item={data} bibId='b12345' />, {
            context,
          });
        });

        // TODO: This does not get exectuted by Mocha
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
          component = mount(<ItemTableRow item={data} bibId='b12345' />, {
            context,
          });
        });

        after(() => (appConfig.closedLocations = []));
        // TODO: This does not get exectuted by Mocha
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
