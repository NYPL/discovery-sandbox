import React from 'react';
import PropTypes from 'prop-types';
import { findWhere as _findWhere } from 'underscore';
import { DownWedgeIcon } from 'dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';
import appConfig from '../../../../appConfig.js';

const sortingOpts = [
  { val: 'relevance', label: 'relevance' },
  { val: 'title_asc', label: 'title (a - z)' },
  { val: 'title_desc', label: 'title (z - a)' },
  { val: 'date_asc', label: 'date (old to new)' },
  { val: 'date_desc', label: 'date (new to old)' },
];

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    const defaultLabelObject = _findWhere(sortingOpts, { val: this.props.sortBy });
    const defaultLabel = defaultLabelObject ? defaultLabelObject.label : undefined;

    this.state = {
      sortValue: this.props.sortBy || 'relevance',
      sortLabel: defaultLabel || 'relevance',
      active: false,
      className: '',
      js: false,
    };

    this.updateSortValue = this.updateSortValue.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  /**
   * updateSortValue(e)
   * The fuction listens to the event of changing the input of sort options.
   * It then sets the state with the callback function of making a new search.
   *
   * @param {Event} e
   */
  updateSortValue(e) {
    e.preventDefault();
    const value = e.target.value;

    this.setState(
      { sortValue: value, sortLabel: e.target.value },
      () => { this.sortResultsBy(value); }
    );
  }

  /**
   * sortResultsBy(sortBy)
   * The fuction that makes a new search based on the passed sort option.
   *
   * @param {String} sortBy
   */
  sortResultsBy(sortBy) {
    const apiQuery = this.props.createAPIQuery({ sortBy, page: this.props.page });

    Actions.updateSpinner(true);
    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSortBy(sortBy);
      this.setState({ sortBy });
      this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
    this.setState({ active: false });
  }

  /**
   * renderResultsSort()
   * The fuction that makes renders the sort options.
   *
   * @return {HTML Element}
   */
  renderResultsSort() {
    return sortingOpts.map((d, i) => (
      <option value={d.val} key={i} selected={d.val === this.state.sortValue}>
        {d.label}
      </option>
    ));
  }

  render() {
    const searchKeywords = this.props.searchKeywords;
    const field = this.props.field;

    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <form
            action={
              `/search${searchKeywords ?
                `?q=${searchKeywords}` : ''}${field ? `&search_scope=${field}` : ''}`
            }
            method="POST"
          >
            <span className="nypl-omni-fields">
              <label htmlFor="sort-by-label">Sort by</label>
              <strong>
                <select
                  id="sort-by-label"
                  onChange={this.updateSortValue}
                  value={this.state.sortValue}
                  name="sort_scope"
                >
                  {this.renderResultsSort()}
                </select>
              </strong>
            </span>
            {
              !this.state.js &&
                <input
                  type="submit"
                >
                </input>
            }
          </form>
        </div>
      </div>
    );
  }
}

Sorter.propTypes = {
  sortBy: PropTypes.string,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
  page: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

Sorter.defaultProps = {
  searchKeywords: '',
  field: '',
};

Sorter.contextTypes = {
  router: PropTypes.object,
};

export default Sorter;
