import React from 'react';

import {
  extend as _extend,
  findWhere as _findWhere,
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

class Facet extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      spinning: false,
      openFacet: true,
      [this.props.facet.field]: { id: '', value: '' },
    }, Store.getState());

    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
    this.onFacetUpdate = this.onFacetUpdate.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);

    setTimeout(() => {
      this.setState({ openFacet: false });
    }, 500);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  onFacetUpdate(e, field) {
    Actions.updateSpinner(true);
    const value = e.target.value;
    const checked = e.target.checked;
    const pickedFacet = _pick(this.state, field);

    let strSearch = '';

    if (!checked) {
      this.setState({
        [field]: {
          id: '',
          value: '',
        },
      });
    } else {
      const facetObj = this.props.facet;
      const facet = _findWhere(facetObj.values, { value });

      const selectedFacetObj = {
        id: facet.value,
        value: facet.label || facet.value,
      };

      this.setState({ [field]: selectedFacetObj });
      pickedFacet[field] = selectedFacetObj;
      strSearch = getFacetParams(pickedFacet, field, value);
    }

    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSelectedFacets(pickedFacet);
      Actions.updatePage('1');
      this.routeHandler(
        `/search?q=${encodeURIComponent(this.props.keywords)}${strSearch}${sortQuery}`
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

  routeHandler(path) {
    if (path === '/') {
      Actions.updateSelectedFacets({});
    }

    this.context.router.push(path);
  }

  showGetTenMore(facet, valueCount) {
    if (valueCount > facetShowLimit) {
      return (<button className="nypl-link-button">Show 10 more</button>);
    }
    return null;
  }

  showFacet() {
    if (this.state.openFacet === false) {
      this.setState({ openFacet: true });
    } else {
      this.setState({ openFacet: false });
    }
  }

  checkNoSearch(valueCount) {
    return valueCount > facetShowLimit ? '' : ' nosearch';
  }

  render() {
    const facet = this.props.facet;
    const field = facet.field;
    const facetLabel = this.getFacetLabel(field);
    const noSearchClass = this.checkNoSearch(facet.values.length);
    const spinningClass = this.state.spinning ? 'spinning' : '';
    const collapsedClass = this.state.openFacet ? '' : 'collapsed';

    return (
      <div
        key={`${field}-${facet.value}`}
        className={`nypl-searchable-field nypl-spinner-field ${noSearchClass} ${spinningClass} ${collapsedClass}`}
      >
        <button
          type="button"
          className={`nypl-facet-toggle ${collapsedClass}`}
          aria-controls={`nypl-searchable-field_${field}`}
          aria-expanded={this.state.openFacet}
          onClick={() => this.showFacet()}
        >
          {facetLabel}
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
          className={`nypl-collapsible ${collapsedClass}`}
          id={`nypl-searchable-field_${field}`}
          aria-expanded={this.state.openFacet}
        >
          <div className={`nypl-facet-search nypl-spinner-field ${spinningClass}`}>
            <label htmlFor={`facet-${field}-search`}>{facetLabel}</label>
            <input
              id={`facet-${field}-search`}
              type="text"
              placeholder={`Search ${facetLabel}`}
            />
          </div>
          <div className="nypl-facet-list">
            {
              facet.values.map((f, j) => {
                const percentage = Math.floor(f.count / this.props.totalHits * 100);
                const valueLabel = (f.value).toString().replace(/:/, '_');
                let selectLabel = f.value;
                if (f.label) {
                  selectLabel = f.label;
                }
                return (
                  <label
                    key={j}
                    id={`${field}-${valueLabel}-label`}
                    htmlFor={`${field}-${valueLabel}`}
                    className={`nypl-bar_${percentage}`}
                  >
                    <input
                      id={`${field}-${valueLabel}`}
                      aria-labelledby={`${field}-${valueLabel}`}
                      type="checkbox"
                      name="subject"
                      checked={this.props.selectedValue === f.value}
                      value={f.value}
                      onClick={e => this.onFacetUpdate(e, field)}
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
  }
}

Facet.propTypes = {
  facet: React.PropTypes.object,
  keywords: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  totalHits: React.PropTypes.number,
  selectedValue: React.PropTypes.string,
};

Facet.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Facet;
