/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
// Import the component that is going to be tested
import HoldRequest from './../../src/app/components/HoldRequest/HoldRequest';
import Actions from './../../src/app/actions/Actions';

const mockedItems = [
  {
    "@id": "res:i10000003",
    "uri": "i10000003",
    "status": [
      {
        "@id": "status:a",
        "prefLabel": "Available"
      }
    ],
    "owner": [
      {
        "@id": "orgs:1000",
        "prefLabel": "Stephen A. Schwarzman Building"
      }
    ],
    "catalogItemType": [
      {
        "@id": "catalogItemType:55",
        "prefLabel": "book, limited circ, MaRLI"
      },
      {
        "@id": "catalogItemType:55",
        "prefLabel": "book, limited circ, MaRLI"
      }
    ],
    "identifier": [
      "urn:barcode:33433014514719",
      "urn:SierraNypl:10000003"
    ],
    "holdingLocation": [
      {
        "@id": "loc:rcma2",
        "prefLabel": "Offsite"
      }
    ],
    "requestable": [
      true
    ],
    "accessMessage": [
      {
        "@id": "accessMessage:2",
        "prefLabel": "Request in advance"
      }
    ],
    "shelfMark": [
      "*OFS 84-1997"
    ],
    "idBarcode": [
      "33433014514719"
    ],
    "idNyplSourceId": {
      "@type": "SierraNypl",
      "@value": "10000003"
    },
  }
];

