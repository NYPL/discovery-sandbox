import React from 'react';
import {
  findWhere as _findWhere,
  forEach as _forEach,
} from 'underscore';

import Facet from './Facet';
import DateFacet from './DateFacet';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileView: false,
      mobileViewText: 'Refine search',
    };

    _forEach(this.props.facets, (facet) => {
      let id = '';
      let value = '';

      if (this.props.selectedFacets && this.props.selectedFacets[facet.field]) {
        id = this.props.selectedFacets[facet.field].id;
        value = this.props.selectedFacets[facet.field].value;
      }

      this.state[facet.field] = { id, value };
    });
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
    } = this.props;
    let facetsElm = null;

    const orderedFacets = [
      _findWhere(facets, { id: 'materialType' }),
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
        const selectedValue = this.state[field] ? this.state[field].id : '';

        if (facet.id === 'date') {
          return (
            <DateFacet
              key={i}
              totalHits={totalHits}
              keywords={searchKeywords}
              selectedFacets={this.props.selectedFacets}
            />
          );
        }

        return (
          <Facet
            key={i}
            facet={facet}
            totalHits={totalHits}
            selectedValue={selectedValue}
            keywords={searchKeywords}
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
  facets: React.PropTypes.array,
  searchKeywords: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
  className: React.PropTypes.string,
  totalHits: React.PropTypes.number,
  createAPIQuery: React.PropTypes.func,
};

FacetSidebar.defaultProps = {
  className: '',
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
