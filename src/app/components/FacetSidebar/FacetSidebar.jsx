import React from 'react';

import {
  isEmpty as _isEmpty,
} from 'underscore';

import DateRange from './DateRange.jsx';
import Actions from '../../actions/Actions.js';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
  }

  routeHandler(e) {
    e.preventDefault();
    Actions.updateSearchKeywords('');
    this.context.router.push('/');
  }

  render() {
    const {
      facets,
      dateRange,
    } = this.props;
    let facetsElm = null;

    if (facets.length) {
      facetsElm = facets.map((facet, i) => {
        const label = facet.label.replace(/ /, '').toLowerCase();

        return (
          <fieldset key={i}>
            <label htmlFor={`select-${label}`}>{facet.label}</label>
            <select name={`select-${label}`}>
              {
                facet.values.map((f, j) => (
                  <option key={j} value={f.Value}>
                    {f.Value} ({f.Count})
                  </option>
                ))
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
              onClick={this.routeHandler}
              title={`Remove keyword filter: ${this.props.keywords}`}
            >
              "{this.props.keywords}"
            </button>
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
  dateRange: React.PropTypes.object,
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
