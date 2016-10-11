import React from 'react';
import axios from 'axios';

import Store from '../../stores/Store.js';

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

    this.state = Store.getState();
    this.onChange = this.onChange.bind(this);
  }


  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentDidUnMount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(Store.getState());
  }

  render() {
    const {
      ebscodata,
      searchKeywords,
    } = this.state;
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

        <FacetSidebar ebscodata={ebscodata} keywords={this.state.searchKeywords} />

        <div className="results">
          <Hits ebscodata={ebscodata} query={this.state.searchKeywords} />

          <Results ebscodata={ebscodata} />
        </div>
      </div>
    );
  }
}

export default SearchResultsPage;
