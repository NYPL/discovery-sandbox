import React from 'react';

import Actions from '../../actions/Actions.js';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';
import Search from '../Search/Search.jsx';

class SearchResultsPage extends React.Component {
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
    const results = searchResults ? searchResults.itemListElement : [];
    const breadcrumbs = (
      <div className="page-header">
        <div className="content-wrapper">
          <Breadcrumbs query={searchKeywords} type="search" />
        </div>
      </div>
    );

    return (
      <div id="mainContent">

        {breadcrumbs}

        <div className="content-wrapper">
          <Search
            sortBy={sortBy}
            selectedFacets={selectedFacets}
          />
        </div>

        <div className="content-wrapper">

          <FacetSidebar
            facets={facetList}
            selectedFacets={selectedFacets}
            keywords={searchKeywords}
            sortBy={sortBy}
            className="quarter"
          />

          <div
            className="results three-quarter"
            role="region"
            id="results-region"
            aria-live="polite"
            aria-atomic="true"
            aria-relevant="additions removals"
            aria-describedby="results-description"
          >
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
  page: React.PropTypes.string,
  location: React.PropTypes.object,
  sortBy: React.PropTypes.string,
};

export default SearchResultsPage;
