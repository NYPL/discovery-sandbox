/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';

import SubNav from './../../src/app/components/SubNav/SubNav';
import { makeTestStore, mountTestRender } from '../helpers/store';

// To test the "My Account" link feature.
const storeWithMyAccount = makeTestStore({
  features: ['my-account'],
  appConfig: {
    baseUrl: 'baseUrl.com',
  },
});

const mountSubNav = (
  props,
  store = makeTestStore({
    features: [],
    appConfig: {
      baseUrl: 'baseUrl.com',
    },
  }),
  patron = {},
) => mountTestRender(<SubNav {...props} />,  { store, patron });

describe('SubNav', () => {
  describe('Default rendering, no features', () => {
    let component;

    before(() => {
      component = mountSubNav();
    });

    it('should be wrapped in a <nav>', () => {
      expect(component.find('nav').length).to.equal(1);
    });

    it('should have <a> for "Search" and "Subject Heading Explorer"', () => {
      expect(component.find('a').at(0).text()).to.equal('Search');
      expect(component.find('a').at(1).text()).to.equal('Subject Heading Explorer');
    });

    it('should hide "My Account" link', () => {
      expect(component.find('a').last().text()).to.not.equal('My Account');
      expect(component.find('a').last().text()).to.not.equal('Log In');
    });
  });

  describe('With `activeSection` prop', () => {
    let component;

    before(() => {
      component = mountSubNav({ activeSection: 'shep' });
    });

    it('should have <a> for active section', () => {
      expect(component.find('a').at(1).text()).to.equal('Subject Heading Explorer');
    });
  });

  describe('With my-account feature', () => {
    it('should display the "My Account" link', () => {
      const component = mountSubNav({}, storeWithMyAccount);
      expect(component.find('a').last().text()).to.equal('My Account');
    });
  });

  describe('Patron log in', () => {
    it('should not display the "Log Out" link when not signed in', () => {
      const component = mountSubNav({}, storeWithMyAccount, { loggedIn: false });

      expect(component.find('a').last().text()).to.equal('My Account');
      expect(component.find('a').last().text()).to.not.equal('Log Out');
    });

    it('should display the "Log Out" link when signed in', () => {
      const component = mountSubNav({}, storeWithMyAccount, { loggedIn: true });

      expect(component.find('a').last().text()).to.not.equal('My Account');
      expect(component.find('a').last().text()).to.equal('Log Out');
    });
  });
});
