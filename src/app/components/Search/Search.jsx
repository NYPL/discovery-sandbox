import React from 'react';

import Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import SearchButton from '../Buttons/SearchButton.jsx';
import {
  trackDiscovery,
  ajaxCall,
  getFieldParam,
} from '../../utils/utils.js';

import {
  extend as _extend,
  forEach as _forEach,
} from 'underscore';

/**
 * The main container for the top Search section.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      spinning: false,
      field: this.props.field,
    }, Store.getState());

    this.inputChange = this.inputChange.bind(this);
    this.submitSearchRequest = this.submitSearchRequest.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
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

  onFieldChange(e) {
    this.setState({ field: e.target.value });
  }

  routeHandler(obj) {
    this.context.router.push(obj);
  }

  /**
   * triggerSubmit(event)
   * The fuction listens to the event of enter key.
   * Submit search request if enter is pressed.
   *
   * @param {Event} event
   */
  triggerSubmit(event) {
    if (event && event.charCode === 13) {
      this.submitSearchRequest(event);
    }
  }

  /**
   * inputChange(field, event)
   * Listen to the changes on keywords input field and option input fields.
   * Grab the event value, and change the state.
   *
   * @param {Event Object} event - Passing event as the argument here
   * as FireFox doesn't accept event as a global variable.
   */
  inputChange(event) {
    this.setState({ searchKeywords: event.target.value });
  }

  /**
   * submitSearchRequest()
   */
  submitSearchRequest(e) {
    e.preventDefault();
    // Store the data that the user entered
    const keyword = this.state.searchKeywords.trim();
    const fieldQuery = getFieldParam(this.state.field);
    // Track the submitted keyword search.
    trackDiscovery('Search', keyword);

    Actions.updateField(this.state.field);
    Actions.updateSpinner(true);
    ajaxCall(`/api?q=${keyword}${fieldQuery}`, (response) => {
      Actions.updateSearchKeywords(keyword);
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      const newFacets = {};
      // Need to clear out the facets
      _forEach(response.data.facets.itemListElement, (facet) => {
        newFacets[facet.id] = { id: '', value: '' };
      });
      Actions.updateSelectedFacets(newFacets);
      Actions.updatePage('1');

      const routeObj = {
        pathname: '/search',
        query: {
          q: keyword,
        },
      };

      if (this.state.field !== 'all') {
        routeObj.query.search_scope = this.state.field;
      }

      this.routeHandler(routeObj);
      Actions.updateSpinner(false);
    });
  }

  render() {
    return (
      <form onKeyPress={this.triggerSubmit}>
        <fieldset
          className={`nypl-omnisearch nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}
        >
          <SearchButton
            id="nypl-omni-button"
            type="submit"
            value="Search"
            onClick={this.submitSearchRequest}
          />
          <span className="nypl-omni-fields">
            <label htmlFor="search-by-field">Search in</label>
            <select
              id="search-by-field"
              name="search-field-value"
              onChange={this.onFieldChange}
              value={this.state.field}
            >
              <option value="all">All fields</option>
              <option value="title">Title</option>
              <option value="contributor">Author/Contributor</option>
              <option value="subject">Subject</option>
              <option value="series">Series</option>
              <option value="call_number">Call number</option>
            </select>
          </span>
          <input
            type="text"
            id="search-query"
            aria-labelledby="nypl-omni-button"
            placeholder="Keyword, title, name, or id"
            onChange={this.inputChange}
            value={this.state.searchKeywords}
            ref="keywords"
          />
        </fieldset>
      </form>
    );
  }
}

Search.propTypes = {
  sortBy: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
  field: React.PropTypes.string,
};

Search.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Search;
