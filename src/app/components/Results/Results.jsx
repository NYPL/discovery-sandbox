import React from 'react';

import Actions from '../../actions/Actions.js';
import ResultList from './ResultsList.jsx';
import { ajaxCall } from '../../utils/utils.js';
import Pagination from '../Pagination/Pagination.jsx';

class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sortValue: this.props.sortBy };
  }

  fetchResults(page) {
    const query = this.props.location.query.q;
    const pageParam = page !== 1 ? `&page=${page}` : '';
    const reset = this.state.sortValue === 'relevance';
    let sortQuery = '';

    if (!reset) {
      const [sortBy, order] = this.state.sortValue.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

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
    const reset = sortValue === 'relevance';
    let sortQuery = '';

    if (!reset) {
      const [sortBy, order] = sortValue.split('_');
      sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
    }

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
          (<div className="results-nav">
            {paginationButtons}
            <div className="sort">
              <form className="sort-form">
                <fieldset>
                  <legend className="sort-legend visuallyHidden">Sort by</legend>
                  <label htmlFor="sort-by">Sort by</label>
                  <select
                    id="sort-by"
                    name="sort"
                    onChange={(e) => this.onChange(e)}
                    value={this.state.sortValue}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="title_asc">Title (a - z)</option>
                    <option value="title_desc">Title (z - a)</option>
                    {/*<option value="author_asc">Author (a - z)</option>*/}
                    {/*<option value="author_desc">Author (z - a)</option>*/}
                    <option value="date_asc">Date (old to new)</option>
                    <option value="date_desc">Date (new to old)</option>
                  </select>

                  <button className="visuallyHidden" type="submit">Search</button>
                </fieldset>
              </form>
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
