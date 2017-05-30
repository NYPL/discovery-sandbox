import React from 'react';
import { mapObject as _mapObject } from 'underscore';

import Actions from '../../actions/Actions.js';
import { ajaxCall } from '../../utils/utils.js';

class Hits extends React.Component {
  constructor(props) {
    super(props);

    this.removeFacet = this.removeFacet.bind(this);
    this.getKeyword = this.getKeyword.bind(this);
    this.getFacetElements = this.getFacetElements.bind(this);
    this.getFacetLabel = this.getFacetLabel.bind(this);
  }

  getKeyword(keyword) {
    if (keyword) {
      return (
        <span className="nypl-facet">&nbsp;with keywords <strong>{keyword}</strong>
          <button
            onClick={() => this.removeKeyword(keyword)}
            className="remove-keyword"
            aria-controls="results-region"
          >
            <svg className="nypl-icon" preserveAspectRatio="xMidYMid meet" viewBox="0 0 10 10" aria-hidden="true">
              <title>times.icon</title>
              <polygon points="2.3,6.8 3.2,7.7 5,5.9 6.8,7.7 7.7,6.8 5.9,5 7.7,3.2 6.8,2.3 5,4.1 3.2,2.3 2.3,3.2 4.1,5 "></polygon>
            </svg>
            <span className="hidden">remove keyword filter&nbsp;{keyword}</span>
          </button>
        </span>
      );
    }

    return null;
  }

  getFacetLabel(field) {
    if (field === 'materialType') {
      return 'Material Type';
    } else if (field === 'subjectLiteral') {
      return 'Subject';
    } else if (field === 'creatorLiteral') {
      return 'Author';
    } else if (field.indexOf('date') !== -1) {
      return 'Date';
    }
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  getFacetElements(facets) {
    if (!facets.length) return null;

    return facets.map((facet, i) => (
      <span key={i} className="nypl-facet">
        &nbsp;with {this.getFacetLabel(facet.key)} <strong>{facet.val.value}</strong>
        <button
          onClick={() => this.removeFacet(facet.key)}
          className="remove-facet"
          aria-controls="results-region"
        >
          <svg className="nypl-icon" preserveAspectRatio="xMidYMid meet" viewBox="0 0 10 10" aria-hidden="true">
            <title>times.icon</title>
            <polygon points="2.3,6.8 3.2,7.7 5,5.9 6.8,7.7 7.7,6.8 5.9,5 7.7,3.2 6.8,2.3 5,4.1 3.2,2.3 2.3,3.2 4.1,5 "></polygon>
          </svg>
          <span className="hidden">remove filter&nbsp;{facet.val.value}</span>
        </button>
      </span>
    ));
  }

  removeKeyword() {
    Actions.updateSpinner(true);
    Actions.updateSearchKeywords('');

    const apiQuery = this.props.createAPIQuery({ searchKeywords: '' });

    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
  }

  removeFacet(field) {
    Actions.updateSpinner(true);
    Actions.removeFacet(field);

    const apiQuery = this.props.createAPIQuery({ selectedFacets: this.props.selectedFacets });

    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
  }

  displayResultsCount() {
    const {
      selectedFacets,
      hits,
      searchKeywords,
    } = this.props;
    const activeFacetsArray = [];
    const hitsF = hits ? hits.toLocaleString() : '';

    _mapObject(selectedFacets, (val, key) => {
      if (val.value) {
        activeFacetsArray.push({ val, key });
      }
    });
    const keyword = this.getKeyword(searchKeywords);
    const activeFacetsElm = this.getFacetElements(activeFacetsArray);
    if (this.props.spinning) {
      return (<p><strong className="nypl-results-count">Loading…</strong></p>);
    }
    if (hits !== 0) {
      return (
        <p>
          <strong className="nypl-results-count">{hitsF}</strong>
           results found{keyword}{activeFacetsElm}
        </p>);
    }
    return (<p>No results found{keyword}{activeFacetsElm}.</p>);
  }

  render() {
    const activeResultsCount = this.displayResultsCount();
    return (
      <div
        id="results-description"
        className="nypl-results-summary"
        aria-live="assertive"
        aria-atomic="true"
        role="presentation"
      >
        {activeResultsCount}
      </div>
    );
  }
}

Hits.propTypes = {
  hits: React.PropTypes.number,
  searchKeywords: React.PropTypes.string,
  spinning: React.PropTypes.bool,
  selectedFacets: React.PropTypes.object,
  createAPIQuery: React.PropTypes.func,
};

Hits.defaultProps = {
  hits: 0,
  spinning: false,
};

Hits.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Hits;
