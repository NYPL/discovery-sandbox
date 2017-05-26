import React from 'react';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';
import { extend as _extend } from 'underscore';

const DATEDEFAULT = { id: '', value: '' };

class DateFacet extends React.Component {
  constructor(props) {
    super(props);

    // Storing the values for the date input fields in local state so that the input
    // element can override it.
    this.state = {
      spinning: false,
      openFacet: true,
      dateAfter: this.props.selectedFacets.dateAfter || DATEDEFAULT,
      dateBefore: this.props.selectedFacets.dateBefore || DATEDEFAULT,
    };

    this.routeHandler = this.routeHandler.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
  }

  /*
   * componentWillReceiveProps
   * Override the state from the props based on any ajax call.
   */
  componentWillReceiveProps(nextProps) {
    this.setState({
      dateAfter: nextProps.selectedFacets.dateAfter || DATEDEFAULT,
      dateBefore: nextProps.selectedFacets.dateBefore || DATEDEFAULT,
    });
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ openFacet: false });
    }, 500);
  }

  routeHandler(path) {
    this.context.router.push(path);
  }

  /*
   * inputChange
   * The value from the input field needs to be restricted to 4 numerical characters.
   * The state is also updated based on the value that was input and how we want it to display
   * to users, the `value` property.
   */
  inputChange(e) {
    const value = (e.target.value).replace(/[a-zA-Z]/g, '');
    // The name can be either `dateBefore` or `dateAfter`. We need just `before` or `after`
    // in the user display value.
    const displayValue = e.target.name.substring(4).toLowerCase();

    this.setState({
      [e.target.name]: {
        id: value > 4 ? value.slice(0, 4) : value,
        value: `${displayValue} ${value}`,
      },
    });
  }

  /*
   * triggerSubmit
   * First we need to merge the current state values from the input field with the app's
   * selected facets. Then generate the api query and call it.
   */
  triggerSubmit(event) {
    if (event && event.charCode === 13) {
      Actions.updateSpinner(true);
      const updatedFacets = _extend({}, this.props.selectedFacets);

      if (this.state.dateAfter) {
        updatedFacets.dateAfter = this.state.dateAfter;
      }
      if (this.state.dateBefore) {
        updatedFacets.dateBefore = this.state.dateBefore;
      }

      const query = this.props.createAPIQuery({ selectedFacets: updatedFacets });

      Actions.updateSelectedFacets(updatedFacets);
      ajaxCall(`/api?${query}`,
        (response) => {
          Actions.updateSearchResults(response.data.searchResults);
          Actions.updateFacets(response.data.facets);
          Actions.updatePage('1');
          this.routeHandler(`/search?${query}`);
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
          aria-controls="nypl-searchable-field_date"
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
              value={this.state.dateAfter.id}
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
              value={this.state.dateBefore.id}
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
  createAPIQuery: React.PropTypes.func,
};

DateFacet.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default DateFacet;
