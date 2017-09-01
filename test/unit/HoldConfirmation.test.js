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
    let modelDeliveryLocationName;
    const location = {
      query: {
        pickupLocation: 'mala',
      },
    };

    const bib = {
      title: ['Harry Potter'],
    };

    const deliveryLocations = [
      {
        '@id': 'loc:myr',
        address: '40 Lincoln Center Plaza',
        prefLabel: 'Performing Arts Research Collections',
        shortName: 'Library for the Performing Arts',
      },
      {
        '@id': 'loc:sc',
        prefLabel: 'Schomburg Center',
        address: '515 Malcolm X Boulevard',
        shortName: 'Schomburg Center',
      },
      {
        '@id': 'loc:mala',
        prefLabel: 'Schwarzman Building - Allen Scholar Room',
        address: '476 Fifth Avenue (42nd St and Fifth Ave)',
        shortName: 'Schwarzman Building',
      },
    ];

    before(() => {
      Actions.updatePatronData({
        id: '6677200',
        names: ['Leonard, Mike'],
        barcodes: ['162402680435300'],
      });
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      modelDeliveryLocationName = sinon.spy(
        HoldConfirmation.prototype,
        'modelDeliveryLocationName'
      );
      component = mount(
        <HoldConfirmation
          location={location}
          bib={bib}
          deliveryLocations={deliveryLocations}
        />
      );
    });

    after(() => {
      requireUser.restore();
      modelDeliveryLocationName.restore();
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

      expect(main.find('h3')).to.have.length(2);
      expect(main.find('#physical-delivery').text()).to.equal('Physical Delivery');
      expect(main.find('#electronic-delivery').text()).to.equal('Electronic Delivery');
      expect(main.contains(<h3 id="physical-delivery">Physical Delivery</h3>)).to.equal(true);
      expect(main.contains(<h3 id="electronic-delivery">Electronic Delivery</h3>)).to.equal(true);
      expect(main.find('.item')).to.have.length(1);
    });

    it('should render the message for the physical delivery location.', () => {
      const main = component.find('main');

      expect(modelDeliveryLocationName.returnValues[0]).to.equal(
        'Schwarzman Building - Allen Scholar Room'
      );

      expect(main.find('#delivery-location')).to.have.length(1);
      expect(main.find('#delivery-location').text()).to.equal(
        'The item will be delivered to: Schwarzman Building - Allen Scholar Room'
      );
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

  describe('If the App does not receive valid pick up location data', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: '',
      },
    };

    const bib = {
      title: ['Harry Potter'],
    };

    const deliveryLocations = [
      {
        '@id': 'loc:myr',
        address: '40 Lincoln Center Plaza',
        prefLabel: 'Performing Arts Research Collections',
        shortName: 'Library for the Performing Arts',
      },
      {
        '@id': 'loc:sc',
        prefLabel: 'Schomburg Center',
        address: '515 Malcolm X Boulevard',
        shortName: 'Schomburg Center',
      },
      {
        '@id': 'loc:mala',
        prefLabel: 'Schwarzman Building - Allen Scholar Room',
        address: '476 Fifth Avenue (42nd St and Fifth Ave)',
        shortName: 'Schwarzman Building',
      },
    ];

    before(() => {
      Actions.updatePatronData({
        id: '6677200',
        names: ['Leonard, Mike'],
        barcodes: ['162402680435300'],
      });
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(
        <HoldConfirmation
          location={location}
          bib={bib}
          deliveryLocations={deliveryLocations}
        />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should render the default error message.', () => {
      const main = component.find('main');

      expect(main.find('#delivery-location')).to.have.length(1);
      expect(main.contains(
        <p id="delivery-location">
          The item will be delivered to: <span>
            please <a href="https://gethelp.nypl.org/customer/portal/emails/new">email us</a> or
            call 917-ASK-NYPL (<a href="tel:19172756975">917-275-6975</a>) for your delivery
            location.
          </span>
        </p>
      )).to.equal(true);
    });
  });

  describe('If the App receives valid pick up location data but no locations data', () => {
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

    it('should render the defalut error message.', () => {
      const main = component.find('main');

      expect(main.find('#delivery-location')).to.have.length(1);
      expect(main.contains(
        <p id="delivery-location">
          The item will be delivered to: <span>
            please <a href="https://gethelp.nypl.org/customer/portal/emails/new">email us</a> or
            call 917-ASK-NYPL (<a href="tel:19172756975">917-275-6975</a>) for your delivery
            location.
          </span>
        </p>
      )).to.equal(true);
    });
  });

  describe('If the App receives pick up location as "edd"', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'edd',
      },
    };

    const deliveryLocations = [
      {
        '@id': 'loc:myr',
        address: '40 Lincoln Center Plaza',
        prefLabel: 'Performing Arts Research Collections',
        shortName: 'Library for the Performing Arts',
      },
      {
        '@id': 'loc:sc',
        prefLabel: 'Schomburg Center',
        address: '515 Malcolm X Boulevard',
        shortName: 'Schomburg Center',
      },
      {
        '@id': 'loc:mala',
        prefLabel: 'Schwarzman Building - Allen Scholar Room',
        address: '476 Fifth Avenue (42nd St and Fifth Ave)',
        shortName: 'Schwarzman Building',
      },
    ];

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
      component = mount(
        <HoldConfirmation
          location={location}
          bib={bib}
          deliveryLocations={deliveryLocations}
        />
      );
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should render the message for EDD.', () => {
      const main = component.find('main');

      expect(main.find('#delivery-location')).to.have.length(1);
      expect(main.find('#delivery-location').text()).to.equal(
        'The item will be delivered to: n/a (electronic delivery)'
      );
    });
  });

  describe('If the patron does not get here from a search result page, <HoldConfirmation>', () => {
    let component;
    const location = {
      query: {
        pickupLocation: 'myr',
      },
    };

    const bib = {
      title: ['Harry Potter'],
    };

    before(() => {
      component = mount(<HoldConfirmation location={location} bib={bib} />);
    });

    after(() => {
      component.unmount();
    });

    it('should have the link back to search result.', () => {
      const main = component.find('main');

      expect(main.find('#start-new-search')).to.have.length(1);
      expect(main.find('#start-new-search').text()).to.equal('Start a new search');
      expect(main.find('#go-back-search-results')).to.have.length(0);
    });
  });

  describe('If the patron gets here from a search result page, <HoldConfirmation>', () => {
    let component;
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
      component = mount(<HoldConfirmation location={location} bib={bib} />);
    });

    after(() => {
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

  describe('If the patron does not get here from a classic catalog, <HoldConfirmation>',
    () => {
      let component;
      let renderBackToClassicLink;
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
        renderBackToClassicLink = sinon.spy(HoldConfirmation.prototype, 'renderBackToClassicLink');
        component = mount(<HoldConfirmation location={location} bib={bib} />);
      });

      after(() => {
        renderBackToClassicLink.restore();
        component.unmount();
      });

      it('should not have the link back to the classic catalog homepage.',
        () => {
          const main = component.find('main');

          expect(renderBackToClassicLink.returnValues[0]).to.equal(false);

          expect(main.find('#go-back-catalog')).to.have.length(0);
        }
      );

      it('should have the link to shared collection catalog.', () => {
        const main = component.find('main');

        expect(main.find('#start-new-search').text()).to.equal(
          'start a new search'
        );
      });
    }
  );

  describe('If the patron gets here from a classic catalog search result page, <HoldConfirmation>',
    () => {
      let component;
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
        component = mount(<HoldConfirmation location={location} bib={bib} />);
      });

      after(() => {
        component.unmount();
      });

      it('should have the link back to the classic catalog homepage and search result page',
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

      it('should have the link to shared collection catalog.', () => {
        const main = component.find('main');

        expect(main.find('#go-to-shared-catalog').text()).to.equal(
          ' You may also try your search in our Shared Collection Catalog.'
        );
      });
    }
  );
});
