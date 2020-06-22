import React from 'react';
import PropTypes from 'prop-types';

import Actions from '../../actions/Actions';
import SearchButton from '../Buttons/SearchButton';
import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';

/**
 * The main container for the top Search section.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      field: this.props.field,
      searchKeywords: this.props.searchKeywords,
    };

    this.inputChange = this.inputChange.bind(this);
    this.submitSearchRequest = this.submitSearchRequest.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);

    // Build ref for search-by-field (aka search_scope) selector:
    this.searchByFieldRef = null;
    this.setSearchByFieldRef = (element) => {
      this.searchByFieldRef = element;
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  /**
   * onFieldChange(e)
   * Listen to the select dropdown for field searching.
   */
  onFieldChange() {
    const newFieldVal = this.searchByFieldRef.value;
    this.setState({ field: newFieldVal });
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
    const userSearchKeywords = this.state.searchKeywords.trim();

    // Track the submitted keyword search.
    trackDiscovery('Search', userSearchKeywords);
    if (this.state.field) {
      trackDiscovery('Search', `Field - ${this.state.field}`);
    }

    const searchKeywords = userSearchKeywords === '*' ? '' : userSearchKeywords;
    const apiQuery = this.props.createAPIQuery({
      field: this.state.field,
      selectedFilters: this.props.selectedFilters,
      searchKeywords,
      page: '1',
    });
    // Need to save a copy of the present value of this.state.field because
    // it's going to be overwritten by this.props.field at least once before
    // the ajax call returns, causing this.state.field to be mismatched with
    // the actual selection, creating much confusion for the visitor..
    const searchField = String(this.state.field);

    Actions.updateLoadingStatus(true);

    return new Promise((resolve, reject) => {
      ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
        // TODO Might it be helpful to have a "SearchQuery" model that
        // stores all of the distinct properties that represent a search
        // (i.e. keyword, filters, page, sort, search_scope, etc.)
        // so that the store has only one thing to hold onto. The following
        // series of Actions calls should be atomic.
        // We'd maintain one instance of a SearchQuery in the Alt store,
        // representing the "current" query associated with the current
        // results. This Search component would own it's own instance of that
        // model in state, representing the more transient state of the form
        // (which would be promoted to the Alt store when results are received
        // below).
        if (response.data.searchResults && response.data.filters) {
          if (response.data.drbbResults) Actions.updateDrbbResults(response.data.drbbResults);
          Actions.updateSearchResults(response.data.searchResults);
          Actions.updateFilters(response.data.filters);
        } else {
          Actions.updateSearchResults({});
          Actions.updateFilters({});
          if (response.data.drbbResults) Actions.updateDrbbResults(response.data.drbbResults);
        }
        Actions.updateSearchKeywords(userSearchKeywords);
        Actions.updateField(searchField);
        Actions.updateSelectedFilters(this.props.selectedFilters);
        Actions.updateSortBy('relevance');
        Actions.updatePage('1');
        setTimeout(() => {
          Actions.updateLoadingStatus(false);
          this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
        }, 500);
        resolve();
      }, reject);
    });
  }

  render() {
    return (
      <form
        id="mainContent"
        onSubmit={this.triggerSubmit}
        onKeyPress={this.triggerSubmit}
        action={`${appConfig.baseUrl}/search`}
        method="POST"
        className="nypl-omnisearch-form"
        aria-controls="results-description"
      >
        <div className="nypl-omnisearch">
          <div className="nypl-text-field">
            <span className="nypl-omni-fields">
              <label htmlFor="search-by-field">Search in</label>
              <select
                ref={this.setSearchByFieldRef}
                id="search-by-field"
                onChange={this.onFieldChange}
                value={this.state.field}
                name="search_scope"
              >
                <option value="all">All fields</option>
                <option value="title">Title</option>
                <option value="contributor">Author/Contributor</option>
                <option value="standard_number">Standard Numbers</option>
              </select>
            </span>
          </div>
          <div className="nypl-text-field">
            <span className="nypl-omni-fields-text">
              <label htmlFor="search-query" id="search-input-label" className="visuallyhidden">
                Search Shared Collection Catalog for
              </label>
              <input
                type="text"
                id="search-query"
                aria-labelledby="search-input-label"
                aria-controls="results-description"
                placeholder="Keyword, title, or author/contributor"
                onChange={this.inputChange}
                value={this.state.searchKeywords}
                name="q"
              />
            </span>
          </div>
          <SearchButton
            className="nypl-omnisearch-button nypl-primary-button"
            onClick={this.submitSearchRequest}
          />
        </div>
      </form>
    );
  }
}

Search.propTypes = {
  field: PropTypes.string,
  searchKeywords: PropTypes.string,
  createAPIQuery: PropTypes.func,
  selectedFilters: PropTypes.object,
};

Search.defaultProps = {
  field: 'all',
  searchKeywords: '',
  selectedFilters: {},
};

Search.contextTypes = {
  router: PropTypes.object,
};

export default Search;
