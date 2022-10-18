/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { RouterProvider } from './../../src/app/context/RouterContext';

// Import the component that is going to be tested
import ItemTable from './../../src/app/components/Item/ItemTable';

describe.only('ItemTable', () => {
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

  describe('Basic <table> structure', () => {
    let component;

    before(() => {
      component = shallow(<ItemTable items={data} />);
    });

    it('should be wrapped in a table element', () => {
      // expect(component.type()).to.equal('table');
      expect(component.find('table').length).to.equal(1);
      expect(component.find('table').prop('className')).to.equal('nypl-basic-table');
    });

    it('should have a <caption> element set to "Item details".', () => {
      expect(component.find('caption').length).to.equal(1);
      expect(component.find('caption').text()).to.equal('Item details');
    });

    it('should have a <thead> and a <tbody>', () => {
      expect(component.find('thead').length).to.equal(1);
      expect(component.find('tbody').length).to.equal(1);
    });
  });


  describe('Search Results page', () => {

    before(() => {
      component = mount(<RouterProvider value={{ router: { location: { pathname: 'search' } } }}> <ItemTable items={data} page="SearchResults" /></RouterProvider >);
    });

    it('should have a <tr> with four headings <th> in the <thead>', () => {
      const header = component.find('thead').at(0);
      expect(header.find('tr').length).to.equal(1);
      expect(header.find('th').length).to.equal(3);
      expect(header.find('th').at(0).text()).to.equal('Format');
      expect(header.find('th').at(1).text()).to.equal('Call Number');
      expect(header.find('th').at(2).text()).to.equal('Item Location');
    });
  });
  describe('Bib page', () => {
    before(() => {
      component = mount(<RouterProvider value={{ router: { location: { pathname: 'nypl.org/research/research-catalog/bib/666' } } }}> <ItemTable items={data} page="SearchResults" /></RouterProvider >);
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
      const rows = component.find('tr')

      expect(rows.length).to.equal(3);
    });
  });
});
