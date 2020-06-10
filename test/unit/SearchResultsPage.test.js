/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import PropTypes from 'prop-types';

import SearchResults from '../../src/app/pages/SearchResults';
import { mockRouterContext } from '../helpers/routing';

// Eventually, it would be nice to have mocked data in a different file and imported.
const searchResults = {
  '@context': 'http://api.data.nypl.org/api/v1/context_all.jsonld',
  '@type': 'itemList',
  itemListElement: [
    {
      '@type': 'searchResult',
      result: {},
    },
    {
      '@type': 'searchResult',
      result: {},
    },
  ],
  totalResults: 2,
};

const context = mockRouterContext();
const childContextTypes = {
  router: PropTypes.object,
};

describe('SearchResultsPage', () => {
  describe('Component properties', () => {
    let component;

    before(() => {
      // Added this empty prop so that the `componentWillMount` method will be skipped.
      // That lifecycle hook is tested later on.
      component = mount(
        <SearchResults
          searchResults={{}}
          location={{ search: '' }}
        />,
        { attachTo: document.body,
          context,
          childContextTypes,
        },
      );
    });

    after(() => {
      component.unmount();
    });

    it('should be wrapped in a .main-page', () => {
      expect(component.find('.main-page')).to.have.length(1);
    });

    it('should render a <Breadcrumbs /> components', () => {
      expect(component.find('Breadcrumbs')).to.have.length(1);
    });

    it('should render a <Search /> components', () => {
      expect(component.find('Search')).to.have.length(1);
    });

    it('should render a <ResultsCount /> components', () => {
      expect(component.find('ResultsCount')).to.have.length(1);
    });

    it('should not render a <SearchResultsSorter /> components, since there are no results', () => {
      expect(component.find('SearchResultsSorter')).to.have.length(0);
    });

    it('should not render a <ResultsList /> components, since there are no results', () => {
      expect(component.find('ResultsList')).to.have.length(0);
    });

    it('should not render a <Pagination /> components, since there are no results', () => {
      expect(component.find('Pagination')).to.have.length(0);
    });

    it('should have empty search results', () => {
      // eql is deep equal
      // In order to test for props, the components needs to be mounted with `enzyme.mount`.
      expect(component.props().searchResults).to.eql({});
    });
  });

  describe('With passed search results prop', () => {
    let component;

    before(() => {
      component = mount(
        <SearchResults
          searchKeywords="locofocos"
          searchResults={searchResults}
          location={{ search: '' }}
        />,
        { attachTo: document.body, context, childContextTypes }
      );
    });

    after(() => {
      component.unmount();
    });

    it('should have search results', () => {
      // searchResults is the mocked object found in the beginning of the file.
      expect(component.props().searchResults).to.eql(searchResults);
    });

    it('should have two results in the `itemListElement` array', () => {
      expect(component.props().searchResults.itemListElement).to.have.length(2);
    });

    it('should render a <SearchResultsSorter /> components', () => {
      expect(component.find('SearchResultsSorter')).to.have.length(1);
    });

    it('should render a <ResultsList /> components', () => {
      expect(component.find('ResultsList')).to.have.length(1);
    });

    it('should render a <Pagination /> components', () => {
      expect(component.find('Pagination')).to.have.length(1);
    });
  });

  describe('DOM structure', () => {
    let component;

    before(() => {
      component = mount(
        <SearchResults
          searchKeywords="locofocos"
          searchResults={searchResults}
          location={{ search: '' }}
        />,
        { attachTo: document.body, context, childContextTypes }
      );
    });

    after(() => {
      component.unmount();
    });

    it('should have an h1 with "Search Results"', () => {
      const h1 = component.find('h1');
      expect(h1).to.have.length(1);
      expect(h1.text()).to.equal('Search Results');
      expect(h1.prop('aria-label')).to.equal('Search results for locofocos page 1 of 1');
    });

    it('should a .nypl-page-header', () => {
      expect(component.find('.nypl-page-header')).to.have.length(1);
    });

    it('should have four .nypl-full-width-wrapper elements', () => {
      expect(component.find('.nypl-full-width-wrapper')).to.have.length(4);
    });
  });
});
