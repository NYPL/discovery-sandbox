import React from 'react';
import cx from 'classnames';
import axios from 'axios';

import Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import Search from '../Search/Search.jsx';
import SearchButton from '../Buttons/SearchButton.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Hits from '../Hits/Hits.jsx';
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
      searchKeywords
    } = this.state;
  
    // console.log(ebscodata);

    return (
      <div className="search-container">

        <Breadcrumbs query={this.state.searchKeywords} />

        <div>
          <FacetSidebar ebscodata={ebscodata} />

          <div className="results-container">
            <Hits ebscodata={ebscodata} query={this.state.searchKeywords} />

            <Results ebscodata={ebscodata} />
          </div>
        </div>
      </div>
    );
  }
}

export default SearchResultsPage;
