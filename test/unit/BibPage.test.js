/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

// Import Bib for pre-processing

import Bib from './../../src/server/ApiRoutes/Bib';

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
        dispatch={() => {}}
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
    let holdingsTab;
    before(() => {
      mockBibWithHolding.holdings.forEach(holding => Bib.addHoldingDefinition(holding));
      Bib.addCheckInItems(mockBibWithHolding);
      const bib = { ...mockBibWithHolding, ...annotatedMarc };
      const testStore = {
        bib: {
          done: true,
          numItems: 0,
        },
        getState: () => testStore,
        subscribe: () => {},
      };

      component = mount(
        <Provider store={testStore}>
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={bib}
            dispatch={() => {}}
          />
        </Provider>
        , {
          context: {
            router: { location: { query: {} }, createHref: () => {} },
          },
          childContextTypes: { router: PropTypes.object },
        });
      itemTable = component.find('ItemTable');
    });

    it('has Tabbed component with four tabs', () => {
      const tabbed = component.find('Tabbed');
      const tabs = tabbed.props().tabs;
      const tabTitles = tabs.map(tab => tab.title);
      expect(tabbed.length).to.equal(1);
      expect(tabs.length).to.equal(4);
      expect(tabTitles).to.deep.equal(['Availability', 'Details', 'Full Description', 'Library Holdings']);
    });

    it('has item table with volume column', () => {
      expect(itemTable.find('th').at(0).text()).to.equal('Vol/Date');
    });

    it('gets the format from holdings statement', () => {
      expect(itemTable.find('td').at(1).text()).to.equal('PRINT');
    });

    it('displays any notes in the "Library Holdings" tab', () => {
      expect(component.find('dt').findWhere(n => n.type() === 'dt' && n.text() === 'Notes').length).to.equal(1);
    });
  });
});
