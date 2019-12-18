/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ItemHoldings from './../../src/app/components/Item/ItemHoldings';

Enzyme.configure({ adapter: new Adapter() });
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
];
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
];

describe('ItemHoldings', () => {
  describe('Default rendering', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemHoldings />);
      expect(component.type()).to.equal(null);
    });
  });

  describe('Basic rendering', () => {
    let component;

    before(() => {
      component = shallow(<ItemHoldings items={items} />);
    });

    it('should be wrapped in a .nypl-results-item div', () => {
      expect(component.first().type()).to.equal('div');
      expect(component.first().prop('className')).to.equal('nypl-results-item');
    });

    it('should have an h2', () => {
      expect(component.find('h2').length).to.equal(1);
      expect(component.find('h2').text()).to.equal('Availability');
    });

    it('should its "js" state set to false by default', () => {
      expect(component.state('js')).to.equal(false);
    });

    it('should have an ItemTable component, which renders a table', () => {
      expect(component.find('ItemTable').length).to.equal(1);
      // Need to render the componet to actually find what gets rendered.
      expect(component.find('ItemTable').render().find('table').length).to.equal(1);
      // One heading and 2 item rows
      expect(component.find('ItemTable').render().find('tr').length).to.equal(3);
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
      component = mount(<ItemHoldings items={longListItems} />);
    });

    it('should have an h2', () => {
      expect(component.find('h2').length).to.equal(1);
      expect(component.find('h2').text()).to.equal('Availability');
    });

    it('should have an ItemTable component, which renders a table', () => {
      expect(component.find('ItemTable').length).to.equal(1);
      // Need to render the componet to actually find what gets rendered.
      expect(component.find('ItemTable').render().find('table').length).to.equal(1);
      // One heading and 20 item rows since only 20 get displayed at a time by default
      expect(component.find('ItemTable').render().find('tr').length).to.equal(21);
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
      component = mount(<ItemHoldings items={longListItems} shortenItems={false} />);
    });

    it('should render a "View All Items" link', () => {
      expect(component.find('.view-all-items-container').length).to.equal(1);
    });

    // NOTE: The component gets re-rendered when the link is clicked, so we cannot store
    // the 'tr's in a variable or only the first instance will get captured.
    it('should render all items when the link is clicked', () => {
      const allItemsLink = component.find('.view-all-items-container').find('a');
      expect(allItemsLink.length).to.equal(1);

      // One heading and 20 item rows since only 20 get displayed at a time by default
      expect(component.find('ItemTable').render().find('tr').length).to.equal(21);
      allItemsLink.simulate('click');

      // 'component' gets re-rendered:
      // One heading and the complete 24 items.
      expect(component.find('ItemTable').render().find('tr').length).to.equal(25);
    });
  });

  describe('State updates', () => {
    let component;

    before(() => {
      component = mount(
        <ItemHoldings items={longListItems} shortenItems={false} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
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
      component = mount(
        <ItemHoldings items={longListItems} shortenItems={false} page="4" />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
    });

    it('should have "page" state updated to 1 since page 4 should not exist with the ' +
      'small amount of items passed', () => {
      expect(component.state('page')).to.equal(1);
    });
  });

  describe('Breaking up the items passed into a chunked array', () => {
    // NOTE: This is the initial rendering so we are only doing shallow. The chunking process
    // gets done in componentDidMount which is called when the component actually mounts.
    it('should have an empty chunkedItems state', () => {
      const component = shallow(<ItemHoldings items={longListItems} />);
      expect(component.state('chunkedItems')).to.eql([]);
    });

    // NOTE: This is the initial rendering so we are only doing shallow. The chunking process
    // gets done in componentDidMount which is called when the component actually mounts.
    it('should have two arrays of in the chunkedItems state,' +
      'the first array with 20 items and the second with 4', () => {
      const component = mount(<ItemHoldings items={longListItems} />);
      expect(component.state('chunkedItems')).to.eql(
        [
          [
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
          ],
          [
            { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
            { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
            { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
            { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
          ],
        ],
      );

      expect(component.state('chunkedItems')[0].length).to.equal(20);
      expect(component.state('chunkedItems')[1].length).to.equal(4);
    });
  });
});
