import React from 'react';
import { mapObject as _mapObject } from 'underscore';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class Hits extends React.Component {
  constructor(props) {
    super(props);

    this.removeFacet = this.removeFacet.bind(this);
    this.getKeyword = this.getKeyword.bind(this);
    this.getFacetElements = this.getFacetElements.bind(this);
  }

  removeFacet(field) {
    Actions.removeFacet(field);
    let strSearch = '';

    // If the selected field that wants to be removed is found, then it is skipped over.
    // Otherwise, construct the query and hit the API again.
    _mapObject(this.props.facets, (val, key) => {
      if (field !== key && val.value !== '') {
        strSearch += ` ${key}:"${val.id}"`;
      }
    });

    axios
      .get(`/api?q=${this.props.query}${strSearch}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        this.context.router.push(`/search?q=${this.props.query}${strSearch}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getKeyword(keyword) {
    if (keyword) return (<span>with keywords <strong>"{keyword}"</strong></span>);
    return null;
  }

  getFacetElements(facets) {
    if (!facets.length) return null;

    return facets.map((facet, i) => {
      return (
        <span key={i}> with {facet.key} [{facet.val.value}]
          <a href="#" onClick={(e) => this.removeFacet(facet.key)}>[x]</a>
        </span>
      );
    });
  }

  render() {
    let activeFacetsArray = [];
    _mapObject(this.props.facets, (val, key) => {
      if (val.value) {
        activeFacetsArray.push({val, key});
      }
    });

    let keyword = this.getKeyword(this.props.query);
    let activeFacetsElm = this.getFacetElements(activeFacetsArray);

    return (
      <div className="results-message">
        <p>
          Found <strong>{this.props.hits}</strong> results {keyword} {activeFacetsElm}.
        </p>
      </div>
    );
  }
}

Hits.propTypes = {
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
  facets: React.PropTypes.object,
};

Hits.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Hits;
