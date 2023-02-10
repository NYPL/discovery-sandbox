/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFilter from '../../src/app/components/ItemFilters/ItemFilter';
import { itemsAggregations } from '../fixtures/itemFilterOptions';
import { buildReducedItemsAggregations, buildFieldToOptionsMap } from '../../src/app/utils/itemFilterUtils';

describe('ItemFilter', () => {
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

  describe('with `options` and `filter`', () => {
    let component;
    it('should render a `div` and a `button`', () => {
      const reducedItemAggregationsLocationsOnly = buildReducedItemsAggregations([locationItemFilter])
      const fieldToOptionsMap = buildFieldToOptionsMap(reducedItemAggregationsLocationsOnly)
      component = mount(
        <ItemFilter
          fieldToOptionsMap={fieldToOptionsMap}
          options={reducedItemAggregationsLocationsOnly[0].options}
          field={reducedItemAggregationsLocationsOnly[0].field}
        />);
      expect(component.find('div').length).to.equal(1);
      expect(component.find('button').length).to.equal(1);
    });
  });

  describe('with required props, open state', () => {
    let component;
    it('should render a fieldset, 3 buttons, 2nd two buttons disabled', () => {
      const reducedItemAggregationsLocationsOnly = buildReducedItemsAggregations([locationItemFilter])
      const fieldToOptionsMap = buildFieldToOptionsMap(reducedItemAggregationsLocationsOnly)
      component = mount(
        <ItemFilter
          fieldToOptionsMap={fieldToOptionsMap}
          options={reducedItemAggregationsLocationsOnly[0].options}
          field={reducedItemAggregationsLocationsOnly[0].field}
          isOpen
        />);
      expect(component.find('fieldset').length).to.equal(1);
      expect(component.find('button').length).to.equal(3);
      expect(component.find('button').at(1).prop('disabled')).to.equal(true);
      expect(component.find('button').at(2).prop('disabled')).to.equal(true);
    });
  });

  describe('with `selectedFields`', () => {
    /*
      Example of how to test state update when using
      `useState` and passing a function to manipulate the
      previous state
    */
    it('clear button should remove selected options for corresponding fields', () => {
      const reducedItemAggregationsLocationsOnly = buildReducedItemsAggregations([locationItemFilter])
      const fieldToOptionsMap = buildFieldToOptionsMap(reducedItemAggregationsLocationsOnly)
      let updatedFields
      const selectedFields = {
        location: ['loc:maj03', 'offsite'],
        status: ['status:a'],
      };
      const component = mount(
        <ItemFilter
          isOpen
          fieldToOptionsMap={fieldToOptionsMap}
          selectedFields={selectedFields}
          options={reducedItemAggregationsLocationsOnly[0].options}
          field={reducedItemAggregationsLocationsOnly[0].field}
          setSelectedFields={(reactGeneratedFunc) => {
            updatedFields = reactGeneratedFunc(selectedFields)
          }}
        />);
      const clearButton = component.find('button').at(1);
      expect(clearButton.prop('disabled')).to.equal(undefined);
      expect(clearButton.text()).to.equal('Clear');
      clearButton.simulate('click');
      expect(updatedFields).to.deep.equal({ location: [], status: ['status:a'] });
    });
  });
});
