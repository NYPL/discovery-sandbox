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

  onChange(e) {
    const sortValue = e.target.value;
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

  sortResultsBy(e) {
    e.preventDefault();
    this.setState({ "aria-expanded": true });
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
             <button aria-expanded="false" onClick={(e) => this.sortResultsBy(e)}>
               Sort by <strong>{this.state.sortValue}</strong>
               <svg aria-hidden="true" className="nypl-icon" preserveAspectRatio="xMidYMid meet" viewBox="0 0 68 24">
                 <title>wedge down icon</title>
                 <polygon points="67.938 0 34 24 0 0 10 0 34.1 16.4 58.144 0 67.938 0"></polygon>
               </svg>
             </button>
             <div id="sort-menu" className="hidden">
             <form className="sort-form">
               <fieldset>
                 <label htmlFor="sort-by" className="sort-legend visuallyHidden">Sort by</label>
                    <select
                      id="sort-by"
                      className="sort-legend"
                      name="sort"
                      onChange={(e) => this.onChange(e)}
                      value={this.state.sortValue}
                      >
                        <option value="relevance">relevance</option>
                        <option value="title_asc">title (a - z)</option>
                        <option value="title_desc">title (z - a)</option>
                        <option value="date_asc">date (old to new)</option>
                        <option value="date_desc">date (new to old)</option>
                      </select>
                    </fieldset>
                  </form>
                </div>
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
  page: React.PropTypes.number,
};

Results.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Results;
