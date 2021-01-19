/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFilters from './../../src/app/components/Item/ItemFilters';
import item from '../fixtures/libraryItems';
import { locationFilters, statusFilters } from '../fixtures/itemFilterOptions';

const context = {
  router: {
    location: {
      query: {},
    },
  },
};

describe('ItemFilters', () => {
  describe('default rendering', () => {
    let component;
    it('should not render without an `items` prop', () => {
      component = shallow(<ItemFilters />, { context });
      expect(component.type()).to.equal(null);
    });
  });
  describe('no `items`', () => {
    let component;
    it('should not render with empty `items` prop', () => {
      component = shallow(<ItemFilters items={[]} />, { context });
      expect(component.type()).to.equal(null);
    });
  });
  describe('with valid `items`, no filters', () => {
    let component;
    let itemFilters;
    before(() => {
      component = mount(<ItemFilters
        items={[
          item.full,
          item.missingData,
          item.requestable_ReCAP_available,
          item.requestable_ReCAP_not_available,
          item.requestable_nonReCAP_NYPL,
        ]}
        numOfFilteredItems={5}
      />, { context });
      itemFilters = component.find('ItemFilter');
    });

    it('should have an `item-filters` id', () => {
      expect(component.find('#item-filters').length).to.equal(1);
    });
    it('should have three `ItemFilter` components', () => {
      expect(itemFilters.length).to.equal(3);
    });
    it('should have "location", "format", and "status" filters', () => {
      const filterTypes = itemFilters.map(filterComp => filterComp.props().filter);
      expect(filterTypes).to.deep.equal(['location', 'format', 'status']);
    });
    it('should pass locations parsed properly. All offsite location options have ID "offsite"', () => {
      const locationFilter = itemFilters.findWhere(filterComp => filterComp.props().filter === 'location');
      const options = locationFilter.props().options;
      expect(options).to.deep.equal(locationFilters);
      expect(options.every((option) => {
        if (option.label === 'Offsite') return option.id === 'offsite';
        return true;
      })).to.equal(true);
    });
    it('should pass statuses parsed properly. Requestable option has id "requestable"', () => {
      const statusFilter = itemFilters.findWhere(filterComp => filterComp.props().filter === 'status');
      const options = statusFilter.props().options;
      expect(options).to.deep.equal(statusFilters);
      // There are three requestable items
      expect(options.filter(option => option.id === 'requestable').length).to.equal(3);
    });
    it('should have working checkboxes', () => {
      const itemFilter = component.find('ItemFilter').first();
      itemFilter.find('button').simulate('click');
      const checkbox = component.find('Checkbox').first().find('input');
      expect(checkbox.html()).to.equal('<input id="SASB M1 - General Research - Room 315" class="checkbox__input" type="checkbox" aria-checked="false">');
      checkbox.simulate('change');
      expect(checkbox.html()).to.equal('<input id="SASB M1 - General Research - Room 315" class="checkbox__input" type="checkbox" aria-checked="true">');
    });
  });
  // one filter will be a string in the router context
  describe('with valid items, one filter', () => {
    let component;
    before(() => {
      const contextWithOneFilter = context;
      contextWithOneFilter.router.location.query = { format: 'Text' };
      component = mount(<ItemFilters
        items={[
          item.full,
          item.missingData,
          item.requestable_ReCAP_available,
          item.requestable_ReCAP_not_available,
          item.requestable_nonReCAP_NYPL,
        ]}
        numOfFilteredItems={5}
        hasFilterApplied
      />, { context: contextWithOneFilter });
    });
    it('should have description of filters', () => {
      const itemFilterInfo = component.find('.item-filter-info');
      expect(itemFilterInfo.find('span').length).to.equal(1);
      expect(component.find('.item-filter-info').find('span').text()).to.equal("Filtered by format: 'Text'");
    });
    it('should display "5 Results Found"', () => {
      expect(component.find('h3').text()).to.equal('5 Results Found');
    });
  });
  // multiple filters will be an array in the router context
  describe('with valid Bib items, two filters, one item result', () => {
    let component;
    before(() => {
      const contextWithMultipleFilters = context;
      contextWithMultipleFilters.router.location.query = { format: ['Text', 'PRINT'] };
      component = mount(<ItemFilters
        items={[
          item.full,
          item.missingData,
          item.requestable_ReCAP_available,
          item.requestable_ReCAP_not_available,
          item.requestable_nonReCAP_NYPL,
        ]}
        numOfFilteredItems={1}
        hasFilterApplied
      />, { context: contextWithMultipleFilters });
    });
    it('should have description of filters', () => {
      const itemFilterInfo = component.find('.item-filter-info');
      expect(itemFilterInfo.find('span').length).to.equal(1);
      expect(itemFilterInfo.find('span').text()).to.equal("Filtered by format: 'Text', 'PRINT'");
    });
    it('should display "1 Result Found"', () => {
      expect(component.find('h3').text()).to.equal('1 Result Found');
    });
  });

  describe('with valid Bib items, multiple filters, no filtered results', () => {
    let component;
    before(() => {
      const contextWithMultipleFilters = context;
      contextWithMultipleFilters.router.location.query = {
        format: 'PRINT',
        status: 'Requestable',
      };
      component = mount(<ItemFilters
        items={[
          item.full,
          item.missingData,
          item.requestable_ReCAP_available,
          item.requestable_ReCAP_not_available,
          item.requestable_nonReCAP_NYPL,
        ]}
        numOfFilteredItems={0}
        hasFilterApplied
      />, { context: contextWithMultipleFilters });
    });
    it('should display correct description', () => {
      const itemFilterInfo = component.find('.item-filter-info');
      expect(itemFilterInfo.find('span').length).to.equal(1);
      expect(itemFilterInfo.find('span').text()).to.equal("Filtered by format: 'PRINT', status: 'Requestable'");
    });
    it('should display "0 Results Found"', () => {
      expect(component.find('h3').text()).to.equal('No Results Found');
    });
  });
});
