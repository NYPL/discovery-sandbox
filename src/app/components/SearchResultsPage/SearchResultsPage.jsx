import React from 'react';
import axios from 'axios';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import Results from '../Results/Results.jsx';

import {
  isEmpty as _isEmpty,
  extend as _extend,
  keys as _keys,
} from 'underscore';

/**
 * The main container for the top Search section.
 */
class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      ebscodata,
      searchKeywords,
    } = this.props;
    let breadcrumbs = null;
    
    // console.log(ebscodata);

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
      <div className="container search-results-container">
        {breadcrumbs}

        <FacetSidebar ebscodata={ebscodata} keywords={searchKeywords} />

        <div className="results">
          <Hits ebscodata={ebscodata} query={searchKeywords} />

          <Results ebscodata={ebscodata} />
        </div>
      </div>
    );
  }
}

export default SearchResultsPage;
