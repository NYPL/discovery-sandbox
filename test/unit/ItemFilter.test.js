/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFilter from '../../src/app/components/ItemFilters/ItemFilter';
import { itemsAggregations } from '../fixtures/itemFilterOptions';
import { buildReducedItemsAggregations, buildFieldToOptionsMap } from '../../src/app/utils/itemFilterUtils';

describe.only('ItemFilter', () => {
  const locationItemFilter = itemsAggregations[0];
  describe('missing props', () => {
    let component;
    it('should not render without props', () => {
      component = shallow(<ItemFilter />);
      expect(component.type()).to.equal(null);
    });
    it('should not render without `options`', () => {
      component = shallow(
        <ItemFilter
          field="category"
        />,
      );
      expect(component.type()).to.equal(null);
    });
    it('should not render with empty `options`', () => {
      component = shallow(
        <ItemFilter
          field="category"
          options={[]}
        />,
      );
      expect(component.type()).to.equal(null);
    })
    it('should not render without `filter`', () => {
      component = shallow(
        <ItemFilter
          options={locationItemFilter.values}
        />,
      );
      expect(component.type()).to.equal(null);
    });
  });

  describe.only('with `options` and `filter`', () => {
    let component;
    it('should render a `div` and a `button`', () => {
      const reducedItemAggregations = buildReducedItemsAggregations([locationItemFilter])
      const fieldToOptionsMap = buildFieldToOptionsMap(reducedItemAggregations)
      component = mount(
        <ItemFilter
          fieldToOptionsMap={fieldToOptionsMap}
          options={reducedItemAggregations[0].options}
          field={reducedItemAggregations[0].field}
        />);
      expect(component.find('div').length).to.equal(1);
      expect(component.find('button').length).to.equal(1);
    });
  });

  describe('with required props, open state', () => {
    let component;
    it('should render a fieldset, 3 buttons, 2nd two buttons disabled', () => {
      const fieldToOptionsMap = buildReducedItemsAggregations(JSON.stringify([locationItemFilter]))
      component = mount(
        <ItemFilter
          fieldToOptionsMap={fieldToOptionsMap}
          options={locationItemFilter.options}
          field={locationItemFilter.field}
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
          isOpen
          selectedFilters={selectedFilters}
          options={locationItemFilter.options}
          field={locationItemFilter.field}
          setSelectedFilters={(reactGeneratedFunc) => {
            updatedFilters = reactGeneratedFunc(selectedFilters);
          }}
        />);
      const clearButton = component.find('button').at(1);
      expect(clearButton.prop('disabled')).to.equal(undefined);
      expect(clearButton.text()).to.equal('Clear');
      clearButton.simulate('click');
      expect(updatedFilters).to.deep.equal({ location: [], status: ['status:a'] });
    });
  });
});
