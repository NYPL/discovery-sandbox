/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';

import AccountPage from './../../src/app/pages/AccountPage';

import patron from '../fixtures/patron';

import { mountTestRender, makeTestStore } from '../helpers/store';

describe('AccountPage', () => {
  describe('default', () => {
    let mockStore;
    let component;
    let linkTabSet;
    before(() => {
      mockStore = makeTestStore({});
      component = mountTestRender(<AccountPage params={{}} />, { store: mockStore });
    });

    it('should render a <div> with class .nypl-patron-page', () => {
      expect(component.find('.nypl-patron-page')).to.have.length(1);
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
});
