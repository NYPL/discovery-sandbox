import React from 'react';
import PropTypes from 'prop-types';

import Actions from '../../actions/Actions.js';
import SearchButton from '../Buttons/SearchButton.jsx';
import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils.js';

/**
 * The main container for the top Search section.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      spinning: this.props.spinning,
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
    const keyword = this.state.searchKeywords.trim();
    // Track the submitted keyword search.
    trackDiscovery('Search', keyword);

    const apiQuery = this.props.createAPIQuery({
      field: this.state.field,
      searchKeywords: keyword,
      selectedFacets: {},
    });

    Actions.updateField(this.state.field);
    Actions.updateSpinner(true);
    Actions.updateSearchKeywords(keyword);
    Actions.updateSelectedFacets({});

    ajaxCall(`/api?${apiQuery}`, (response) => {
      if (response.data.searchResults && response.data.facets) {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
      } else {
        Actions.updateSearchResults({});
        Actions.updateFacets({});
      }
      Actions.updateSortBy('relevance');
      Actions.updatePage('1');

      this.context.router.push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
  }

  render() {
    return (
      <form onKeyPress={this.triggerSubmit}>
        <fieldset
          className={`nypl-omnisearch nypl-spinner-field ${this.state.spinning ? 'spinning' : ''}`}
        >
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
          <SearchButton
            id="nypl-omni-button"
            type="submit"
            value="Search"
            onClick={this.submitSearchRequest}
          />
        </fieldset>
      </form>
    );
  }
}

Search.propTypes = {
  field: PropTypes.string,
  searchKeywords: PropTypes.string,
  spinning: PropTypes.bool,
  createAPIQuery: PropTypes.func,
};

Search.defaultProps = {
  field: '',
  searchKeywords: '',
  spinning: false,
};

Search.contextTypes = {
  router: PropTypes.object,
};

export default Search;
