import React from 'react';
import cx from 'classnames';
import axios from 'axios';

import Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import SearchButton from '../Buttons/SearchButton.jsx';

import {
  extend as _extend,
} from 'underscore';

/**
 * The main container for the top Search section.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      placeholder: 'Keyword, title, name, or id',
      placeholderAnimation: null,
      noAnimationBefore: true,
    }, Store.getState());

    this.inputChange = this.inputChange.bind(this);
    this.submitSearchRequest = this.submitSearchRequest.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.routeHandler = this.routeHandler.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  /**
   * submitSearchRequest()
   */
  submitSearchRequest(e) {
    e.preventDefault();
    // Store the data that the user entered
    const keyword = this.state.searchKeywords.trim();
    const reset = this.props.sortBy === 'relevance';
    let sortQuery = '';

    if (this.props.sortBy && !reset) {
      const [sortBy, order] = this.props.sortBy.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

    axios
      .get(`/api?q=${keyword}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateFacets(response.data.facets);
        Actions.updateSearchKeywords(keyword);
        Actions.updatePage('1');
        this.routeHandler(`/search?q=${keyword}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  routeHandler(keyword) {
    this.context.router.push(keyword);
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

  render() {
    return (
      <form className="search-form" onKeyPress={this.triggerSubmit}>
        <label htmlFor="search-by-field" className="visuallyhidden">Search by field</label>
        <select id="search-by-field" className="search-select">
          <option value="all">All fields</option>
          <option value="title">Title</option>
          <option value="contributor">Author/Contributor</option>
          <option value="subject">Subject</option>
          <option value="series">Series</option>
          <option value="call_number">Call number</option>
        </select>
        <label htmlFor="search-query" className="visuallyhidden">Search keyword</label>
        <input
          id="search-query"
          placeholder={this.state.placeholder}
          className="search-field"
          onChange={this.inputChange}
          value={this.state.searchKeywords}
          ref="keywords"
        />
        <SearchButton
          id="search-button"
          className="search-button"
          label="Search"
          onClick={this.submitSearchRequest}
        />
      </form>
    );
  }
}

Search.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Search;
