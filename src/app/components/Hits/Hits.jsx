import React from 'react';
import { mapObject as _mapObject } from 'underscore';

import Actions from '../../actions/Actions.js';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils.js';

class Hits extends React.Component {
  constructor(props) {
    super(props);

    this.removeFacet = this.removeFacet.bind(this);
    this.getKeyword = this.getKeyword.bind(this);
    this.getFacetElements = this.getFacetElements.bind(this);
  }

  getKeyword(keyword) {
    if (keyword) {
      return (
        <span>&nbsp;with keywords <strong>{keyword}</strong>
          <button
            onClick={() => this.removeKeyword(keyword)}
            className="remove-keyword"
            aria-controls="results-region"
          >
            <span className="visuallyHidden">remove keyword filter&nbsp;{keyword}</span>
          </button>
        </span>
      );
    }

    return null;
  }

  getFacetElements(facets) {
    if (!facets.length) return null;

    return facets.map((facet, i) => (
      <span key={i}>&nbsp;with {facet.key} <strong>{facet.val.value}</strong>
        <button
          onClick={() => this.removeFacet(facet.key)}
          className="remove-facet"
          aria-controls="results-region"
        >
          <span className="visuallyHidden">remove filter&nbsp;{facet.val.value}</span>
        </button>
      </span>
    ));
  }

  removeKeyword() {
    Actions.updateSearchKeywords('');

    const sortQuery = getSortQuery(this.props.sortBy);
    const strSearch = getFacetParams(this.props.facets);

    ajaxCall(`/api?q=${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?q=${strSearch}${sortQuery}`);
    });
  }

  removeFacet(field) {
    Actions.removeFacet(field);

    const sortQuery = getSortQuery(this.props.sortBy);
    const strSearch = getFacetParams(this.props.facets, field);

    ajaxCall(`/api?q=${this.props.query}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?q=${this.props.query}${strSearch}${sortQuery}`);
    });
  }

  render() {
    const {
      facets,
      hits,
      query,
    } = this.props;
    const activeFacetsArray = [];
    const hitsF = hits ? hits.toLocaleString() : '';

    _mapObject(facets, (val, key) => {
      if (val.value) {
        activeFacetsArray.push({ val, key });
      }
    });

    const keyword = this.getKeyword(query);
    const activeFacetsElm = this.getFacetElements(activeFacetsArray);

    return (
      <div id="results-description" className="results-summary">
        {
          hits !== 0 ?
          (<p><strong className="results-count">{hitsF}</strong> results found{keyword}{activeFacetsElm}.</p>)
          : (<p>No results found{keyword}{activeFacetsElm}.</p>)
        }
      </div>
    );
  }
}

Hits.propTypes = {
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
  facets: React.PropTypes.object,
  sortBy: React.PropTypes.string,
};

Hits.defaultProps = {
  hits: 0,
};

Hits.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Hits;
