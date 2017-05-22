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
        dateAfter: updatedFacets.dateAfter.id,
        dateBefore: updatedFacets.dateBefore.id,
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

  render() {
    const spinningClass = this.state.spinning ? 'spinning' : '';

    return (
      <div className={`nypl-facet-search nypl-spinner-field ${spinningClass}`}>
        <div className="nypl-text-field">
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
        <div className="nypl-text-field">
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
