import React from 'react';

import {
  isEmpty as _isEmpty,
} from 'underscore';

class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
  }

  routeHandler(e) {
    e.preventDefault();
    this.context.router.push('/');
  }

  render() {
    const {
      facets,
      dateRange,
    } = this.props;
    let dateRangeElm = null;
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
      dateRangeElm = !_isEmpty(dateRange) ?
        (<fieldset>
          <label htmlFor="select-date-range">Date</label>
          <div id="select-date-range" className="date-range">
            <input
              id="input-date-start"
              name="date-start"
              type="text"
              defaultValue={dateRange.min}
              size="9"
            />
            <div className="divider">to</div>
            <input
              id="input-date-end"
              name="date-end"
              type="text"
              defaultValue={dateRange.max}
              size="9"
            />
          </div>
        </fieldset>)
        : null;
    }

    return (
      <div className="facets">
        {
          facets.length ?
          (
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

              {dateRangeElm}

            </form>
          )
          : null
        }
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
