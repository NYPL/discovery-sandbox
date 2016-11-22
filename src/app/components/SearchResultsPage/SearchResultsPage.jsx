import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';
import Search from '../Search/Search.jsx';
import { collapse } from '../../utils/utils.js';

import { findWhere as _findWhere,
findIndex as _findIndex } from 'underscore';

class SearchResultsPage extends React.Component {
  componentWillMount() {
    // if (this.props.location.search.substring(3)) {
    //   let q = decodeURIComponent(this.props.location.search.substring(3));
    //   let spaceIndex;

    //   if (q.indexOf(':') !== -1) {
    //     spaceIndex = (q.substring(0, q.indexOf(':'))).lastIndexOf(' ');
    //   } else {
    //     spaceIndex = q.length;
    //   }

    //   const paramkeywords = q.substring(0, spaceIndex);
    //   let urlFacet = q.substring(spaceIndex + 1);

    //   let selectedFacets = {};

    //   if (urlFacet) {
    //     let facetStrArray = q.substring(spaceIndex + 1).replace(/\" /, '"#').split('#');

    //     facetStrArray.forEach(str => {
    //       if (!str) return;

    //       // Each string appears like so: 'contributor:"United States. War Department."'
    //       // Can't simply split by ':' because some strings are: 'owner:"orgs:1000"'
    //       const field = str.split(':"')[0];
    //       const value = str.split(':"')[1].replace('"', '');

    //       // console.log(field, this.props.facets.itemListElement)
    //       let index = _findIndex(this.props.facets.itemListElement, { field });
    //       let v = _findWhere(this.props.facets.itemListElement[index].values, { value });
    //       console.log(v);
    //       selectedFacets[field] = {
    //         id: v.value,
    //         value: v.label || v.value,
    //       };
    //     });
    //   }

    //   Actions.updateSelectedFacets(selectedFacets);
    //   axios
    //     .get(`/api?q=${q}`)
    //     .then(response => {
    //       Actions.updateSearchResults(response.data.searchResults);
    //       Actions.updateFacets(response.data.facets);
    //       Actions.updateSearchKeywords(paramkeywords);
    //     })
    //     .catch(error => {
    //       console.log(error);
    //     });
    // } else
    if (!this.props.searchResults) {
      console.log('test');
      axios
        .get(`/api?q=${this.props.searchKeywords}`)
        .then(response => {
          Actions.updateSearchResults(response.data.searchResults);
          Actions.updateSearchKeywords(this.props.searchKeywords);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const {
      searchResults,
      searchKeywords,
      facets,
      selectedFacets,
      page,
      location,
      sortBy,
    } = this.props;
    const facetList = facets && facets.itemListElement ? facets.itemListElement : [];
    const dateRange = searchResults ? searchResults.dateRange : null;
    const totalHits = searchResults ? searchResults.totalResults : 0;
    const results = searchResults ? collapse({ searchResults }).searchResults.itemListElement : [];
    const breadcrumbs = (
      <div className="page-header">
        <div className="container">
          <Breadcrumbs query={searchKeywords} type="search" />
        </div>
      </div>
    );

    return (
      <div id="mainContent">
        <div className="search-container">
          <Search sortBy={sortBy} />
        </div>

        {breadcrumbs}

        <div className="container search-results-container">

          <FacetSidebar
            facets={facetList}
            selectedFacets={selectedFacets}
            keywords={searchKeywords}
            sortBy={sortBy}
          />

          <div className="results">
            <Hits
              hits={totalHits}
              query={searchKeywords}
              facets={selectedFacets}
              sortBy={sortBy}
            />

            <Results
              hits={totalHits}
              results={results}
              query={searchKeywords}
              location={location}
              page={page}
              selectedFacets={selectedFacets}
              sortBy={sortBy}
            />
          </div>
        </div>
      </div>
    );
  }
}

SearchResultsPage.propTypes = {
  searchResults: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default SearchResultsPage;