describe('HoldRequest', () => {
  // const mock = new MockAdapter(axios);
  describe('When component did mount', () => {
    afterEach(() => {
      axios.get.restore();
    });
    it('should redirect for ineligible patrons', () => {
      // mock
      //   .onGet(/\/patronEligibility\/1/)
      //   .reply(200, { data: 'ineligible' });
      const router = sinon.stub(axios, 'get').callsFake((url) => {
        console.log('faking router', url);
        if (url.match(/\/patronEligibility\/1/)) {
          return new Promise((resolve, reject) => {
            resolve({ data: 'ineligible' });
          })
        }
      })
      const component = mount(<HoldRequest />, { attachTo: document.body });
      const instance = component.instance();
      const redirect = sinon.stub(instance, 'redirectWithErrors').callsFake(() => {
        console.log('line 92');
        return true;
      });
      const didMount = sinon.spy(instance, 'componentDidMount');
      return new Promise((resolve, reject) => {
        // sinon.stub(instance, 'requireUser').callsFake(() => {
        //   instance.setState({ patron: { id: 1 } });
        // });
        instance.setState({ patron: { id: 1 } });
        resolve();
      })
        .then(() => {
          console.log(instance.state);
          instance.componentDidMount();
        })
        .then(() => {
          expect(didMount.called).to.equal(true);
          expect(redirect.called).to.equal(true);
        })
        .catch(() => {
          expect(didMount.called).to.equal(true);
          console.log('redirect called for ineligible: ', redirect.called);
          expect(redirect.called).to.equal(true);
        });
    });
    it('should not redirect for eligible patrons', () => {
      const router = sinon.stub(axios, 'get').callsFake((url) => {
        console.log('faking router', url);
        if (url.match(/\/patronEligibility\/2/)) {
          return new Promise((resolve, reject) => {
            resolve({ data: 'eligible to place holds' });
          })
        }
      })
      const component = mount(<HoldRequest />, { attachTo: document.body });
      const instance = component.instance();
      const redirect = sinon.stub(instance, 'redirectWithErrors').callsFake(() => {
        console.log('line 128');
        return true;
      });
      const didMount = sinon.spy(instance, 'componentDidMount');
      return new Promise((resolve, reject) => {
        // sinon.stub(instance, 'requireUser').callsFake(() => {
        //   instance.setState({ patron: { id: 1 } });
        // });
        instance.setState({ patron: { id: 2 } });
        resolve();
      })
        .then(() => {
          console.log(instance.state);
          instance.componentDidMount();
        })
        .then(() => {
          expect(didMount.called).to.equal(true);
          expect(redirect.called).to.equal(true);
        })
        .catch(() => {
          expect(didMount.called).to.equal(true);
          console.log('redirect called for eligible ', redirect.called);
          expect(redirect.called).to.equal(false);
        });
    });
  });

  describe('After being rendered, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');
      component = mount(<HoldRequest />, { attachTo: document.body });
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    // TODO: This should check the state and not that the function was called.
    it('should check if the patron is logged in.', () => {
      expect(requireUser.calledOnce).to.equal(true);
    });
  });

  describe('If the patron is not logged in, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      Actions.updatePatronData({});
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');
      component = mount(<HoldRequest />, { attachTo: document.body });
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should redirect the patron to OAuth log in page.', () => {
      component.setState({ patron: {} });
      expect(requireUser.returnValues[0]).to.equal(false);
    });
  });

  describe('If the patron is logged in and the App receives invalid item data, <HoldRequest>',
    () => {
      let component;

      before(() => {
        component = mount(<HoldRequest />, { attachTo: document.body });
      });

      after(() => {
        component.unmount();
      });

      it('should display the page title, "Item Request".', () => {
        const main = component.find('#mainContent');

        expect(main).to.have.length(1);
        expect(main.find('h1')).to.have.length(1);
        expect(main.find('h1').text()).to.equal('Item Request');
      });

      it('should display the error message.', () => {
        const item = component.find('.item');

        expect(item.contains(
          <h2>
            This item cannot be requested at this time. Please try again later or
            contact 917-ASK-NYPL (<a href="tel:917-275-6975">917-275-6975</a>).
          </h2>)
        ).to.equal(true);
      });
    },
  );

  describe('If the patron is logged in and the App receives invalid delivery location data, ' +
    '<HoldRequest>', () => {
    let component;
    const bib = {
      title: ['Harry Potter'],
      '@id': 'res:b17688688',
      items: mockedItems,
    };

    before(() => {
      component = mount(<HoldRequest bib={bib} params={{ itemId: 'i10000003' }} />, { attachTo: document.body });
    });

    after(() => {
      component.unmount();
    });

    it('should display the item title.', () => {
      const item = component.find('.item');

      expect(item.find('#item-link')).to.have.length(1);
      expect(item.find('#item-link').text()).to.equal('Harry Potter');
    });

    it('should display the error message for invalid delivery locations.', () => {
      const form = component.find('form');

      expect(form.find('h2')).to.have.length(1);
      expect(form.contains(
        <h2 className="nypl-request-form-title">
          Delivery options for this item are currently unavailable. Please try again later or
          contact 917-ASK-NYPL (<a href="tel:917-275-6975">917-275-6975</a>).
        </h2>
      )).to.equal(true);
    });
  });

  describe('If the patron is logged in and the App receives valid delivery location data, ' +
    '<HoldRequest>', () => {
    let component;
    const bib = {
      title: ['Harry Potter'],
      '@id': 'res:b17688688',
      items: mockedItems,
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
      component = mount(
        <HoldRequest
          bib={bib}
          deliveryLocations={deliveryLocations}
          params={{ itemId: 'i10000003' }}
        />,
        { attachTo: document.body }
      );
    });

    after(() => {
      component.unmount();
    });

    it('should display the sentence "Choose a delivery option or location".', () => {
      const form = component.find('form');

      expect(form.find('h2')).to.have.length(1);
      expect(form.contains(
        <h2 className="nypl-request-form-title">Choose a delivery option or location</h2>
      )).to.equal(true);
    });

    it('should display the form of the display locations.', () => {
      const form = component.find('form');

      expect(form.props().method).to.equal('POST');
    });

    it('should display the avaialbe delivery locations, and the first location is selected ' +
      'by default.', () => {
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

    it('should display the names and the addresses of the delivery locations.', () => {
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

    it('should deliver request button with the respective URL on the page.', () => {
      const form = component.find('form');
      const requestBtn = form.find('button');

      expect(requestBtn.props().type).to.equal('submit');
      expect(requestBtn.text()).to.equal('Submit Request');
    });
  });

  describe('If the delivery location has the EDD option, <HoldRequest>', () => {
    let component;
    const bib = {
      title: ['Harry Potter'],
      '@id': 'res:b17688688',
      items: mockedItems,
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
      component = mount(
        <HoldRequest
          bib={bib}
          deliveryLocations={deliveryLocations}
          isEddRequestable
          params={{ itemId: 'i10000003' }}
        />,
        { attachTo: document.body }
      );
    });

    after(() => {
      component.unmount();
    });

    it('should display the EDD option.', () => {
      const form = component.find('form');
      const fieldset = component.find('fieldset');

      expect(form.find('fieldset')).to.have.length(1);
      expect(fieldset.find('label')).to.have.length(4);
      expect(fieldset.find('legend')).to.have.length(1);
      expect(fieldset.find('label').at(0).find('input').props().type).to.equal('radio');
      expect(fieldset.find('label').at(0).find('input').props().checked).to.equal(true);
      expect(fieldset.find('label').at(0).text())
        .to.equal('Have up to 50 pages scanned and sent to you via electronic mail.');
    });
  });
});
