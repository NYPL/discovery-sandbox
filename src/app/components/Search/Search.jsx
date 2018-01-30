import React from 'react';
import PropTypes from 'prop-types';

import Actions from '../../actions/Actions';
import SearchButton from '../Buttons/SearchButton';
import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils';
import appConfig from '../../../../appConfig';

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
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  /**
   * onFieldChange(e)
   * Listen to the select dropdown for field searching.
   */
  onFieldChange(e) {
    this.setState({ field: e.target.value });
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
    trackDiscovery('Search', `Field - ${this.state.field}`);

    const searchKeywords = userSearchKeywords === '*' ? '' : userSearchKeywords;
    const apiQuery = this.props.createAPIQuery({
      field: this.state.field,
      selectedFilters: {},
      searchKeywords,
      page: '1',
    });

    Actions.updateField(this.state.field);
    this.props.updateIsLoadingState(true);
    Actions.updateSearchKeywords(userSearchKeywords);
    Actions.updateSelectedFilters({});

    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      if (response.data.searchResults && response.data.filters) {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFilters(response.data.filters);
      } else {
        Actions.updateSearchResults({});
        Actions.updateFilters({});
      }
      Actions.updateSortBy('relevance');
      Actions.updatePage('1');

      setTimeout(
        () => { this.props.updateIsLoadingState(false); },
        500
      );

      this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
    });
  }

  render() {
    return (
      <form
        onSubmit={this.triggerSubmit}
        onKeyPress={this.triggerSubmit}
        action={`${appConfig.baseUrl}/search`}
        method="POST"
        className="nypl-omnisearch-form"
      >
        <div className="nypl-omnisearch">
          <div className="nypl-text-field">
            <span className="nypl-omni-fields">
              <label htmlFor="search-by-field">Search in</label>
              <select
                id="search-by-field"
                onChange={this.onFieldChange}
                value={this.state.field}
                name="search_scope"
              >
                <option value="all">All fields</option>
                <option value="title">Title</option>
                <option value="contributor">Author/Contributor</option>
              </select>
            </span>
          </div>
          <div className="nypl-text-field">
            <span className="nypl-omni-fields-text">
              <label htmlFor="search-query" id="search-input-label" className="visuallyhidden">
                Search for
              </label>
              <input
                type="text"
                id="search-query"
                aria-labelledby="search-input-label"
                placeholder="Keyword, title, or author/contributor"
                onChange={this.inputChange}
                value={this.state.searchKeywords}
                name="q"
              />
            </span>
          </div>
          <SearchButton className={"nypl-omnisearch-button nypl-primary-button"} onClick={this.submitSearchRequest} />
        </div>
      </form>
    );
  }
}

Search.propTypes = {
  field: PropTypes.string,
  searchKeywords: PropTypes.string,
  createAPIQuery: PropTypes.func,
  updateIsLoadingState: PropTypes.func,
};

Search.defaultProps = {
  field: 'all',
  searchKeywords: '',
  updateIsLoadingState: () => {},
};

Search.contextTypes = {
  router: PropTypes.object,
};

export default Search;
