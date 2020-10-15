/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

// Import the unwrapped component that is going to be tested
import { BibPage } from './../../src/app/components/BibPage/BibPage';
import bibs from '../fixtures/bibs';
import annotatedMarc from '../fixtures/annotatedMarc.json';
import mockBibWithHolding from '../fixtures/mockBibWithHolding.json';

describe('BibPage', () => {
  let component;
  describe('Non-serial bib', () => {
    before(() => {
      const bib = { ...bibs[0], ...annotatedMarc };
      component = shallow(<BibPage
        location={{ search: 'search', pathname: '' }}
        bib={bib}
      />, { context: {
        router: { location: {} } } });
    });
    it('has Tabbed component with three tabs', () => {
      const tabbed = component.find('Tabbed');
      const tabs = tabbed.props().tabs;
      const tabTitles = tabs.map(tab => tab.title);
      expect(tabbed.length).to.equal(1);
      expect(tabs.length).to.equal(3);
      expect(tabTitles).to.deep.equal(['Availability', 'Details', 'Full Description']);
    });
  });

  describe('Serial', () => {
    let itemTable;
    before(() => {
      const bib = { ...mockBibWithHolding, ...annotatedMarc };
      component = shallow(<BibPage
        location={{ search: 'search', pathname: '' }}
        bib={bib}
      />, { context: {
        router: { location: {} },
      } });
    });

    it('has Tabbed component with four tabs', () => {
      const tabbed = component.find('Tabbed');
      const tabs = tabbed.props().tabs;
      const tabTitles = tabs.map(tab => tab.title);
      expect(tabbed.length).to.equal(1);
      expect(tabs.length).to.equal(4);
      expect(tabTitles).to.deep.equal(['Availability', 'Details', 'Full Description', 'Library Holdings']);
    });

    // not implemented yet
    xit('has item table with volume column', () => {
      expect(itemTable.find('th').at(0).text()).to.equal('Vol/Date');
    });

    // not implemented yet
    xit('gets the format from holdings statement', () => {
      expect(itemTable.find('td').at(0).text()).to.equal('PRINT');
    });
  });
});
