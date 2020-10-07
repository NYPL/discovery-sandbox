/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

// Import the unwrapped component that is going to be tested
import { BibPage } from './../../src/app/components/BibPage/BibPage';
import bibs from '../fixtures/bibs';
import annotatedMarc from '../fixtures/annotatedMarc.json';

describe('BibPage', () => {
  let component;
  before(() => {
    const bib = { ...bibs[0], ...annotatedMarc };
    component = shallow(<BibPage
      location={{ search: 'search', pathname: '' }}
      bib={bib}
    />, { context: {
      router: { location: {} },
    } });
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
      const bib = { ...bibs[0], ...annotatedMarc, holdings: { holding_string: 'holdings data' } };
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
      expect(tabs.length).to.equal(3);
      expect(tabTitles).to.deep.equal(['Details', 'Full Description', 'Library Holdings']);
    });
  });
});
