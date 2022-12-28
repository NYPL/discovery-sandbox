/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';

import itemsContainerModule from './../../src/app/components/Item/ItemsContainer';
import LibraryItem from './../../src/app/utils/item';
import { bibPageItemsListLimit as itemsListPageLimit } from './../../src/app/data/constants';
import { makeTestStore, mountTestRender } from '../helpers/store';
import { itemsAggregations } from '../fixtures/itemFilterOptions';

const ItemsContainer = itemsContainerModule.unwrappedItemsContainer;
const WrappedItemsContainer = itemsContainerModule.ItemsContainer
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
      console.log("okaosdfkadofs", items.length);
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
      component = mount(<ItemsContainer items={longListItems} bib={testBib} />, { context });
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
      component = shallow(<ItemsContainer items={longListItems} shortenItems={false} bib={testBib} />, { context });
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
        <ItemsContainer items={longListItems} shortenItems={false} bib={testBib} />,
        { context },
      );
    });

    it('should have showAll state equal to false', () => {
      expect(component.state('showAll')).to.equal(false);
    });

    it('should have showAll state equal to true when the show all link is clicked', () => {
      const allItemsLink = component.find('.view-all-items-container').find('a');

      expect(component.state('showAll')).to.equal(false);
      allItemsLink.simulate('click');
      expect(component.state('showAll')).to.equal(true);
    });

    it('should have "js" state equal to false', () => {
      expect(component.state('showAll')).to.equal(true);
    });

    it('should have "page" state equal to 1 by default', () => {
      expect(component.state('page')).to.equal(1);
    });

    it('should have "showAll" state equal to true when the showAll function is invoked', () => {
      // The component's 'showAll' state has been updated so here we are reverting it back:
      component.setState({ showAll: false });

      expect(component.state('showAll')).to.equal(false);
      component.instance().showAll();
      expect(component.state('showAll')).to.equal(true);
    });

    it('should have "page" state updated when the updatePage function is invoked', () => {
      expect(component.state('page')).to.equal(1);
      component.instance().updatePage(3);
      expect(component.state('page')).to.equal(3);
    });
  });

  describe('High page value', () => {
    let component;

    before(() => {
      component = shallow(
        <ItemsContainer items={longListItems} shortenItems={false} page="4" bib={testBib} />,
        { context },
      );
    });

    it('should have "page" state updated to 1 since page 4 should not exist with the ' +
      'small amount of items passed', () => {
      expect(component.state('page')).to.equal(1);
    });
  });

  describe('Breaking up the items passed into a chunked array', () => {
    let component
    const store = makeTestStore({
      bib: {
        items: longListItems
      }
    })
    before(() => {
      component = mountTestRender(
        <WrappedItemsContainer itemsAggregations={itemsAggregations} />
        , { store, childContextTypes: { router: PropTypes.object } });
    })
    after(() => {
      component.unmount()
    })
    it(`should have ${itemsListPageLimit} on the first page of the item table and ${longListItems.length - itemsListPageLimit} on the second`, () => {
      const container = component.find('ItemsContainer').instance()
      let items = component.find('ItemTableRow')
      expect(items.length).to.equal(itemsListPageLimit)
      container.updatePage(2, 'Next')
      component.setProps()
      items = component.find('ItemTableRow')
      expect(items.length).to.equal(longListItems.length - itemsListPageLimit)
    });
  });

  describe(`Exactly ${itemsListPageLimit} items`, () => {
    let component;
    before(() => {
      component = shallow(
        <ItemsContainer items={twentyItems} shortenItems={false} page="4" bib={testBib} />,
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
