/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import SubNav from './../../src/app/components/SubNav/SubNav';
import { makeTestStore } from '../helpers/store';

const mountSubNav = (
  props,
  store = makeTestStore({
    features: [],
    appConfig: {
      baseUrl: 'baseUrl.com',
    },
  }),
) => mount(
  <Provider
    store={store}
  >
    <SubNav {...props} />
  </Provider>
);

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
});
