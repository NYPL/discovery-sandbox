/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

// Import the component that is going to be tested
import ItemTable from './../../src/app/components/Item/ItemTable';

describe('ItemTable', () => {
  const data = [
    { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
    { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
    { status: { prefLabel: 'available' }, accessMessage: { prefLabel: 'available' } },
  ];

  describe('No rendered table', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTable />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTable items={[]} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if items is not an array', () => {
      const stringItem = shallow(<ItemTable items="not an array" />);
      const objectItem = shallow(<ItemTable items={{ object: 'not an array' }} />);

      expect(stringItem.type()).to.equal(null);
      expect(objectItem.type()).to.equal(null);
    });
  });

  describe('Search Results page', () => {
    let component
    before(() => {
      component = mount(<ItemTable items={data} page="SearchResults" />);
    });
    after(() => {
      component.unmount()
    })

    it('should have one <thead> for each item and three <th>', () => {
      const header = component.find('thead').at(0);
      expect(header.find('tr').length).to.equal(1);
      expect(header.find('th').length).to.equal(3);
      expect(header.find('th').at(0).text()).to.equal('Format');
      expect(header.find('th').at(1).text()).to.equal('Call Number');
      expect(header.find('th').at(2).text()).to.equal('Item Location');
    });
    it('should have one table for each item', () => {
      expect(component.find('table').length).to.equal(3);
      expect(component.find('table').at(0).prop('className')).to.include('nypl-basic-table');
    });

    it('should have one <caption> element set to "Item details".', () => {
      expect(component.find('caption').length).to.equal(3);
      expect(component.find('caption').at(0).text()).to.equal('Item details');
    });

    it('should have one <thead> and one <tbody> for each item', () => {
      expect(component.find('thead').length).to.equal(3);
      expect(component.find('tbody').length).to.equal(3);
    });
  });

  describe('Bib page', () => {
    let component
    before(() => {
      component = mount(<ItemTable page='not search results' items={data.map((item, i) => ({ volume: `${i}`, ...item }))} />);
    });
    it('should have a <thead> with 6 <th> elements', () => {
      const header = component.find('thead').at(0);
      expect(header.find('tr').length).to.equal(1);
      expect(header.find('th').length).to.equal(6);
      expect(header.find('th').at(0).text()).to.equal('Status');
      expect(header.find('th').at(1).text()).to.equal('Vol/Date');
      expect(header.find('th').at(2).text()).to.equal('Format');
      expect(header.find('th').at(3).text()).to.equal('Access');
      expect(header.find('th').at(4).text()).to.equal('Call Number');
      expect(header.find('th').at(5).text()).to.equal('Item Location');
    })
    it('should have the same number <tr> elements in its <tbody> as the item length.', () => {
      const body = component.find('tbody')
      const rows = body.find('tr')
      expect(rows.length).to.equal(3);
    });
    it('should have one table', () => {
      expect(component.find('table').length).to.equal(1);
      expect(component.find('table').prop('className')).to.equal('nypl-basic-table');
    });

    it('should have one <caption> element set to "Item details".', () => {
      expect(component.find('caption').length).to.equal(1);
      expect(component.find('caption').text()).to.equal('Item details');
    });

    it('should have one <thead> and one <tbody>', () => {
      expect(component.find('thead').length).to.equal(1);
      expect(component.find('tbody').length).to.equal(1);
    });

    it('should not have Vol/Date column if no volume on items', () => {
      component.unmount()
      component = mount(<ItemTable page='not search results' items={data} />);
      expect(component.find('th').length).to.equal(5)
    })
  });
});
