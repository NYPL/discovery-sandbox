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
    if (!this.props.ebscodata) {
      axios
        .get(`/api?q=${this.props.searchKeywords}`)
        .then(response => {
          Actions.updateEbscoData(response.data);
          Actions.updateSearchKeywords(this.props.searchKeywords);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  render() {
    const {
      ebscodata,
      searchKeywords,
    } = this.props;
    let breadcrumbs = null;
    const facets = ebscodata ? ebscodata.facets : [];
    const dateRange = ebscodata ? ebscodata.dateRange : null;
    const totalHits = ebscodata ? ebscodata.totalHits : 0;
    const results = ebscodata ? ebscodata.results : [];

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
  ebscodata: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
};

export default SearchResultsPage;
