import React from 'react';
import axios from 'axios';

import DateRange from './DateRange.jsx';
import Actions from '../../actions/Actions.js';

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
      let facetObj = _findWhere(this.props.facets, { field });
      const facet = _findWhere(facetObj.values, { value: searchValue });

      this.setState({
        [field]: {
          id: facet.value,
          value: facet.label || facet.value,
        },
      });
    }

    _mapObject(this.state, (val, key) => {
      if (val.value !== '' && field !== key) {
        strSearch += ` ${key}:"${val.id}"`;
      } else if (field === key && value !== `${field}_any`) {
        strSearch += ` ${field}:"${value}"`;
      }
    });

    const reset = this.props.sortBy === 'relevance';
    let sortQuery = '';

    if (!reset) {
      const [sortBy, order] = this.props.sortBy.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

    axios
      .get(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updateSelectedFacets(this.state);
        Actions.updatePage('1');
        this.routeHandler(null, `/search?q=${encodeURIComponent(this.props.keywords)}${strSearch}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  removeKeyword() {
    Actions.updateSearchKeywords('');

    let strSearch = '';
    _mapObject(this.props.selectedFacets, (val, key) => {
      if (val.value !== '') {
        strSearch += ` ${key}:"${val.id}"`;
      }
    });
    const reset = this.props.sortBy === 'relevance';
    let sortQuery = '';

    if (!reset) {
      const [sortBy, order] = this.props.sortBy.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

    axios
      .get(`/api?q=${this.props.keywords}${strSearch}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updatePage('1');
        this.context.router.push(`/search?q=${this.props.keywords}${strSearch}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
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
    const {
      facets,
      selectedFacets,
    } = this.props;
    let facetsElm = null;
    let dateRange = null;

    if (facets.length) {
      facetsElm = facets.map((facet, i) => {
        const field = facet.field;

        if (facet.values.length < 1 || field === 'carrierType' || field === 'mediaType') {
          return null;
        }
        // if (field === 'dates') {
        //   dateRange = facet;
        //   return null;
        // }

        const selectedValue = this.state[field] ? this.state[field].id : '';

        return (
          <fieldset key={i}>
            <legend className="facet-legend visuallyHidden">Filter by {facet.field}</legend>
            <label htmlFor={`select-${field}`}>{facet.field}</label>
            <select
              name={`select-${field}`}
              id={`select-${field}`}
              onChange={(e) => this.onChange(e, field)}
              value={selectedValue ? selectedValue : `${field}_any`}
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
            <fieldset>
              <legend className="facet-legend">Remove {this.props.keyword} keyword</legend>
              <label htmlFor="select-keywords">Keywords</label>
              <button
                id="select-keywords"
                name="select-keywords"
                className="button-selected"
                title={`Remove keyword filter: ${this.props.keywords}`}
                onClick={(e) => this.removeKeyword()}
                type="submit"
              >
                "{this.props.keywords}"
              </button>
            </fieldset>
            : null
          }

          {facetsElm}

          <button className="visuallyHidden" type="submit">Search</button>
          
        </form>
      </div>
    );
  }
}

FacetSidebar.propTypes = {
  facets: React.PropTypes.array,
  keywords: React.PropTypes.string,
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
