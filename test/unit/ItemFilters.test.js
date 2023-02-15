/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import ItemFilters from './../../src/app/components/Item/ItemFilters';
import ItemFilter from './../../src/app/components/Item/ItemFilter';
import item from '../fixtures/libraryItems';
import { itemsAggregations, itemsAggregations2 } from '../fixtures/itemFilterOptions';

const context = {
  router: {
    location: {
      query: {},
    },
  },
};

describe('ItemFilters', () => {
  const locationFilters = itemsAggregations[0];
  const statusFilters = itemsAggregations[2];
  describe('DateSearchBar', () => {
    const items = [
      item.full
    ];
    let component
    it('renders date filter', () => {
      component = mount(
        <ItemFilters
          displayDateFilter={true}
          items={items}
          numOfFilteredItems={items.length}
          numItemsTotal={items.length}
          itemsAggregations={itemsAggregations}
        />,
        { context }
      );
      const displayDateFilter = component.html().includes('Search by year')
      expect(displayDateFilter)
    })
    it('doesn\'t render date filter', () => {
      component = mount(
        <ItemFilters
          displayDateFilter={false}
          items={items}
          numOfFilteredItems={items.length}
          numItemsTotal={items.length}
          itemsAggregations={itemsAggregations}
        />,
        { context });
      const DateSearchBar = component.find('DateSearchBar');
      expect(DateSearchBar).to.be.empty
    })
  })
  describe('with valid `items`, no filters', () => {
    let component;
    let itemFilters;
    before(() => {
      const items = [
        item.full,
        item.missingData,
        item.requestable_ReCAP_available,
        item.requestable_ReCAP_not_available,
        item.requestable_nonReCAP_NYPL,
      ];
      component = mount(
        <ItemFilters
          items={items}
          numOfFilteredItems={items.length}
          numItemsTotal={items.length}
          itemsAggregations={itemsAggregations}
        />,
        { context }
      );
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
    it.skip('should pass locations parsed properly. All offsite location options have ID "offsite"', () => {
      const locationFilter = itemFilters.findWhere(filterComp => filterComp.props().filter === 'location');
      const options = locationFilter.props().options;
      expect(options).to.deep.equal(locationFilters.values);
      expect(options.every((option) => {
        if (option.label === 'Offsite') return option.id === 'Offsite';
        return true;
      })).to.equal(true);
    });
    it.skip('should pass statuses parsed properly. Requestable option has id "requestable"', () => {
      const statusFilter = itemFilters.findWhere(filterComp => filterComp.props().filter === 'status');
      const options = statusFilter.props().options;
      expect(options).to.deep.equal(statusFilters.values);
      // There are three requestable items
      expect(options.filter(option => option.id === 'requestable').length).to.equal(3);
    });
    it('should have working checkboxes', () => {
      const itemFilter = component.find('ItemFilter').first();
      itemFilter.find('button').simulate('click');
      const checkbox = component.find('input[type="checkbox"]').first();

      expect(checkbox.html()).to.include('id="SASB M1 - General Research - Room 315"');
      expect(checkbox.html()).to.include('type="checkbox"');
      checkbox.simulate('click');

      expect(checkbox.html()).to.include('id="SASB M1 - General Research - Room 315"');
    });
  });
  // one filter will be a string in the router context
  describe('with valid items, one filter', () => {
    let component;
    before(() => {
      const contextWithOneFilter = context;
      const items = [
        item.full,
        item.missingData,
        item.requestable_ReCAP_available,
        item.requestable_ReCAP_not_available,
        item.requestable_nonReCAP_NYPL,
      ];
      contextWithOneFilter.router.location.query = { format: 'Text' };
      component = mount(
        <ItemFilters
          items={items}
          numOfFilteredItems={items.length}
          numItemsMatched={items.length}
          itemsAggregations={itemsAggregations}
        />,
        { context: contextWithOneFilter }
      );
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
      const items = [
        item.full,
        item.missingData,
        item.requestable_ReCAP_available,
        item.requestable_ReCAP_not_available,
        item.requestable_nonReCAP_NYPL,
      ];
      contextWithMultipleFilters.router.location.query = { format: ['Text', 'PRINT'] };
      component = mount(
        <ItemFilters
          items={items}
          numOfFilteredItems={items.length}
          // This comes from the `ItemsContainer` parent
          // component after filtering the items.
          numItemsMatched={1}
          itemsAggregations={itemsAggregations}
        />,
        { context: contextWithMultipleFilters }
      );
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
      const items = [
        item.full,
        item.missingData,
        item.requestable_ReCAP_available,
        item.requestable_ReCAP_not_available,
        item.requestable_nonReCAP_NYPL,
      ];
      contextWithMultipleFilters.router.location.query = {
        format: 'PRINT',
        status: 'Requestable',
      };
      component = mount(
        <ItemFilters
          items={items}
          numOfFilteredItems={0}
          // This comes from the `ItemsContainer` parent
          // component after filtering the items.
          numItemsTotal={0}
          itemsAggregations={itemsAggregations}
        />,
        { context: contextWithMultipleFilters }
      );
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

  describe.skip('with blank or duplicated items aggregations', () => {
    let component;
    before(() => {
      const contextWithMultipleFilters = context;
      const items = [
        item.full,
        item.missingData,
        item.requestable_ReCAP_available,
        item.requestable_ReCAP_not_available,
        item.requestable_nonReCAP_NYPL,
      ];
      contextWithMultipleFilters.router.location.query = {
        format: 'PRINT',
        status: 'Requestable',
      };
      component = mount(
        <ItemFilters
          items={items}
          numOfFilteredItems={0}
          numItemsTotal={items.length}
          numItemsCurrent={items.length}
          itemsAggregations={itemsAggregations2}
        />,
        { context: contextWithMultipleFilters }
      );
    });

    it('should remove blank aggregations and combine duplicated ones', () => {
      const itemFilter = component.find(ItemFilter)
      const locations = itemFilter.at(0).prop('options')
      expect(locations.length).to.equal(2)
      expect(locations[0].value).to.equal('loc:maj03')
      expect(locations[0].label).to.equal('SASB M1 - General Research - Room 315')
      expect(locations[1].value).to.equal('loc:rc2ma,offsite')
      expect(locations[1].label).to.equal('Offsite')
    })
  })
});
