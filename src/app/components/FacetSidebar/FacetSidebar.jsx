import React from 'react';
import {
  extend as _extend,
  findWhere as _findWhere,
  forEach as _forEach,
} from 'underscore';

import Store from '../../stores/Store';
import Facet from './Facet';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      mobileView: false,
      mobileViewText: 'Refine search',
    }, Store.getState());

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
      keywords,
    } = this.props;
    let facetsElm = null;

    const orderedFacets = [
      _findWhere(facets, { id: 'materialType' }),
      _findWhere(facets, { id: 'subjectLiteral' }),
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

        return (
          <Facet
            key={i}
            facet={facet}
            totalHits={totalHits}
            selectedValue={selectedValue}
            keywords={keywords}
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
  keywords: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
  className: React.PropTypes.string,
  totalHits: React.PropTypes.number,
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
