/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import AccountPage from './../../src/app/components/AccountPage/AccountPage';

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
