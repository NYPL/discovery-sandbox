/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { makeTestStore } from '../helpers/store';

import Home from '../../src/app/pages/Home';
import appConfig from '../../src/app/data/appConfig';

describe('Home', () => {
  let component;

  before(() => {
    const testStore = makeTestStore();
    component = mount(
      <Provider store={testStore}>
        <Home />
      </Provider>
    );
  });

  it('should be wrapped in a .home class', () => {
    expect(component.find('.home').hostNodes().length).to.equal(1);
  });

  it('should contain an h2', () => {
    const h2 = component.find('Heading').at(1);
    expect(h2.text()).to.equal(`Welcome to ${appConfig.displayTitle}`);
  });

  it('should contain five images', () => {
    const imageBlocks = component.find('img.nypl-quarter-image');

    expect(component.find('img').length).to.equal(5);
    expect(imageBlocks.length).to.equal(5);
  });

  it('should have five h3s in the image blocks', () => {
    const imageBlocks = component.find('div.nypl-quarter-image');
    imageBlocks.forEach((imageBlock) => {
      expect(imageBlock.render().find('h4').length).to.equal(1);
    });
  });

  describe('with notification', () => {
    before(() => {
      const testStore = makeTestStore();
      component = mount(
        <Provider store={testStore}>
          <Home />
        </Provider>
      );
    });

    it('should have a `Notification`', () => {
      expect(component.find('Notification').length).to.equal(1);
      expect(component.find('Notification').text()).to.include('Some info for our patrons');
    });
  });
});
