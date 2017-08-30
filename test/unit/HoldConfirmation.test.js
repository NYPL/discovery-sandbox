/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import HoldConfirmation from './../../src/app/components/HoldConfirmation/HoldConfirmation.jsx';
import Actions from './../../src/app/actions/Actions.js';

describe('HoldConfirmation', () => {
  describe('After being rendered, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
        searchKeywords: 'Bryant',
      },
    };

    before(() => {
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should check if the patron is logged in.', () => {
      expect(requireUser.calledOnce).to.equal(true);
    });
  });

  describe('If the patron is not logged in, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
        searchKeywords: 'Bryant',
      },
    };

    before(() => {
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should redirect the patron to OAuth log in page.', () => {
      expect(requireUser.returnValues[0]).to.equal(false);
    });
  });

  describe('If the patron is logged in but the App doesn\'t get valid data,<HoldConfirmation>',
    () => {
      let component;
      let requireUser;
      const location = {
        query: {
          pickupLocation: 'myr',
          searchKeywords: 'Bryant',
          errorStatus: 500,
          errorMessage: 'Something is wrong with the server.',
        },
      };

      before(() => {
        Actions.updatePatronData({
          id: '6677200',
          names: ['Leonard, Mike'],
          barcodes: ['162402680435300'],
        });
        requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
        component = mount(<HoldConfirmation location={location} />);
      });

      after(() => {
        requireUser.restore();
        component.unmount();
      });

      it('should pass the patron data check in requireUser().', () => {
        expect(requireUser.returnValues[0]).to.equal(true);
      });

      it('should render the error message.', () => {
        const main = component.find('main');

        expect(main.contains(
          <p>
            We could not process your request at this time. Please try again or contact 917-ASK-NYPL
            (<a href="tel:19172756975">917-275-6975</a>).
          </p>
        )).to.equal(true);
      });
    }
  );

  describe('If the patron is logged in and the App receives valid data, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
      },
    };

    const bib = {
      title: ['Harry Potter'],
    };

    before(() => {
      Actions.updatePatronData({
        id: '6677200',
        names: ['Leonard, Mike'],
        barcodes: ['162402680435300'],
      });
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} bib={bib} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should display the layout of request confirmation page\'s header.', () => {
      const main = component.find('main');
      const pageHeader = component.find('.nypl-request-page-header');

      expect(main).to.have.length(1);
      expect(pageHeader).to.have.length(1);
      expect(pageHeader.find('h1')).to.have.length(1);
      expect(pageHeader.find('h1').text()).to.equal('Request Confirmation');
      expect(pageHeader.contains(<h1>Request Confirmation</h1>)).to.equal(true);
    });

    it('should display the layout of request confirmation page\'s contents.', () => {
      const main = component.find('main');

      expect(main.find('h2')).to.have.length(1);
      expect(main.find('h2').text()).to.equal('Submission Received');
      expect(main.contains(<h2>Submission Received</h2>)).to.equal(true);

      expect(main.find('h3')).to.have.length(2);
      expect(main.find('#item-information').text()).to.equal('Item Information');
      expect(main.find('#electronic-delivery').text()).to.equal('Electronic Delivery');
      expect(main.contains(<h3 id="item-information">Item Information</h3>)).to.equal(true);
      expect(main.contains(<h3 id="electronic-delivery">Electronic Delivery</h3>)).to.equal(true);
    });

    it('should deliver the item\'s title on the page.', () => {
      const main = component.find('main');

      expect(main.find('#item-link')).to.have.length(1);
      expect(main.find('#item-link').text()).to.equal('Harry Potter');
    });

    it('should have the link back to homepage.', () => {
      const main = component.find('main');

      expect(main.find('#start-new-search')).to.have.length(1);
      expect(main.find('#start-new-search').text()).to.equal('Start a new search');
    });
  });

  describe('If the patron get here from a search result page, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
        searchKeywords: 'Bryant',
      },
    };

    const bib = {
      title: ['Harry Potter'],
    };

    before(() => {
      Actions.updatePatronData({
        id: '6677200',
        names: ['Leonard, Mike'],
        barcodes: ['162402680435300'],
      });
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} bib={bib} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should have the link back to search result.', () => {
      const main = component.find('main');

      expect(main.find('#start-new-search')).to.have.length(1);
      expect(main.find('#start-new-search').text()).to.equal('start a new search');
      expect(main.find('#go-back-search-results')).to.have.length(1);
      expect(main.find('#go-back-search-results').text()).to.equal(
        'Go back to your search results'
      );
    });
  });

  describe('If the patron get here from a classic catalog search result page, <HoldConfirmation>',
    () => {
      let component;
      let requireUser;
      const location = {
        query: {
          pickupLocation: 'myr',
          searchKeywords: 'Bryant',
          fromUrl: 'https://catalog.nypl.org/search~S1/?searchtype=X&searcharg=bryant&' +
            'searchscope=1&sortdropdown=-&SORT=DZ&extended=0&SUBMIT=Search&searchlimits' +
            '=&searchorigarg=Xbryant%26SORT%3DD',
        },
      };

      const bib = {
        title: ['Harry Potter'],
      };

      before(() => {
        Actions.updatePatronData({
          id: '6677200',
          names: ['Leonard, Mike'],
          barcodes: ['162402680435300'],
        });
        requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
        component = mount(<HoldConfirmation location={location} bib={bib} />);
      });

      after(() => {
        requireUser.restore();
        component.unmount();
      });

      it('should have the link back to the classic catalog homepage or and search result page',
        () => {
          const main = component.find('main');

          expect(main.find('#go-back-catalog')).to.have.length(1);
          expect(main.contains(
            <span id="go-back-catalog">
              <a href={location.query.fromUrl}>Go back to your search
              results</a> or <a href="https://catalog.nypl.org/search">start a new search</a>.
            </span>
          )).to.equal(true);
        }
      );
    }
  );
});
