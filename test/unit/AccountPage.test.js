/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';

import AccountPage from './../../src/app/pages/AccountPage';

import patron from '../fixtures/patron';

import { mountTestRender, makeTestStore } from '../helpers/store';

describe('AccountPage', () => {
  let sandbox;

  before(() => {
    // Mounting AccountPage mounts a clock as a side-effect, which prevents
    // the test from ever terminating.
    // This disables the clock.
    sandbox = sinon.sandbox.create();
    sandbox.stub(global, 'setTimeout').callsFake(() => {});
  });

  after(() => {
    sandbox.restore();
  });

  describe('default', () => {
    let mockStore;
    let component;
    let linkTabSet;
    before(() => {
      mockStore = makeTestStore({});
      component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
    });

    it('should render a `Search` component', () => {
      expect(component.find('Search').length).to.equal(1);
    });

    it('should render a <div> with class .nypl-patron-page', () => {
      expect(component.find('.nypl-patron-page').hostNodes()).to.have.length(1);
    });

    it('should render an <h2> with text "My Account"', () => {
      expect(component.find('h2').first().text()).to.equal('My Account');
    });

    it('should render a `LinkTabSet`', () => {
      linkTabSet = component.find('LinkTabSet');
      expect(linkTabSet).to.have.length(1);
    });
  });

  describe('with patron data', () => {
    let mockStore;
    let component;
    let nyplPatronDetails;
    before(() => {
      mockStore = makeTestStore({ patron });
      component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
      nyplPatronDetails = component.find('.nypl-patron-details');
    });

    it('should render a <div> with class .nypl-patron-details', () => {
      expect(nyplPatronDetails).to.have.length(1);
    });

    it('should format date in MM-DD-YYYY format', () => {
      expect(nyplPatronDetails.find('div').at(0).childAt(2).text()).to.equal('Expiration Date: 08-20-2022');
    });

    it('should display fines amount in third tab', () => {
      const linkTabSet = component.find('LinkTabSet');
      expect(linkTabSet.find('a').at(2).text()).to.equal('Fines ($19.00)');
    });
  });

  describe('Account Settings section', () => {
    let mockStore;
    let component;
    before(() => {
      mockStore = makeTestStore({});
      component = mountTestRender(
        <AccountPage
          params={{ content: 'settings' }}
        />, { store: mockStore });
    });
    it('should render an h3 with text "Personal Information"', () => {
      expect(component.find('h3').first().text()).to.equal('Personal Information');
    });
  });

  describe('redirect loop check', () => {
    describe('when cookie not set', () => {
      let component;
      before(() => {
        const mockStore = makeTestStore({});
        document.cookie = 'nyplAccountRedirectTracker=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
      });

      it('should set the cookie', () => {
        console.log('document: ', document.cookie);
        const nyplAccountRedirectTracker = document.cookie.split(';').find(el => el.includes('nyplAccountRedirectTracker'));
        expect(!!nyplAccountRedirectTracker).to.equal(true);
        expect(nyplAccountRedirectTracker).to.match(/\d+exp.*/);
        const match = nyplAccountRedirectTracker.match(/\d+exp(.*)/)[1];
        expect(Number.isNaN(Date.parse(match))).to.equal(false);
      });
    });

    describe('when cookie is set but below threshold', () => {
      let component;
      before(() => {
        const mockStore = makeTestStore({});
        document.cookie = 'nyplAccountRedirectTracker=2expMon, 05 Apr 2021 20:06:13 GMT';
        component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
      });

      it('should update the cookie', () => {
        console.log('updated cookie: ', document.cookie);
        const nyplAccountRedirectTracker = document.cookie.split(';').find(el => el.includes('nyplAccountRedirectTracker'));
        expect(nyplAccountRedirectTracker).to.match(/\d+expMon, 05 Apr 2021 20:06:13 GMT/);
        expect(parseInt(nyplAccountRedirectTracker.match(/(\d+).*/)[1], 10)).to.be.closeTo(4, 1);
      });
    });

    describe('when cookie is above threshold', () => {
      let component;
      let replaceSpy;
      before(() => {
        replaceSpy = sandbox.stub(window.location, 'replace').callsFake(() => {});
        const mockStore = makeTestStore({});
        document.cookie = 'nyplAccountRedirectTracker=25expMon, 05 Apr 2021 20:06:13 GMT';
        component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
      });

      it('should redirect', () => {
        expect(replaceSpy.called).to.equal(true);
      });
    });
  });
});
