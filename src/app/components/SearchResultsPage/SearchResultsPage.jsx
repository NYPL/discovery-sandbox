import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';
import Search from '../Search/Search.jsx';
import { collapse } from '../../utils/utils.js';

class SearchResultsPage extends React.Component {
  componentWillMount() {
    if (!this.props.searchResults) {
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

        {breadcrumbs}

        <div className="search-container">
          <Search sortBy={sortBy} />
        </div>

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
  facets: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
  page: React.PropTypes.number,
  location: React.PropTypes.object,
  sortBy: React.PropTypes.string,
};

export default SearchResultsPage;
