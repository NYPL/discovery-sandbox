/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFilter from './../../src/app/components/Item/ItemFilter';
import { locationFilters } from '../fixtures/itemFilterOptions';

describe('ItemFilters', () => {
  describe('default rendering', () => {
    let component;
    it('should not render without an `items` prop', () => {
      component = shallow(<ItemFilter />);
      expect(component.type()).to.equal(null);
    });
  });

  describe('with `options`', () => {
    let component;
    it('should render a `div` and a `button`', () => {
      component = mount(<ItemFilter options={locationFilters} />);
      expect(component.find('div').length).to.equal(1);
      expect(component.find('button').length).to.equal(1);
    });
  });

  describe('with `options` open state', () => {
    let component;
    it('should render a fieldset, 3 buttons', () => {
      component = mount(
        <ItemFilter
          options={locationFilters}
          isOpen
        />);
      expect(component.find('fieldset').length).to.equal(1);
      expect(component.find('button').length).to.equal(3);
    });
  });

  describe('with `selectedFilters`', () => {
    it('clear button should remove selected filters for corresponding `filter`', () => {
      let filterSubmission;
      const component = mount(
        <ItemFilter
          options={locationFilters}
          isOpen
          selectedFilters={{
            location: ['loc:maj03', 'offsite'],
            status: ['status:a'],
          }}
          filter="location"
          submitFilterSelections={(input) => {
            filterSubmission = input;
          }}
        />);
      const clearButton = component.find('button').at(1);
      expect(clearButton.text()).to.equal('Clear');
      clearButton.simulate('click');
      expect(filterSubmission).to.deep.equal({ location: [], status: ['status:a'] });
    });
  });
});
