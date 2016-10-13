import React from 'react';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';

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
            <Breadcrumbs query={searchKeywords} />
          </div>
        </div>
      );
    }

    return (
      <div>
        {breadcrumbs}

        <div className="container search-results-container">

          <FacetSidebar
            facets={ebscodata.facets}
            keywords={searchKeywords}
            dateRange={ebscodata.dateRange}
          />

          <div className="results">
            <Hits hits={ebscodata.totalHits} query={searchKeywords} />

            <Results hits={ebscodata.totalHits} results={ebscodata.results} />
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
