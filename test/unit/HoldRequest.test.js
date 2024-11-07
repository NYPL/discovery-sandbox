import appConfig from '@appConfig';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import React from 'react';
import { spy, stub } from 'sinon';
import mockedItem from '../fixtures/mocked-item';
import { makeTestStore, mountTestRender } from '../helpers/store';
import WrappedHoldRequest, {
  HoldRequest,
} from './../../src/app/pages/HoldRequest';

describe('HoldRequest', () => {
  let mock;
  before(() => {
    mock = new MockAdapter(axios);
    // All tests below (except the ineligible patron test) are premised on patron eligibility
    mock.onGet(
      '/research/collections/shared-collection-catalog/api/patronEligibility').reply(200, { eligibility: true });
  });

  describe('If the patron is logged in and the App receives invalid item data, <HoldRequest>',
    () => {
      let component;

      before(() => {
        component = mountTestRender(<WrappedHoldRequest />, {
          attachTo: document.body,
          store: makeTestStore({
            patron: {
              id: 1,
              loggedIn: true,
            },
            loading: false,
          }),
        });
      });

      after(() => {
        component.unmount();
      });

      it('should display the error message.', () => {
        const h2 = component.find('h2').first();

        expect(h2.text()).to.equal('This item cannot be requested at this time. Please try again later or contact 917-ASK-NYPL (917-275-6975).');
      });
    },
  );

  describe('If the patron is logged in and the App receives invalid delivery location data, ' +
    '<HoldRequest>', () => {
    let component;
    const bib = {
      title: ['Harry Potter'],
      '@id': 'res:b17688688',
      items: mockedItem,
    };

    before(() => {
      component = mountTestRender(
        <WrappedHoldRequest
          params={{ itemId: 'i10000003' }}
        />, {
          attachTo: document.body,
          store: makeTestStore({
            patron: { id: 1 },
            bib,
          }),
        });
    });

    after(() => {
      component.unmount();
    });

    it('should display the item title.', () => {
      const item = component.find('.item');
      expect(item.find('#item-link').at(1).text()).to.equal('Harry Potter');
    });

    it('should display the error message for invalid delivery locations.', () => {
      const form = component.find('form');

      setImmediate(() => {
        expect(form.find('h2')).to.have.length(1);
        expect(form.contains(
          <h2 className="nypl-request-form-title">
            Delivery options for this item are currently unavailable. Please try again later or
            contact 917-ASK-NYPL (<a href="tel:917-275-6975">917-275-6975</a>).
          </h2>)).to.equal(true);
      });
    });
  });

  describe('If the patron is logged in and the App receives valid delivery location data, ' +
    '<HoldRequest>', () => {
    let component;
    const bib = {
      title: ['Harry Potter'],
      '@id': 'res:b17688688',
      items: mockedItem,
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
      component = mountTestRender(
        <WrappedHoldRequest
          params={{ itemId: 'i10000003' }}
        />, {
          attachTo: document.body,
          store: makeTestStore({
            patron: { id: 1 },
            bib,
            deliveryLocations,
          }),
        });
    });

    after(() => {
      component.unmount();
    });

    it('should display the sentence "Choose a delivery option or location".', () => {
      const form = component.find('form');

      setImmediate(() => {
        expect(form.find('h2')).to.have.length(1);
        expect(form.contains(
          <h2 className="nypl-request-form-title">
            Choose a delivery location
          </h2>)).to.equal(true);
      });
    });

    it('should display the form of the display locations.', () => {
      const form = component.find('form');

      setImmediate(() => {
        expect(form.props().method).to.equal('POST');
      });
    });

    it('should display the avaialbe delivery locations, and the first location is selected ' +
      'by default.', () => {

      setImmediate(() => {
        const form = component.find('form');
        const fieldset = component.find('fieldset');

        expect(form.find('fieldset')).to.have.length(1);
        expect(fieldset.find('label')).to.have.length(3);
        expect(fieldset.find('legend')).to.have.length(1);
        expect(fieldset.find('label').at(0).find('input').props().type).to.equal('radio');
        expect(fieldset.find('label').at(1).find('input').props().type).to.equal('radio');
        expect(fieldset.find('label').at(2).find('input').props().type).to.equal('radio');
        expect(fieldset.find('label').at(0).find('input').props().checked).to.equal(true);
        expect(fieldset.find('label').at(1).find('input').props().checked).to.equal(false);
        expect(fieldset.find('label').at(2).find('input').props().checked).to.equal(false);
      });
    });

    it('should display the names and the addresses of the delivery locations.', () => {
      setImmediate(() => {
        const fieldset = component.find('fieldset');
        const label0 = fieldset.find('label').at(0);
        const label1 = fieldset.find('label').at(1);
        const label2 = fieldset.find('label').at(2);

        expect(label0.find('.nypl-screenreader-only').text()).to.equal('Send to:');
        expect(label0.find('.nypl-location-name').text()).to.equal('Library for the Performing Arts');
        expect(label0.find('.nypl-location-address').text()).to.equal('40 Lincoln Center Plaza');

        expect(label1.find('.nypl-screenreader-only').text()).to.equal('Send to:');
        expect(label1.find('.nypl-location-name').text()).to.equal('Schomburg Center');
        expect(label1.find('.nypl-location-address').text()).to.equal('515 Malcolm X Boulevard');

        expect(label2.find('.nypl-screenreader-only').text()).to.equal('Send to:');
        expect(label2.find('.nypl-location-name').text())
          .to.equal('Schwarzman Building - Allen Scholar Room');
        expect(label2.find('.nypl-location-address').text())
          .to.equal('476 Fifth Avenue (42nd St and Fifth Ave)');
      });
    });

    it('should deliver request button with the respective URL on the page.', () => {
      setImmediate(() => {
        const form = component.find('form');
        const requestBtn = form.find('button');

        expect(requestBtn.props().type).to.equal('submit');
        expect(requestBtn.text()).to.equal('Submit Request');
      });
    });
  });

  describe('Closure scenarios: ', () => {
    describe('when everything is closed', () => {
      let component;
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: mockedItem,
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
        component = mountTestRender(
          <WrappedHoldRequest
            params={{ itemId: 'i10000003' }}
            isEddRequestable
            closedLocations={['']}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1 },
              bib,
              appConfig: {
                closedLocations: [''],
                baseUrl: '/',
              },
              isEddRequestable: true,
              deliveryLocations,
            }),
          });
      });

      after(() => {
        component.unmount();
      });


      it('should display nothing ', () => {
        setImmediate(() => {
          const form = component.find('form');
          expect(form.find('fieldset')).to.have.length(0);
        });
      });
    });

    describe('for a recap item when recap is closed', () => {
      let component;
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: mockedItem,
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
        component = mountTestRender(
          <WrappedHoldRequest
            params={{ itemId: 'i10000003' }}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1 },
              bib,
              appConfig: {
                recapClosedLocations: [''],
                baseUrl: '/',
              },
              isEddRequestable: true,
              deliveryLocations,
            }),
          });
      });

      after(() => {
        component.unmount();
      });

      it('should display nothing ', () => {
        setImmediate(() => {
          const form = component.find('form');

          expect(form.find('fieldset')).to.have.length(0);
        });
      });
    });

    describe('for a recap item when non-recap is closed', () => {
      let component;
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: mockedItem,
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
        component = mountTestRender(
          <WrappedHoldRequest
            params={{ itemId: 'i10000003' }}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1 },
              bib,
              isEddRequestable: true,
              deliveryLocations,
            }),
          });
      });

      after(() => {
        component.unmount();
      });

      it('should display everything', () => {
        setImmediate(() => {
          const form = component.find('form');

          expect(form.find('fieldset')).to.have.length(1);
        });
      });
    });

    describe('when opening locations selectively', () => {
      let component;
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: mockedItem,
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
        appConfig.openLocations = ['Schwarzman'];
        component = mountTestRender(
          <WrappedHoldRequest
            params={{ itemId: 'i10000003' }}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1, loggedIn: true },
              bib,
              isEddRequestable: true,
              deliveryLocations,
              loading: false,
            }),
          });
      });

      after(() => {
        appConfig.openLocations = null;
        component.unmount();
      });

      it('should display only the specifically open locations', () => {
        const html = component.html();
        expect(html).to.include('Schwarzman Building');
        expect(html).to.not.include('Performing Arts');
        expect(html).to.not.include('Schomburg');
      });
    });
  });

  describe('with notification', () => {
    let component;
    before(() => {
      const testStore = makeTestStore();
      component = mountTestRender(<WrappedHoldRequest />, {
        // attachTo: document.body,
        store: testStore,
      });
    });

    it('should have a `Notification`', () => {
      expect(component.find('Notification').length).to.equal(1);
      expect(component.find('Notification').text()).to.include('Some info for our patrons');
    });
  });

  describe('checking availability', () => {
    describe('unavailable item', () => {
      let component;
      const unavailableItem = JSON.parse(JSON.stringify(mockedItem))
      unavailableItem[0].status[0].prefLabel = 'Unavailable'
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: unavailableItem,
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
        appConfig.openLocations = ['Schwarzman'];
        component = mountTestRender(
          <WrappedHoldRequest
          params={{ itemId: 'i10000003' }}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1, loggedIn: true },
              bib,
              isEddRequestable: true,
              deliveryLocations,
              loading: false,
            }),
          });
        });

      after(() => {
        component.unmount()
      })

      it('should display notice for unavailable bib', () => {
        const text = component.find('h2').at(0).text()
        expect(text).to.equal('This item cannot be requested at this time. Please try again later or contact 917-ASK-NYPL (917-275-6975).')
        expect(true)
      })
    })

    describe('available item', () => {
      let component;
      const availableItem = JSON.parse(JSON.stringify(mockedItem))
      const bib = {
        title: ['Harry Potter'],
        '@id': 'res:b17688688',
        items: availableItem,
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
        appConfig.openLocations = ['Schwarzman'];
        component = mountTestRender(
          <WrappedHoldRequest
          params={{ itemId: 'i10000003' }}
          />, {
            attachTo: document.body,
            store: makeTestStore({
              patron: { id: 1, loggedIn: true },
              bib,
              isEddRequestable: true,
              deliveryLocations,
              loading: false,
            }),
          });
        });

      after(() => {
        component.unmount()
      })

      it('should display form for available bib', () => {
        expect(component.find('form').length).to.equal(1)
      })
    })
  })
});
