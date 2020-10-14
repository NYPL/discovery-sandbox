/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mountTestRender, makeTestStore } from '../helpers/store';

// Import the component that is going to be tested
import BibPage from './../../src/app/components/BibPage/BibPage';
import bibs from '../fixtures/bibs';
import annotatedMarc from '../fixtures/annotatedMarc.json';

describe('BibPage', () => {
  let component;
  before(() => {
    const bib = { ...bibs[0], ...annotatedMarc };
    const mockStore = makeTestStore({ bib });
    component = mountTestRender(<BibPage location={{ search: 'search', pathname: '' }} />, { store: mockStore });
  });
  it('has Tabbed component with three tabs', () => {
    const tabbed = component.find('Tabbed');
    const tabs = tabbed.props().tabs;
    const tabTitles = tabs.map(tab => tab.title);
    expect(tabbed.length).to.equal(1);
    expect(tabs.length).to.equal(2);
    expect(tabTitles).to.deep.equal(['Details', 'Full Description']);
  });

  describe('serial', () => {
    before(() => {
      const bib = { ...bibs[0], ...annotatedMarc, holdings: [{ holdingDefinition: [{ term: 'mock', definition: [''] }] }] };
      const mockStore = makeTestStore({ bib });
      component = mountTestRender(<BibPage location={{ search: 'search', pathname: '' }} />, { store: mockStore });
    });

    it('has Tabbed component with four tabs', () => {
      const tabbed = component.find('Tabbed');
      const tabs = tabbed.props().tabs;
      const tabTitles = tabs.map(tab => tab.title);
      expect(tabbed.length).to.equal(1);
      expect(tabs.length).to.equal(3);
      expect(tabTitles).to.deep.equal(['Details', 'Full Description', 'Library Holdings']);
    });
  });
});
