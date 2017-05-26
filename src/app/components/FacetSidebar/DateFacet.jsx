import React from 'react';

import {
  extend as _extend,
} from 'underscore';

import Actions from '../../actions/Actions';
import Store from '../../stores/Store';
import {
  ajaxCall,
  getFacetFilterParam,
  getFieldParam,
} from '../../utils/utils';

class DateFacet extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      spinning: false,
      dateAfter: '',
      dateBefore: '',
    }, Store.getState());

    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  routeHandler(path) {
    this.context.router.push(path);
  }

  inputChange(e) {
    const value = (e.target.value).replace(/[a-zA-Z]/g, '');

    this.setState({
      [e.target.name]: value > 4 ? value.slice(0, 4) : value,
    });
  }

  triggerSubmit(event) {
    if (event && event.charCode === 13) {
      Actions.updateSpinner(true);
      const updatedFacets = _extend({}, this.props.selectedFacets);

      if (this.state.dateAfter) {
        updatedFacets.dateAfter = {
          id: this.state.dateAfter,
          value: `after ${this.state.dateAfter}`,
        };
      }
      if (this.state.dateBefore) {
        updatedFacets.dateBefore = {
          id: this.state.dateBefore,
          value: `before ${this.state.dateBefore}`,
        };
      }

      this.setState({
        dateAfter: updatedFacets.dateAfter ? updatedFacets.dateAfter.id : '',
        dateBefore: updatedFacets.dateBefore ? updatedFacets.dateBefore.id : '',
      });

      const facetQuery = getFacetFilterParam(updatedFacets);
      const fieldQuery = getFieldParam(this.state.field);

      ajaxCall(`/api?q=${this.props.keywords}${facetQuery}${fieldQuery}`,
        (response) => {
          Actions.updateSearchResults(response.data.searchResults);
          Actions.updateSelectedFacets(updatedFacets);
          Actions.updateFacets(response.data.facets);
          Actions.updatePage('1');
          this.routeHandler(
            `/search?q=${encodeURIComponent(this.props.keywords)}${facetQuery}${fieldQuery}`
          );
          Actions.updateSpinner(false);
        });
    }
  }

  showFacet() {
    if (this.state.openFacet === false) {
      this.setState({ openFacet: true });
    } else {
      this.setState({ openFacet: false });
    }
  }

  render() {
    const spinningClass = this.state.spinning ? 'spinning' : '';
    const collapsedClass = this.state.openFacet ? '' : 'collapsed';
    return (
      <div className={`nypl-collapsible-field nypl-spinner-field ${collapsedClass} ${spinningClass}`}>
        <button
          type="button"
          className={`nypl-facet-toggle ${collapsedClass}`}
          aria-controls={`nypl-searchable-field_date`}
          aria-expanded={this.state.openFacet}
          onClick={() => this.showFacet()}
        >
          Date
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
          id={`nypl-searchable-field_date`}
          aria-expanded={this.state.openFacet}
        >
          <div className="nypl-year-field">
            <label key="date-from" htmlFor="facet-date-from-search">On or After Year</label>
            <input
              id="facet-date-from-search"
              type="text"
              className="form-text"
              placeholder=""
              name="dateAfter"
              onChange={this.inputChange}
              value={this.state.dateAfter}
              onKeyPress={this.triggerSubmit}
              maxLength="4"
            />
          </div>
          <div className="nypl-year-field">
            <label key="date-to" htmlFor="facet-date-to-search">On or Before Year</label>
            <input
              id="facet-date-to-search"
              type="text"
              className="form-text"
              placeholder=""
              name="dateBefore"
              onChange={this.inputChange}
              value={this.state.dateBefore}
              onKeyPress={this.triggerSubmit}
              maxLength="4"
            />
          </div>
        </div>
      </div>
    );
  }
}

DateFacet.propTypes = {
  keywords: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
};

DateFacet.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default DateFacet;
