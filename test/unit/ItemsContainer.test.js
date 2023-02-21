/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import itemsContainerModule from './../../src/app/components/Item/ItemsContainer';
import LibraryItem from './../../src/app/utils/item';
import { bibPageItemsListLimit as itemsListPageLimit } from './../../src/app/data/constants';
import { itemsAggregations } from '../fixtures/itemFilterOptions';

const ItemsContainer = itemsContainerModule.unwrappedItemsContainer;
const items = [
  {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    url: 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?' +
      '&institution=13777&type=1&language=1',
  },
  {
    accessMessage: {
      '@id': 'accessMessage:1',
      prefLabel: 'USE IN LIBRARY',
    },
    availability: 'available',
    available: true,
    barcode: '33433078478272',
  },
].map(LibraryItem.mapItem);

const longListItems = [
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
].map(LibraryItem.mapItem).map((item, i) => {
  item.id = `i${i}`
  return item
});

const twentyItems = [
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
].map(LibraryItem.mapItem).map((item, i) => {
  item.id = `i${i}`
  return item
});

const context = {
  router: {
    location: { query: {} },
    createHref: () => { },
    push: () => { },
  },
};

const testBib = {
  numItems: 0,
};
describe('ItemsContainer', () => {
  describe('Basic rendering', () => {
    let component;

    before(() => {
      component = shallow(
        <ItemsContainer
          items={items}
          bib={testBib}
          itemsAggregations={itemsAggregations}
        />,
        {
          disableLifecycleMethods: true,
          context,
        }
      );
    });

    it('should have its "js" state set to false by default', () => {
      expect(component.state('js')).to.equal(false);
    });

    it('should have an ItemTable component, which renders a table', () => {
      expect(component.find('ItemTable').length).to.equal(1)
    });

    it('should not render a "View All Items" link', () => {
      expect(component.find('.view-all-items-container').length).to.equal(0);
    });

    it('should not render a Pagination component since there are only two items', () => {
      expect(component.find('Pagination').length).to.equal(0);
    });
  });

  describe('Long list - shorten list rendered', () => {
    let component;

    before(() => {
      component = mount(
        <ItemsContainer
          items={longListItems}
          bib={testBib}
          numItemsMatched={longListItems.length}
        />,
        { context });
    });

    it('should render an ItemTable component', () => {
      expect(component.find('ItemTable').length).to.equal(1);
    });

    it('should render a "View All Items" link', () => {
      expect(component.find('.view-all-items-container').length).to.equal(1);
    });

    it('should render a Pagination component since there are more than 20 items', () => {
      expect(component.find('Pagination').length).to.equal(1);
    });
  });

  describe('Long list - all items rendered', () => {
    let component;

    before(() => {
      component = shallow(
        <ItemsContainer
          items={longListItems}
          shortenItems={false}
          bib={testBib}
          numItemsMatched={longListItems.length}
        />,
        { context }
      );
    });

    it('should render a "View All Items" link', () => {
      expect(component.find('.view-all-items-container').length).to.equal(1);
    });

    // NOTE: The component gets re-rendered when the link is clicked, so we cannot store
    // the 'tr's in a variable or only the first instance will get captured.
    // ** this test is testing behavior of another component.
    // it('should render all items when the link is clicked', () => {
    //   const allItemsLink = component.find('.view-all-items-container').find('a');
    //   expect(allItemsLink.length).to.equal(1);

    //   // One heading and 20 item rows since only 20 get displayed at a time by default
    //   expect(component.find('ItemTable').render().find('tr').length).to.equal(21);
    //   allItemsLink.simulate('click');

    //   // 'component' gets re-rendered:
    //   // One heading and the complete 24 items.
    //   expect(component.find('ItemTable').render().find('tr').length).to.equal(25);
    // });
  });

  describe('State updates', () => {
    let component;

    before(() => {
      component = mount(
        <ItemsContainer
          items={longListItems}
          shortenItems={false}
          bib={testBib}
          numItemsMatched={longListItems.length}
        />,
        { context },
      );
    });

    it('should have "js" state equal to true after the component mounts', () => {
      expect(component.state('js')).to.equal(true);
    });

    it('should have "page" state equal to 1 by default', () => {
      expect(component.state('page')).to.equal(1);
    });

    it('should have "page" state updated when the updatePage function is invoked', () => {
      expect(component.state('page')).to.equal(1);
      component.instance().updatePage(3);
      expect(component.state('page')).to.equal(3);

      // Reset back to the first page.
      component.instance().updatePage(1);
    });
  });

  describe('ShowAll feature', () => {
    it('should not display the "view all items" link when showAll is true', () => {
      const component = shallow(
        <ItemsContainer
          items={longListItems}
          shortenItems={false}
          bib={testBib}
          numItemsMatched={longListItems.length}
          showAll={true}
        />,
        { context },
      );
      expect(component.find('.view-all-items-container').length).to.equal(0);
    });

    it('should display the "view all items" link when showAll is false', () => {
      const component = shallow(
        <ItemsContainer
          items={longListItems}
          shortenItems={false}
          bib={testBib}
          // Mocking that we have more items to display.
          numItemsMatched={100}
          showAll={false}
        />,
        { context },
      );
      expect(component.find('.view-all-items-container').length).to.equal(1);
    });
  });

  describe(`Exactly ${itemsListPageLimit} items`, () => {
    let component;
    before(() => {
      component = shallow(
        <ItemsContainer items={twentyItems} shortenItems={false} itemPage="4" bib={testBib} />,
        { context },
      );
    });

    it(`should not render a Pagination component since there are ${itemsListPageLimit} items`, () => {
      expect(component.find('Pagination').length).to.equal(0);
    });

    it('should not render a "View All Items" link', () => {
      expect(component.find('.view-all-items-container').length).to.equal(0);
    });
  });
});
