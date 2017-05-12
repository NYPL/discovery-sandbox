import React from 'react';

import {
  extend as _extend,
  findWhere as _findWhere,
  chain as _chain,
  pick as _pick,
} from 'underscore';

import Actions from '../../actions/Actions';
import Store from '../../stores/Store';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils';

const facetShowLimit = 9;

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      mobileView: false,
      mobileViewText: 'Refine search',
      openFacet: false,
      spinning: false,
    }, Store.getState());

    this.props.facets.map((facet) => {
      let id = '';
      let value = '';

      if (this.props.selectedFacets && this.props.selectedFacets[facet.field]) {
        id = this.props.selectedFacets[facet.field].id;
        value = this.props.selectedFacets[facet.field].value;
      }

      this.state[facet.field] = { id, value };
    });

    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
    this.onFacetUpdate = this.onFacetUpdate.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  onFacetUpdate(e, field) {
    e.preventDefault();
    Actions.updateSpinner(true);
    const value = e.target.value;
    const checked = e.target.checked;
    const pickedFacet = _pick(this.state, field)

    let strSearch = '';

    if (!checked) {
      this.setState({
        [field]: {
          id: '',
          value: '',
        },
      });
    } else {
      const searchValue = field === 'date' ? parseInt(value, 10) : value;
      const facetObj = _findWhere(this.props.facets, { field });
      const facet = _findWhere(facetObj.values, { value: searchValue });

      this.setState({
        [field]: {
          id: facet.value,
          value: facet.label || facet.value,
        },
      });
      strSearch = getFacetParams(pickedFacet, field, value);
    }

    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSelectedFacets(pickedFacet);
      Actions.updatePage('1');
      this.routeHandler(
        null,
        `/search?q=${encodeURIComponent(this.props.keywords)}${strSearch}${sortQuery}`,
      );
      Actions.updateSpinner(false);
    });
  }

  getFacetLabel(field) {
    if (field === 'materialType') {
      return 'Material Type';
    }
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  showGetTenMore(facet, valueCount){
    if (valueCount > facetShowLimit) {
      return (<button className="nypl-link-button">Show 10 more</button>);
    }
  }

  showFacet(e, facet) {
    e.preventDefault();
    let ref = this.refs[`nypl-${facet}-facet-button`];

    if (this.state.openFacet === false) {
      this.setState({ openFacet: true })
      if (ref.parentElement && ref.nextSibling) {
        ref.parentElement.classList.remove('collapsed');
        ref.nextSibling.classList.remove('collapsed');
      }
    } else {
      this.setState({ openFacet: false });
      if (ref.parentElement && ref.nextSibling) {
        ref.parentElement.className += ' collapsed';
        ref.nextSibling.className += ' collapsed';
      }
    }
  }

  checkNoSearch(valueCount){
    return valueCount > facetShowLimit ? '' : ' nosearch'
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

  routeHandler(e, path) {
    if (e) e.preventDefault();

    if (path === '/') {
      Actions.updateSelectedFacets({});
    }

    this.context.router.push(path);
  }

  render() {
    const {
      facets,
      totalHits,
    } = this.props;
    let facetsElm = null;

    const orderedFacets = [
      _findWhere(this.props.facets, { id: 'materialType' }),
      _findWhere(this.props.facets, { id: 'subject' }),
      _findWhere(this.props.facets, { id: 'issuance' }),
      _findWhere(this.props.facets, { id: 'publisher' }),
      _findWhere(this.props.facets, { id: 'language' }),
    ];

    if (facets.length) {
      facetsElm = orderedFacets.map((facet) => {
        const field = facet.field;

        if (facet.values.length < 1) {
          return null;
        }

        const selectedValue = this.state[field] ? this.state[field].id : '';
        const totalCountFacet = _chain(facet.values)
          .pluck('count')
          .reduce((x, y) => x + y, 0)
          .value();

        return (
          <div
            key={`${field}-${facet.value}`}
            className={`nypl-searchable-field nypl-spinner-field ${this.checkNoSearch(facet.values.length)} ${this.state.spinning ? 'spinning' : ''}`}
          >
            <button
              type="button"
              className={`nypl-facet-toggle ${this.state.facetOpen ? '' : 'collapsed'}`}
              aria-controls={`nypl-searchable-field_${facet.field}`}
              aria-expanded={this.state.facetOpen}
              ref={`nypl-${field}-facet-button`}
              onClick={e => this.showFacet(e, field)}
            >
              {`${this.getFacetLabel(field)}`}
              <svg
                aria-hidden="true"
                className="nypl-icon"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 68 24"
              >
                <title>wedge down icon</title>
                <polygon points="67.938 0 34 24 0 0 10 0 34.1 16.4 58.144 0 67.938 0"></polygon>
              </svg>
            </button>
            <div
              className={`nypl-collapsible ${this.state.facetOpen ? '' : 'collapsed'}`}
              id={`nypl-searchable-field_${field}`}
              aria-expanded={this.state.facetOpen}
            >
              <div className={`nypl-facet-search nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}>
                <label htmlFor={`facet-${field}-search`}>{`${this.getFacetLabel(field)}`}</label>
                <input
                  id={`facet-${field}-search`}
                  type="text"
                  placeholder={`Search ${this.getFacetLabel(field)}`}
                />
              </div>
              <div className="nypl-facet-list">
                {
                facet.values.map((f, j) => {
                  const percentage = Math.floor(f.count / totalHits * 100);
                  const valueLabel = (f.value).toString().replace(/:/, '_');
                  let selectLabel = f.value;
                  if (f.label) {
                    selectLabel = f.label;
                  }
                  return (
                    <label
                      key={j}
                      id={`${field}-${valueLabel}`}
                      htmlFor={`${field}-${valueLabel}`}
                      className={`nypl-bar_${percentage}`}
                    >
                      <input
                        id={`${field}-${valueLabel}`}
                        aria-labelledby={`${field}-${valueLabel}`}
                        type="checkbox"
                        name="subject"
                        checked={selectedValue === f.value}
                        onClick={e => this.onFacetUpdate(e, facet.field)}
                        value={f.value}
                      />
                      <span className="nypl-facet-count">{f.count.toLocaleString()}</span>
                      {selectLabel}
                    </label>
                  );
                })
              }
              </div>
              {this.showGetTenMore(facet, facet.values.length)}
            </div>
          </div>
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
          className={`nypl-search-form ${this.state.mobileView ? 'active' : '' }`}
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
  sortBy: React.PropTypes.string,
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
