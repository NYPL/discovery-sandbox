import React from 'react';

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
  dateRange: React.PropTypes.object,
};

FacetSidebar.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default FacetSidebar;
