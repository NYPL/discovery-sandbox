import React from 'react';

import Actions from '../../actions/Actions.js';
import ResultList from './ResultsList.jsx';
import {
  ajaxCall,
  getSortQuery,
} from '../../utils/utils.js';
import Pagination from '../Pagination/Pagination.jsx';

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sortValue: this.props.sortBy };
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

  getPage(page, type = 'next') {
    if (!page) return null;
    const pageNum = type === 'next' ? parseInt(page, 10) + 1 : parseInt(page, 10) - 1;

    return (
      <a
        href="#"
        className={`paginate ${type}`}
        onClick={(e) => this.fetchResults(pageNum)}
        rel={type}
        aria-controls="results-region"
      >
        {`${type[0].toUpperCase()}${type.substring(1)}`} Page
      </a>
    );
  }

  sortResultsBy(e) {
    const sortValue = e.target.data;
    const query = this.props.location.query.q;
    const page = this.props.page !== '1' ? `&page=${this.props.page}` : '';
    const sortQuery = getSortQuery(sortValue);
    ajaxCall(`/api?q=${query}${page}${sortQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSortBy(sortValue);
      this.setState({ sortValue });
      this.context.router.push(`/search?q=${encodeURIComponent(query)}${page}${sortQuery}`);
    });
  }

  render() {
    const {
      results,
      hits,
      page,
    } = this.props;

    const paginationButtons = hits !== 0 ?
      <Pagination
        hits={hits}
        page={page}
        location={this.props.location}
        sortBy={this.props.sortBy}
      />
      : null;

    return (
      <div>
        {
          hits !== 0 &&
          (<div className="nypl-results-sorting-controls">
             <div className="nypl-results-sorter">
               <button className="active" aria-expanded="false">
                 <span>Sort by <strong>{this.state.sortValue}</strong></span>
                 <svg aria-hidden="true" className="nypl-icon" preserveAspectRatio="xMidYMid meet" viewBox="0 0 68 24">
                   <title>wedge down icon</title>
                   <polygon points="67.938 0 34 24 0 0 10 0 34.1 16.4 58.144 0 67.938 0"></polygon>
                 </svg>
               </button>
               <ul className="">
                  <li onClick={(e) => this.sortResultsBy(e)} data="relevance">relevance</li>
                  <li onClick={(e) => this.sortResultsBy(e)} data="title_asc">title (a - z)</li>
                  <li onClick={(e) => this.sortResultsBy(e)} data="title_desc">title (z - a)</li>
                  <li onClick={(e) => this.sortResultsBy(e)} data="date_asc">date (old to new)</li>
                  <li onClick={(e) => this.sortResultsBy(e)} data="date_desc">date (new to old)</li>
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
