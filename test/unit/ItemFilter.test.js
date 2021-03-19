/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFilter from './../../src/app/components/Item/ItemFilter';
import { locationFilters } from '../fixtures/itemFilterOptions';

describe('ItemFilters', () => {
  describe('missing props', () => {
    let component;
    it('should not render without props', () => {
      component = shallow(<ItemFilter />);
      expect(component.type()).to.equal(null);
    });
    it('should not render without `options`', () => {
      component = shallow(
        <ItemFilter
          filter="category"
        />,
      );
      expect(component.type()).to.equal(null);
    });
    it('should not render without `filter`', () => {
      component = shallow(
        <ItemFilter
          options={locationFilters}
        />,
      );
      expect(component.type()).to.equal(null);
    });
  });

  describe('with `options` and `filter`', () => {
    let component;
    it('should render a `div` and a `button`', () => {
      component = mount(
        <ItemFilter
          options={locationFilters}
          filter="location"
        />);
      expect(component.find('div').length).to.equal(1);
      expect(component.find('button').length).to.equal(1);
    });
  });

  describe('with required props, open state', () => {
    let component;
    it('should render a fieldset, 3 buttons, 2nd two buttons disabled', () => {
      component = mount(
        <ItemFilter
          options={locationFilters}
          filter="location"
          isOpen
        />);
      expect(component.find('fieldset').length).to.equal(1);
      expect(component.find('button').length).to.equal(3);
      expect(component.find('button').at(1).prop('disabled')).to.equal(true);
      expect(component.find('button').at(2).prop('disabled')).to.equal(true);
    });
  });

  describe('with `selectedFilters`', () => {
    /*
      Example of how to test state update when using
      `useState` and passing a function to manipulate the
      previous state
    */
    it('clear button should remove selected filters for corresponding `filter`', () => {
      let updatedFilters;
      const selectedFilters = {
        location: ['loc:maj03', 'offsite'],
        status: ['status:a'],
      };
      const component = mount(
        <ItemFilter
          options={locationFilters}
          isOpen
          selectedFilters={selectedFilters}
          filter="location"
          setSelectedFilters={(reactGeneratedFunc) => {
            updatedFilters = reactGeneratedFunc(selectedFilters);
          }}
        />);
      const clearButton = component.find('button').at(1);
      expect(clearButton.prop('disabled')).to.equal(false);
      expect(clearButton.text()).to.equal('Clear');
      clearButton.simulate('click');
      expect(updatedFilters).to.deep.equal({ location: [], status: ['status:a'] });
    });
  });
});
