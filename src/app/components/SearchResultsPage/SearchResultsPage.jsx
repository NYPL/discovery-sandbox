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
          Actions.updateSearchResults(response.data);
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
    } = this.props;
    let breadcrumbs = null;
    const facets = searchResults && searchResults.facets ? searchResults.facets : [];
    const dateRange = searchResults ? searchResults.dateRange : null;
    const totalHits = searchResults ? searchResults.totalResults : 0;
    // const results = searchResults ? searchResults.results : [];
    const results = searchResults ? searchResults.itemListElement : [];

    console.log(results);

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
            facets={facets}
            keywords={searchKeywords}
            dateRange={dateRange}
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
