import React from 'react';
import PropTypes from 'prop-types';
import ClickOutHandler from 'react-onclickout';
import { findWhere as _findWhere } from 'underscore';
import { DownWedgeIcon } from 'dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

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
    };

    this.updateSortState = this.updateSortState.bind(this);
  }

  renderResultsSort() {
    return sortingOpts.map((d, i) => (
      <option value={d.val} key={i}>
        {d.label}
      </option>
    ));
  }

  getResultsWindow() {
    if (this.state.active === false) {
      this.setState({ active: true, className: 'active' });
    } else {
      this.setState({ active: false, className: '' });
    }
  }

  updateSortState(e) {
    e.preventDefault();
    const value = e.target.value;

    this.setState(
      { sortValue: value, sortLabel: e.target.value },
      () => { this.sortResultsBy(value) }
    );
  }

  sortResultsBy(sortBy) {
    const apiQuery = this.props.createAPIQuery({ sortBy, page: this.props.page });

    Actions.updateSpinner(true);
    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSortBy(sortBy);
      this.setState({ sortBy });
      this.context.router
        .push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
    this.setState({ active: false });
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
      this.sortResultsBy(event, );
    }
  }

  render() {
    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <form
            onKeyPress={this.updateSortState}
            action="search"
            method="POST"
          >
            <span className="nypl-omni-fields">
              <label htmlFor="search-by-field">Sort by</label>
              <strong>
                <select
                  id="sort-by-label"
                  onChange={this.updateSortState}
                  value={this.state.sortLabel}
                  name="sort_scope"
                >
                  {this.renderResultsSort()}
                </select>
              </strong>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

Sorter.propTypes = {
  sortBy: PropTypes.string,
  page: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

Sorter.contextTypes = {
  router: PropTypes.object,
};

export default Sorter;
