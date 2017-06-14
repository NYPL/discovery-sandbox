import React from 'react';
import PropTypes from 'prop-types';
import { findWhere as _findWhere } from 'underscore';

import Facet from './Facet';
import DateFacet from './DateFacet';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileView: false,
      mobileViewText: 'Refine search',
    };
  }

  toggleFacetsMobile() {
    if (this.state.mobileView) {
      this.setState({
        mobileView: false,
        mobileViewText: 'Refine search',
      });
    } else {
      this.setState({
        mobileView: true,
        mobileViewText: 'Hide facets',
      });
    }
  }

  render() {
    const {
      facets,
      totalHits,
      searchKeywords,
      selectedFacets,
    } = this.props;
    let facetsElm = null;

    const orderedFacets = [
      _findWhere(facets, { id: 'materialType' }),
      _findWhere(facets, { id: 'owner' }),
      _findWhere(facets, { id: 'subjectLiteral' }),
      { id: 'date' },
      _findWhere(facets, { id: 'issuance' }),
      _findWhere(facets, { id: 'publisher' }),
      _findWhere(facets, { id: 'language' }),
    ];

    if (facets.length) {
      facetsElm = orderedFacets.map((facet, i) => {
        if (!facet) return null;
        if (facet && facet.values && facet.values.length < 1) {
          return null;
        }

        const field = facet.field;
        const selectedValues = selectedFacets[field] && selectedFacets[field].length ?
          selectedFacets[field] : [];

        if (facet.id === 'date') {
          return (
            <DateFacet
              key={i}
              totalHits={totalHits}
              keywords={searchKeywords}
              selectedFacets={selectedFacets}
              createAPIQuery={this.props.createAPIQuery}
              spinning={this.props.spinning}
            />
          );
        }

        return (
          <Facet
            key={i}
            facet={facet}
            selectedFacets={selectedFacets}
            totalHits={totalHits}
            selectedValues={selectedValues}
            createAPIQuery={this.props.createAPIQuery}
            spinning={this.props.spinning}
          />
        );
      });
    }

    return (
      <div className="nypl-column-one-quarter">
        <div className="nypl-mobile-refine">
          <button
            className="nypl-primary-button"
            aria-controls="filter-search"
            aria-expanded={this.state.mobileView}
            onClick={() => this.toggleFacetsMobile()}
          >
            {this.state.mobileViewText}
          </button>
        </div>
        <form
          id="filter-search"
          className={`nypl-search-form ${this.state.mobileView ? 'active' : ''}`}
        >
          {facetsElm}
        </form>
      </div>
    );
  }
}

FacetSidebar.propTypes = {
  facets: PropTypes.array,
  searchKeywords: PropTypes.string,
  selectedFacets: PropTypes.object,
  className: PropTypes.string,
  totalHits: PropTypes.number,
  createAPIQuery: PropTypes.func,
  spinning: PropTypes.bool,
};

FacetSidebar.defaultProps = {
  className: '',
};

FacetSidebar.contextTypes = {
  router: PropTypes.object,
};

export default FacetSidebar;
