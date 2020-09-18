/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mountTestRender, makeTestStore } from '../helpers/store';

// Import the component that is going to be tested
import BibPage from './../../src/app/components/BibPage/BibPage';
import bibs from '../fixtures/bibs';

describe('BibPage', () => {
  let component;
  before(() => {
    const mockStore = makeTestStore({ bib: bibs[0] });
    component = mountTestRender(<BibPage location={{ search: 'search', pathname: '' }} />, { store: mockStore });
  });
  it('has Tabbed component with three tabs', () => {
    const tabbed = component.find('Tabbed');
    const tabs = tabbed.props().tabs;
    const titles = tabs.map(tab => tab.title);
    expect(tabbed.length).to.equal(1);
    expect(tabs.length).to.equal(3);
    expect(titles).to.deep.equal(['Availability', 'Details', 'Full Description']);
  });
});
