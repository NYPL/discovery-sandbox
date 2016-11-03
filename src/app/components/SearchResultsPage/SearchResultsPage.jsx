import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';
import Search from '../Search/Search.jsx';

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
    } = this.props;
    let breadcrumbs = null;
    const facetList = facets && facets.itemListElement ? facets.itemListElement : [];
    const dateRange = searchResults ? searchResults.dateRange : null;
    const totalHits = searchResults ? searchResults.totalResults : 0;
    const results = searchResults ? searchResults.itemListElement : [];

    if (searchKeywords) {
      breadcrumbs = (
        <div className="page-header">
          <div className="container">
            <Breadcrumbs query={searchKeywords} type="search" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="search-container">
          <Search />
        </div>

        {breadcrumbs}

        <div className="container search-results-container">

          <FacetSidebar
            facets={facetList}
            keywords={searchKeywords}
          />

          <div className="results">
            <Hits hits={totalHits} query={searchKeywords} />

            <Results
              hits={totalHits}
              results={results}
              query={searchKeywords}
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
