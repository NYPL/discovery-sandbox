/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import sinon from 'sinon';

const mock = new MockAdapter(axios);

import SearchResultsPage from '../../src/app/components/SearchResultsPage/SearchResultsPage.jsx';
import Actions from '../../src/app/actions/Actions.js';
import FacetSidebar from '../../src/app/components/FacetSidebar/FacetSidebar.jsx';

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

describe('SearchResultsPage', () => {
  describe('Component properties', () => {
    let component;

    before(() => {
      // Added this empty prop so that the `componentWillMount` method will be skipped.
      // That lifecycle hook is tested later on.
      component = mount(
        <SearchResultsPage
          searchResults={{}}
          location={{ search: '' }}
        />
      );
    });

    it('should be wrapped in a .mainContent', () => {
      expect(component.find('#mainContent')).to.have.length(1);
    });

    it('should render a <Search /> components', () => {
      expect(component.find('Search')).to.have.length(1);
    });

    it('should render a <Breadcrumbs /> components', () => {
      expect(component.find('Breadcrumbs')).to.have.length(1);
    });

    it('should render a <FacetSidebar /> components', () => {
      expect(component.find('FacetSidebar')).to.have.length(1);
    });

    it('should render a <Hits /> components', () => {
      expect(component.find('Hits')).to.have.length(1);
    });

    it('should render a <ResultsList /> components', () => {
      expect(component.find('ResultsList')).to.have.length(0);
    });

    it('should have empty search results', () => {
      // eql is deep equal
      // In order to test for props, the components needs to be mounted with `enzyme.mount`.
      expect(component.props().searchResults).to.eql({});
    });
  });

  describe('With passed search results prop', () => {
    let component;
    let spyUpdateSearchResults;
    let spyUpdateSearchKeywords;

    before(() => {
      component = mount(
        <SearchResultsPage
          searchKeywords="locofocos"
          searchResults={searchResults}
          location={{ search: '' }}
        />
      );
      spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
      spyUpdateSearchKeywords = sinon.spy(Actions, 'updateSearchKeywords');
    });

    after(() => {
      Actions.updateSearchResults.restore();
      Actions.updateSearchKeywords.restore();
    })

    it('should have search results', () => {
      expect(component.props().searchResults).to.be.defined;
    });

    it('should have two results in the `itemListElement` array', () => {
      expect(component.props().searchResults.itemListElement).to.have.length(2);
    });

    it('should not call two Action functions since data is being passed', () => {
      expect(spyUpdateSearchResults.callCount).to.equal(0);
      expect(spyUpdateSearchKeywords.callCount).to.equal(0);
    });
  });

  // Mounting the SearchResultsPage without searchResults prop will make it fetch data. This is for
  // a use case when navigation back in the history through the brower's back button. Still needs
  // to be fully tested and updated.
  // describe('Fetching data', () => {
  //   let component;
  //   let spyUpdateSearchResults;
  //   let spyUpdateSearchKeywords;
  //
  //   before(() => {
  //     spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
  //     spyUpdateSearchKeywords = sinon.spy(Actions, 'updateSearchKeywords');
  //
  //     mock
  //       .onGet('/api?q=locofocos')
  //       .reply(200, { searchResults });
  //
  //     component = mount(
  //       <SearchResultsPage
  //         searchKeywords="locofocos"
  //         location={{ search: '' }}
  //       />
  //     );
  //   });
  //
  //   after(() => {
  //     mock.reset();
  //     Actions.updateSearchResults.restore();
  //     Actions.updateSearchKeywords.restore();
  //   });
  //
  //   it('should call two Action functions after the ajax call for data', () => {
  //     expect(spyUpdateSearchResults.callCount).to.equal(1);
  //     expect(spyUpdateSearchKeywords.callCount).to.equal(1);
  //   });
  // });

  describe('With facet data as prop', () => {
    const facets = { itemListElement: [] };
    let component;

    before(() => {
      component = mount(
        <SearchResultsPage
          searchResults={{}}
          searchKeywords="locofocos"
          facets={facets}
          location={{ search: '' }}
        />
      );
    });

    after(() => {
    });

    it('should contain FacetSidebar', () => {
      expect(component.find('FacetSidebar')).to.have.length(1);
    });
  });
});
