import { Link as DSLink, SearchBar } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import {
  trackDiscovery,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';
import {
  updateSearchKeywords,
  updateField,
} from '../../actions/Actions';

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

    // Build ref for the select element (aka search_scope) selector:
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
  onFieldChange(e) {
    const newFieldVal = e.target.value;
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
    const {
      field,
    } = this.state;

    const userSearchKeywords = this.state.searchKeywords.trim();

    // Track the submitted keyword search.
    trackDiscovery('Search', userSearchKeywords);
    if (this.state.field) {
      trackDiscovery('Search', `Field - ${this.state.field}`);
    }

    const searchKeywords = userSearchKeywords === '*' ? '' : userSearchKeywords;

    if (field === 'subject') {
      this.props.router.push(`${appConfig.baseUrl}/subject_headings?filter=${searchKeywords.charAt(0).toUpperCase() + searchKeywords.slice(1)}`);
      return;
    }

    const apiQuery = this.props.createAPIQuery({
      clearContributor: true,
      clearSubject: true,
      clearTitle: true,
      field,
      selectedFilters: this.props.selectedFilters,
      searchKeywords,
      page: '1',
    });

    this.props.updateSearchKeywords(searchKeywords);
    this.props.updateField(field);

    this.props.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  }

  render() {
    return (
      <>
        <SearchBar
          buttonOnClick={this.submitSearchRequest}
          id="mainContent"
          onSubmit={this.triggerSubmit}
          className="content-primary"
          method='POST'
          action={`${appConfig.baseUrl}/search`}
          labelText="SearchBar Label"
          selectProps={{
            labelText: 'Select a category',
            name: 'search_scope',
            optionsData: [
              { text:"All fields", value: "all" },
              { text:"Title", value: "title" },
              { text:"Journal Title", value: "journal_title" },
              { text:"Author/Contributor", value: "contributor" },
              { text:"Standard Numbers", value: "standard_number" },
              { text:"Subject", value: "subject" },
            ],
            onChange: this.onFieldChange,
            value: this.state.field
          }}
          textInputProps={{
            labelText: 'Search by keyword, title, journal title, or author/contributor',
            name: 'q',
            placeholder: 'Keyword, title, journal title, or author/contributor',
            onChange: this.inputChange,
            value: this.state.searchKeywords
          }}
        />
        <div id="advanced-search-link-container">
          <DSLink>
            <Link to={`${appConfig.baseUrl}/search/advanced`}>Advanced Search</Link>
          </DSLink>
        </div>
      </>
    );
  }
}

Search.propTypes = {
  field: PropTypes.string,
  searchKeywords: PropTypes.string,
  createAPIQuery: PropTypes.func,
  selectedFilters: PropTypes.object,
  router: PropTypes.object,
  updateSearchKeywords: PropTypes.func,
  updateField: PropTypes.func,
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

const mapDispatchToProps = dispatch => ({
  updateSearchKeywords: searchKeywords => dispatch(updateSearchKeywords(searchKeywords)),
  updateField: field => dispatch(updateField(field)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
