/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import item from '../fixtures/libraryItems';
import ItemFiltersMobile from '../../src/app/components/ItemFilters/ItemFiltersMobile';
import { itemsAggregations } from '../fixtures/itemFilterOptions';

const context = {
  router: {
    location: {
      query: {},
    },
  },
};

describe('ItemFiltersMobile', () => {
  describe('DateSearchBar', () => {
    const items = [
      item.full
    ];
    let component
    it('renders date filter', () => {
      component = mount(
        <ItemFiltersMobile
          displayDateFilter={true}
          items={items}
          itemsAggregations={itemsAggregations}
        />,
        { context }
      );
      const displayDateFilter = component.html().includes('Search by year')
      expect(displayDateFilter)
    })
    it('doesn\'t render date filter', () => {
      component = mount(
        <ItemFiltersMobile
          displayDateFilter={false}
          items
          itemsAggregations={itemsAggregations}
        />,
        { context });
      const DateSearchBar = component.find('DateSearchBar');
      expect(DateSearchBar).to.be.empty
    })
  })
  describe('without props', () => {
    it('should not render without props', () => {
      const component = shallow(<ItemFiltersMobile />, { context });
      expect(component.type()).to.equal(null);
    });
  });

  describe('with props', () => {
    let initialFilters;
    let component;
    let modalTrigger;

    beforeEach(() => {
      initialFilters = {
        format: [],
        status: [],
        location: [],
      };
      component = mount(
        <ItemFiltersMobile
          itemsAggregations={itemsAggregations}
          setSelectedFilters={() => { }}
          submitFilterSelections={() => { }}
          initialFilters={initialFilters}
          selectedFilters={initialFilters}
        />,
      );
      modalTrigger = component.findWhere(node => {
        return node.type() === 'button' && node.text() === "Filters";
      });
    })

    it('should not render showResultsButton before clicking Filters', () => {
      const showResultsButton = component.findWhere(node => {
        return node.type() === 'button' && node.text() === "Show Results";
      });
      expect(showResultsButton).to.have.lengthOf(0)
    })

    it('should render "Filters" button', () => {
      expect(modalTrigger).to.have.lengthOf(1);
    });

    it('should render `ItemFilter` for option types passed', () => {
      modalTrigger.simulate('click')
      const itemFilters = component.find('.item-filter')
      expect(itemFilters.hostNodes().length).to.equal(3);
    });

    describe('"Show Results" button', () => {
      let showResultsButton
      beforeEach(() => {
        modalTrigger.simulate('click')
        showResultsButton = component.findWhere(node => {
          return node.type() === 'button' && node.text() === "Show Results";
        });
      })
      it('should render a "Show Results" button', () => {
        expect(showResultsButton.exists())
      });
      it('should close when "Show Results" is clicked with no filters', (done) => {
        showResultsButton.simulate('click');
        setTimeout(() => {
          showResultsButton = component.findWhere(node => {
            return node.type() === 'button' && node.text() === "Show Results";
          });
          const filters = component.find('ItemFilter')
          expect(showResultsButton).to.have.lengthOf(0)
          expect(filters).to.have.lengthOf(0)
        }, 0)
        done()
      });
    });
  });
});
