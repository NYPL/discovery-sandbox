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
    let criteria = null;
    let facets = null;

    if (!_isEmpty(ebscodata)) {
      criteria = ebscodata.SearchResult.AvailableCriteria ?
        _keys(ebscodata.SearchResult.AvailableCriteria).map((d, i) => {
          const criteriaObj = ebscodata.SearchResult.AvailableCriteria[d];
          return (
            <li key={i}>
              {d}
              <ul>
                {
                  _keys(criteriaObj).map((k, j) => {
                    return (
                      <li key={j}>{k}: {criteriaObj[k]}</li>
                    );
                  })
                }
              </ul>
            </li>
          );
        })
        : null;
      facets = ebscodata.SearchResult.AvailableFacets ?
        ebscodata.SearchResult.AvailableFacets.map((facet, i) => {
          return (
            <li key={i}>
              {facet.Label}
              <select name={facet.Label}>
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
            </li>
          );
        })
        : null;
    }

    return (
      <div className="facets">
        {
          criteria || facets ?
          (
            <form>
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
              <ul>
                {facets}
              </ul>
              <ul>
                {criteria}
              </ul>
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
