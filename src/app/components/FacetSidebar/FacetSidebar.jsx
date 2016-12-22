import React from 'react';

import Actions from '../../actions/Actions.js';
import {
  ajaxCall,
  getSortQuery,
  getFacetParams,
} from '../../utils/utils.js';

import {
  mapObject as _mapObject,
  findWhere as _findWhere,
} from 'underscore';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.props.facets.map(facet => {
      let id = '';
      let value = '';

      if (this.props.selectedFacets && this.props.selectedFacets[facet.field]) {
        id = this.props.selectedFacets[facet.field].id;
        value = this.props.selectedFacets[facet.field].value;
      }

      this.state[facet.field] = { id, value };
    });

    this.routeHandler = this.routeHandler.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field) {
    const value = e.target.value;
    let strSearch = '';

    if (value === `${field}_any`) {
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
    }

    strSearch = getFacetParams(this.state, field, value);

    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSelectedFacets(this.state);
      Actions.updatePage('1');
      this.routeHandler(
        null,
        `/search?q=${encodeURIComponent(this.props.keywords)}${strSearch}${sortQuery}`
      );
    });
  }

  removeKeyword() {
    Actions.updateSearchKeywords('');

    const strSearch = getFacetParams(this.props.selectedFacets);
    const sortQuery = getSortQuery(this.props.sortBy);

    ajaxCall(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search?q=${this.props.keywords}${strSearch}${sortQuery}`);
    });
  }

  routeHandler(e, path) {
    if (e) e.preventDefault();

    if (path === '/') {
      Actions.updateSelectedFacets({});
    }

    this.context.router.push(path);
  }

  render() {
    const { facets } = this.props;
    let facetsElm = null;

    if (facets.length) {
      facetsElm = facets.map((facet, i) => {
        const field = facet.field;

        if (facet.values.length < 1 || field === 'carrierType' || field === 'mediaType') {
          return null;
        }

        const selectedValue = this.state[field] ? this.state[field].id : '';

        return (
          <fieldset key={i} tabIndex="0" className="select-fieldset">
            <legend className="facet-legend visuallyHidden">Filter by {facet.field}</legend>
            <label htmlFor={`select-${field}`}>{facet.field}</label>
            <select
              name={`select-${field}`}
              id={`select-${field}`}
              onChange={(e) => this.onChange(e, field)}
              value={selectedValue || `${field}_any`}
              aria-controls="results-region"
            >
              <option value={`${field}_any`}>Any</option>
              {
                facet.values.map((f, j) => {
                  let selectLabel = f.value;
                  if (f.label) {
                    selectLabel = f.label;
                  }

                  return (
                    <option key={j} value={f.value}>
                      {selectLabel} ({f.count})
                    </option>
                  );
                })
              }
            </select>
          </fieldset>
        );
      });
    }

    return (
      <div className="facets">
        <form className="facets-form">
          <h2>Filter results by</h2>
          {
            this.props.keywords ?
              <fieldset tabIndex="0" className="fieldset">
                <legend className="facet-legend visuallyHidden">
                  Current Keyword {this.props.keywords}
                </legend>
                <label htmlFor="select-keywords">Keywords</label>
                <button
                  id="select-keywords"
                  name="select-keywords"
                  className="button-selected"
                  title={`Remove keyword filter: ${this.props.keywords}`}
                  onClick={() => this.removeKeyword()}
                  aria-controls="results-region"
                  type="submit"
                >
                  {`"${this.props.keywords}"`}
                </button>
              </fieldset>
              : null
          }

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
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
