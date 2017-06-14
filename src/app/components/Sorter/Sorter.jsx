import React from 'react';
import PropTypes from 'prop-types';
import ClickOutHandler from 'react-onclickout';
import { findWhere as _findWhere } from 'underscore';

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
    const defaultLabel = this.props.sortBy ?
      _findWhere(sortingOpts, { val: this.props.sortBy }).label : 'relevance';
    this.state = {
      sortValue: this.props.sortBy,
      sortLabel: defaultLabel,
      active: false,
    };
  }

  getResultsSort() {
    return sortingOpts.map((d, i) => (
      <li role="region" key={i}>
        <a href="#" onClick={e => this.sortResultsBy(e, d.val, d.label)}>{d.label}</a>
      </li>
    ));
  }

  getResultsWindow() {
    if (this.state.active === false) {
      this.setState({ active: true, className: 'active' });
    } else {
      this.setState({ active: false, className: '' });
    }
  }

  sortResultsBy(e, sortBy, sortLabel) {
    e.preventDefault();
    this.setState({ sortLabel });

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

  handleOnClickOut() {
    if (this.state.active) {
      this.setState({ active: false });
    }
  }

  render() {
    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <ClickOutHandler onClickOut={() => this.handleOnClickOut()}>
            <button
              aria-expanded={this.state.active}
              className={this.state.active ? 'active' : ''}
              onClick={e => this.getResultsWindow(e)}
            >
              <span>Sort by <strong>{this.state.sortLabel}</strong></span>
              <svg
                aria-hidden="true"
                className="nypl-icon"
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 68 24"
              >
                <title>wedge down icon</title>
                <polygon points="67.938 0 34 24 0 0 10 0 34.1 16.4 58.144 0 67.938 0" />
              </svg>
            </button>
            <ul className={this.state.active ? '' : 'hidden'}>
              {
                this.getResultsSort()
              }
            </ul>
          </ClickOutHandler>
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
