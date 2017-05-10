import React from 'react';

import {
  findWhere as _findWhere,
  chain as _chain,
  pick as _pick,
} from 'underscore';

import Actions from '../../actions/Actions';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils';

const facetShowLimit = 9;

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinning: false,
    };

    this.props.facets.map((facet) => {
      let id = '';
      let value = '';

      if (this.props.selectedFacets && this.props.selectedFacets[facet.field]) {
        id = this.props.selectedFacets[facet.field].id;
        value = this.props.selectedFacets[facet.field].value;
      }

      this.state[facet.field] = { id, value };
    });

    this.routeHandler = this.routeHandler.bind(this);
    this.onFacetUpdate = this.onFacetUpdate.bind(this);
  }

  onFacetUpdate(e, field) {
    this.setState({ spinning: true });
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
      this.setState({ spinning: false });
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

  showFacet(facet) {
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

    if (facets.length) {
      facetsElm = facets.map((facet) => {
        const field = facet.field;

        if (facet.values.length < 1 || field === 'carrierType' || field === 'mediaType') {
          return null;
        }

        const selectedValue = this.state[field] ? this.state[field].id : '';
        const totalCountFacet = _chain(facet.values)
          .pluck('count')
          .reduce((x, y) => x + y, 0)
          .value();

        if (facet.field === 'date') {
          return (
            <div className={`nypl-facet-search nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}>
              <div className="nypl-text-field">
                <label
                  key="date-from"
                  htmlFor="date-from"
                >On or After Year</label>
                <input
                  id={`facet-${facet.field}-from-search`}
                  type="text"
                  className="form-text"
                  placeholder=""
                />
              </div>
              <div className="nypl-text-field">
                <label
                  key="date-to"
                  htmlFor="date-to"
                >On or Before Year</label>
                <input
                  id={`facet-${facet.field}-to-search`}
                  type="text"
                  className="form-text"
                  placeholder=""
                />
              </div>
            </div>
          );
        }
        return (
          <div
            key={`${facet.field}-${facet.value}`}
            className={`nypl-searchable-field nypl-spinner-field ${this.checkNoSearch(facet.values.length)} ${this.state.spinning ? 'spinning' : ''}`}
          >
            <button
              type="button"
              className={`nypl-facet-toggle ${this.state.facetOpen ? '' : 'collapsed'}`}
              aria-controls={`nypl-searchable-field_${facet.field}`}
              aria-expanded={this.state.facetOpen}
              ref={`nypl-${facet.field}-facet-button`}
              onClick={() => this.showFacet(facet.field)}
            >
              {`${this.getFacetLabel(facet.field)}`}
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
              id={`nypl-searchable-field_${facet.field}`}
              aria-expanded={this.state.facetOpen}
            >
              <div className={`nypl-facet-search nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}>
                <label htmlFor={`facet-${facet.field}-search`}>{`${this.getFacetLabel(facet.field)}`}</label>
                <input
                  id={`facet-${facet.field}-search`}
                  type="text"
                  placeholder={`Search ${this.getFacetLabel(facet.field)}`}
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
                      id={`${facet.field}-${valueLabel}`}
                      htmlFor={`${facet.field}-${valueLabel}`}
                      className={`nypl-bar_${percentage}`}
                    >
                      <input
                        id={`${facet.field}-${valueLabel}`}
                        aria-labelledby={`${facet.field} ${valueLabel}`}
                        type="checkbox"
                        name="subject"
                        checked={selectedValue === f.value}
                        value={f.value}
                        onClick={e => this.onFacetUpdate(e, facet.field)}
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
        <form className="nypl-search-form">
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
