import React from 'react';

import {
  isEmpty as _isEmpty,
  extend as _extend,
  keys as _keys,
} from 'underscore';

/**
 * The main container for the top Search section of the New Arrivals app.
 */
class FacetSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ebscodata = this.props.ebscodata;
    let dateRange = null;
    let facets = null;

    if (!_isEmpty(ebscodata)) {
      dateRange = ebscodata.SearchResult.AvailableCriteria ?
        _keys(ebscodata.SearchResult.AvailableCriteria).map((d, i) => {
          const criteriaObj = ebscodata.SearchResult.AvailableCriteria[d];

          return (
            <fieldset key={i}>
              <label htmlFor="select-date-range">Date</label>
              <div id="select-date-range" classN="date-range">
                <input id="input-date-start" name="date-start"
                  type="text" value={criteriaObj.MinDate} size="9" />
                <div classN="divider">to</div>
                <input id="input-date-end" name="date-end"
                  type="text" value={criteriaObj.MaxDate} size="9" />
              </div>
            </fieldset>
          );
        })
        : null;
      facets = ebscodata.SearchResult.AvailableFacets ?
        ebscodata.SearchResult.AvailableFacets.map((facet, i) => {
          const label = facet.Label.replace(/ /, '').toLowerCase();

          return (
            <fieldset key={i}>
              <label htmlFor={`select-${label}`}>{facet.Label}</label>
              <select name={`select-${label}`}>
                {
                  facet.AvailableFacetValues.map((f, j) => {
                    return (
                      <option key={j} value={f.Value}>
                        {f.Value} ({f.Count})
                      </option>
                    );
                  })
                }
              </select>
            </fieldset>
          );
        })
        : null;
    }

    return (
      <div className="facets">
        {
          facets ?
          (
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
              
              {facets}

              {dateRange}

            </form>
          )
          : null
        }
      </div>
    );
  }
}

FacetSidebar.propTypes = {
  ebscodata: React.PropTypes.object,
};

export default FacetSidebar;
