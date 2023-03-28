import { SearchBar, Link as DSLink } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
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
function Search (props) {
  const {
    field,
    searchKeywords,
    selectedFilters,
    createAPIQuery,
    updateSearchKeywords,
    updateField,
    router
  } = props;

  const [selectField, setSelectField] = useState(field);
  const [keywords, setKeywords] = useState(searchKeywords);

  useEffect(() => {
    if (searchKeywords !== keywords) setKeywords(searchKeywords)
    if (field !== selectField) setSelectField(field)
  }, [searchKeywords, field])

  /**
   * onFieldChange(e)
   * Listen to the select dropdown for field searching.
   */
  function onFieldChange(e) {
    const newFieldVal = e.target.value;
    setSelectField(newFieldVal)
  }

  /**
   * triggerSubmit(event)
   * The fuction listens to the event of enter key.
   * Submit search request if enter is pressed.
   *
   * @param {Event} event
   */
  function triggerSubmit(event) {
    if (event && event.charCode === 13) {
      submitSearchRequest(event);
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
  function inputChange(event) {
    setKeywords(event.target.value);
  }

  /**
   * submitSearchRequest()
   */
  function submitSearchRequest(e) {
    e.preventDefault();
    // Store the data that the user entered

    const userSearchKeywords = keywords.trim();

    // Track the submitted keyword search.
    trackDiscovery('Search', userSearchKeywords);
    if (selectField) {
      trackDiscovery('Search', `Field - ${selectField}`);
    }

    const searchKeywords = userSearchKeywords === '*' ? '' : userSearchKeywords;

    if (selectField === 'subject') {
      router.push(`${appConfig.baseUrl}/subject_headings?filter=${keywords.charAt(0).toUpperCase() + keywords.slice(1)}`);
      return;
    }

    const apiQuery = createAPIQuery({
      clearContributor: true,
      clearSubject: true,
      clearTitle: true,
      field: selectField,
      selectedFilters: selectedFilters,
      searchKeywords: keywords,
      page: '1',
    });

    updateSearchKeywords(keywords);
    updateField(selectField);

    router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  }
  console.log('keywords', keywords);
  console.log('searchKeywords', searchKeywords)
  return (
    <>
      <SearchBar
        buttonOnClick={submitSearchRequest}
        id="mainContent"
        onSubmit={triggerSubmit}
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
          onChange: onFieldChange,
          value: selectField
        }}
        textInputProps={{
          labelText: 'Search by keyword, title, journal title, or author/contributor',
          name: 'q',
          placeholder: 'Keyword, title, journal title, or author/contributor',
          onChange: inputChange,
          value: keywords
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
