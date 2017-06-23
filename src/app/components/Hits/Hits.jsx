import React from 'react';
import PropTypes from 'prop-types';
import {
  mapObject as _mapObject,
  each as _each,
  isEmpty as _isEmpty,
  isArray as _isArray,
  keys as _keys,
} from 'underscore';

import ClearHits from './ClearHits';
import KeywordSelection from './KeywordSelection';
import FilterSelection from './FilterSelection';

class Hits extends React.Component {
  constructor(props) {
    super(props);

    this.getSelectedFacets = this.getSelectedFacets.bind(this);
  }

  getSelectedFacets(facets) {
    if (_isEmpty(facets)) return null;
    const renderedElms = [];
    const filterLen = _keys(facets).length - 1;
    let j = 0;
    _mapObject(facets, (value, key) => {
      _each(value, (facet, i) => {
        renderedElms.push(
          <FilterSelection
            key={`${key}-${i}`}
            facetKey={key}
            facet={facet}
            apiQuery={this.props.createAPIQuery({ selectedFacets: this.props.selectedFacets })}
          />
        );
        if (i < value.length - 1) {
          renderedElms.push(<span key={`value-comma-${i}`}>, </span>);
        }
      });

      if (j < filterLen) {
        renderedElms.push(<span key={`filter-comma-${j}`}>, </span>);
      }
      j++;
    });

    return renderedElms;
  }

  displayClear() {
    const {
      selectedFacets,
      searchKeywords,
      error,
    } = this.props;

    if (selectedFacets.length || searchKeywords.length && _isEmpty(error)) {
      return (<ClearHits />);
    }

    return null;
  }

  displayResultsCount() {
    const {
      selectedFacets,
      hits,
      searchKeywords,
      error,
    } = this.props;
    const activeFacets = {};
    const hitsF = hits ? hits.toLocaleString() : '';

    if (error && error.code === 'ENOTFOUND' || error.status > 400) {
      return (
        <p>There was an error gathering results. Please try again.</p>
      );
    }

    _mapObject(selectedFacets, (val, key) => {
      if (key === 'dateAfter' || key === 'dateBefore') {
        // Converting the date object value into an array of one object
        // just for rendering purposes.
        if (!_isEmpty(val) && val.id) {
          activeFacets[key] = [];
          activeFacets[key].push(val);
        }
      } else if (val.length && _isArray(val)) {
        activeFacets[key] = [];
        _each(val, facet => {
          if (facet.value) {
            activeFacets[key].push({ id: facet.id, value: facet.value });
          }
        });
      }
    });

    const keyword = searchKeywords &&
      (<KeywordSelection
        keyword={searchKeywords}
        apiQuery={this.props.createAPIQuery({ searchKeywords: '' })}
      />);
    const selectedFacetElms = this.getSelectedFacets(activeFacets);
    if (this.props.spinning) {
      return (<p><strong className="nypl-results-count">Loading…</strong></p>);
    }

    if (hits !== 0) {
      if (!keyword && !selectedFacetElms) {
        return (<p><strong className="nypl-results-count">{hitsF}</strong>results found.</p>);
      }
      return (
        <p>
          <strong className="nypl-results-count">{hitsF}</strong>
           results found for {keyword}{keyword && selectedFacetElms && ', '}{selectedFacetElms}.
        </p>);
    }
    return (<p>No results found for {keyword}{selectedFacetElms}.</p>);
  }

  render() {
    const activeResultsCount = this.displayResultsCount();
    const clearHits = this.displayClear();

    return (
      <div
        id="results-description"
        className="nypl-results-summary"
        aria-live="assertive"
        aria-atomic="true"
        role="presentation"
      >
        {activeResultsCount}
        {clearHits}
      </div>
    );
  }
}

Hits.propTypes = {
  hits: PropTypes.number,
  searchKeywords: PropTypes.string,
  spinning: PropTypes.bool,
  selectedFacets: PropTypes.object,
  createAPIQuery: PropTypes.func,
  error: PropTypes.object,
};

Hits.defaultProps = {
  hits: 0,
  spinning: false,
  selectedFacets: [],
  searchKeywords: '',
};

Hits.contextTypes = {
  router: PropTypes.object,
};

export default Hits;
