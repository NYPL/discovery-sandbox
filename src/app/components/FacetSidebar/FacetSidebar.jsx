import React from 'react';
import axios from 'axios';

import DateRange from './DateRange.jsx';
import Actions from '../../actions/Actions.js';

import { mapObject as _mapObject } from 'underscore';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.props.facets.map(facet => {
      this.state[facet.field] = {
        id: '',
        value: '',
      };
    });

    this.routeHandler = this.routeHandler.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field, location) {
    const filter = e.target.value.split('_');
    this.setState({
      [field]: {
        id: filter[0],
        value: filter[1],
      },
    });

    let strSearch = '';
    _mapObject(this.state, (val, key) => {
      if (val.value !== '' && field !== key) {
        strSearch += ` ${key}:"${val.value}"`;
      } else if (field === key) {
        strSearch += `${field}:"${filter[0]}"`;
      }
    })

    axios
      .get(`/api?q=${this.props.keywords} ${strSearch}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updateSelectedFacets(this.state);
        this.routeHandler(`/search?q=${this.props.keywords} ${strSearch}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  routeHandler(path) {
    // e.preventDefault();
    // Actions.updateSearchKeywords('');
    this.context.router.push(path);
  }

  render() {
    const facets = this.props.facets;
    const location = this.props.location;
    let facetsElm = null;
    let dateRange = null;

    if (facets.length) {
      facetsElm = facets.map((facet, i) => {
        const field = facet.field;

        if (field === 'dates') {
          dateRange = facet;
          return null;
        }

        return (
          <fieldset key={i}>
            <label htmlFor={`select-${field}`}>{facet.field}</label>
            <select name={`select-${field}`} onChange={(e) => this.onChange(e, field, location)}>
              {
                facet.values.map((f, j) => {
                  let selectLabel = f.value;
                  if (f.label) {
                    selectLabel = f.label;
                  }

                  return (
                    <option key={j} value={`${f.value}_${selectLabel}`}>
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
          <fieldset>
            <label htmlFor="select-keywords">Keywords</label>
            <button
              id="select-keywords"
              className="button-selected"
              title={`Remove keyword filter: ${this.props.keywords}`}
            >
              "{this.props.keywords}"
            </button>
          </fieldset>

          <fieldset>
            <label htmlFor="select-access">Access method</label>
            <div className="radio-group">
              <label htmlFor="select-access-1" className="radio-label">
                <input id="select-access-1" type="radio" value="All" name="access" defaulChecked /> All
              </label>
              <label htmlFor="select-access-2" className="radio-label">
                <input id="select-access-2" type="radio" value="At the library" name="access" /> At the library (11)
              </label>
              <label htmlFor="select-access-3" className="radio-label">
                <input id="select-access-3" type="radio" value="Online" name="access" /> Online (3)
              </label>
            </div>
          </fieldset>
          <fieldset>
            <label htmlFor="select-resource">Format</label>
            <div className="radio-group">
              <label htmlFor="select-resource-1" className="radio-label">
                <input id="select-resource-1" type="radio" value="All" name="resource" defaulChecked /> All
              </label>
              <label htmlFor="select-resource-2" className="radio-label">
                <input id="select-resource-2" type="radio" value="Book/text" name="resource" /> Book/text (11)
              </label>
              <label htmlFor="select-resource-3" className="radio-label">
                <input id="select-resource-3" type="radio" value="Web resource" name="resource" /> Web resource (3)
              </label>
              <label htmlFor="select-resource-4" className="radio-label">
                <input id="select-resource-4" type="radio" value="Microform" name="resource" /> Microform (1)
              </label>
            </div>
          </fieldset>

          {facetsElm}

          <DateRange dateRange={dateRange} />
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
