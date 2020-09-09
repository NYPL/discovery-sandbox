import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SearchButton from '../Buttons/SearchButton';
import {
  trackDiscovery,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';
import { updateField } from '../../actions/Actions';

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
    this.setState({ field: newFieldVal }, () => this.props.updateField(newFieldVal));
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

    // Set var for field querying so it can be overridden if necessary
    let queryField = this.state.field;

    // If user is making a search for periodicals switch from field to standard
    // Title search with an issuance filter on the serial field
    const additionalFilters = {};
    if (this.state.field === 'journal title') {
      additionalFilters.issuance = ['urn:biblevel:s'];
      queryField = 'title';
    }

    const searchKeywords = userSearchKeywords === '*' ? '' : userSearchKeywords;
    const apiQuery = this.props.createAPIQuery({
      field: queryField,
      selectedFilters: { ...this.props.selectedFilters, ...additionalFilters },
      searchKeywords,
      page: '1',
    });

    this.props.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
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
                <option value="journal title">Journal Title</option>
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
                placeholder="Keyword, title, journal title, or author/contributor"
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
  updateField: PropTypes.func,
  router: PropTypes.object,
};

Search.defaultProps = {
  field: 'all',
  searchKeywords: '',
  selectedFilters: {},
};

const mapStateToProps = ({
  searchKeywords,
  field,
  selectedFilters,
}) => ({ searchKeywords, field, selectedFilters });


const mapDispatchToProps = dispatch => ({ updateField: field => dispatch(updateField(field)) });

export default connect(mapStateToProps, mapDispatchToProps)(Search);
