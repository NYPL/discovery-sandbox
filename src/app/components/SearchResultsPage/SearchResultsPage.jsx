import React from 'react';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';
import Search from '../Search/Search.jsx';

class SearchResultsPage extends React.Component {
  render() {
    const {
      ebscodata,
      searchKeywords,
    } = this.props;
    let breadcrumbs = null;

    console.log(ebscodata);

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
            facets={ebscodata.facets}
            keywords={searchKeywords}
            dateRange={ebscodata.dateRange}
          />

          <div className="results">
            <Hits hits={ebscodata.totalHits} query={searchKeywords} />

            <Results
              hits={ebscodata.totalHits}
              results={ebscodata.results}
              query={searchKeywords}
            />
          </div>
        </div>
      </div>
    );
  }
}

SearchResultsPage.propTypes = {
  ebscodata: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default SearchResultsPage;
