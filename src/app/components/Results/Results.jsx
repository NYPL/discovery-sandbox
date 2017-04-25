import React from 'react';

import Actions from '../../actions/Actions';
import ResultList from './ResultsList';
import {
  ajaxCall,
  getSortQuery,
} from '../../utils/utils';
import Pagination from '../Pagination/Pagination';

import { findWhere as _findWhere } from 'underscore';

const sortingOpts = [
  { val: 'relevance', label: 'relevance' },
  { val: 'title_asc', label: 'title (a - z)' },
  { val: 'title_desc', label: 'title (z - a)' },
  { val: 'date_asc', label: 'date (old to new)' },
  { val: 'date_desc', label: 'date (new to old)' },
];

class Results extends React.Component {
  constructor(props) {
    super(props);
    const defaultLabel = this.props.sortBy ? _findWhere(sortingOpts, { val: this.props.sortBy }).label : 'relevance';
    this.state = {
      sortValue: this.props.sortBy,
      sortLabel: defaultLabel,
      active: false,
    };
  }

  getPage(page, type = 'next') {
    if (!page) return null;
    const pageNum = type === 'next' ? parseInt(page, 10) + 1 : parseInt(page, 10) - 1;

    return (
      <a
        href=""
        className={`paginate ${type}`}
        onClick={() => this.fetchResults(pageNum)}
        rel={type}
        aria-controls="results-region"
      >
        {`${type[0].toUpperCase()}${type.substring(1)}`} Page
      </a>
    );
  }

  getResultsSort() {
    return sortingOpts.map((d, i) => {
      return (<li role="region" key={i} onClick={e => this.sortResultsBy(e, d.val, d.label)}>
        {d.label}
      </li>);
    });
  }

  getResultsWindow() {
    if (this.state.active === false) {
      this.setState({ active: true });
    } else {
      this.setState({ active: false });
    }
  }

  fetchResults(page) {
    const query = this.props.location.query.q;
    const pageParam = page !== 1 ? `&page=${page}` : '';
    const sortQuery = getSortQuery(this.state.sortValue);

    ajaxCall(`/api?q=${query}${pageParam}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(page);
      this.context.router.push(`/search?q=${encodeURIComponent(query)}${pageParam}${sortQuery}`);
    });
  }

  sortResultsBy(e, sortData, label) {
    const sortValue = sortData;
    this.setState({ sortLabel: label });
    const query = this.props.location.query.q;
    const page = this.props.page !== '1' ? `&page=${this.props.page}` : '';
    const sortQuery = getSortQuery(sortValue);
    ajaxCall(`/api?q=${query}${page}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSortBy(sortValue);
      this.setState({ sortValue });
      this.context.router.push(`/search?q=${encodeURIComponent(query)}${page}${sortQuery}`);
    });
    this.setState({ active: false });
  }
  render() {
    const {
      results,
      hits,
      page,
    } = this.props;

    const paginationButtons = hits !== 0 ?
      (<Pagination
        hits={hits}
        page={page}
        location={this.props.location}
        sortBy={this.props.sortBy}
      />)
      : null;

    return (
      <div>
        {
          hits !== 0 &&
          (<div className="nypl-results-sorting-controls">
            <div className="nypl-results-sorter">
              <button aria-expanded={this.state.active} onClick={e => this.getResultsWindow(e)}>
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
              <ul className={this.state.active || 'hidden'}>
                {
                  this.getResultsSort()
                }
              </ul>
            </div>
          </div>)
        }

        <ResultList results={results} query={this.props.query} />

        {paginationButtons}
      </div>
    );
  }
}

Results.propTypes = {
  results: React.PropTypes.array,
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
  sortBy: React.PropTypes.string,
  location: React.PropTypes.object,
  page: React.PropTypes.string,
};

Results.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Results;
