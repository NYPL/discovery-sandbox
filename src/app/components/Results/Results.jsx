import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import ResultList from './ResultsList.jsx';

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

    axios
      .get(`/api?q=${query}${pageParam}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updatePage(page);
        this.context.router.push(`/search?q=${encodeURIComponent(query)}${pageParam}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
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

    axios
      .get(`/api?q=${query}${page}${sortQuery}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updateSortBy(sortValue);

        this.setState({ sortValue });
        this.context.router.push(`/search?q=${encodeURIComponent(query)}${page}${sortQuery}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const {
      results,
      hits,
      page,
    } = this.props;
    const perPage = 50;
    const pageFactor = parseInt(page, 10) * 50;

    const hitsF = hits ? hits.toLocaleString() : '';
    const pageFactorF = pageFactor.toLocaleString();

    const nextPage = (hits < perPage || pageFactor > hits)
      ? null : this.getPage(page, 'next');
    const prevPage = page > 1 ? this.getPage(page, 'previous') : null;
    let displayItems = `${pageFactor - (perPage - 1)} - ${pageFactor > hits ? hitsF : pageFactorF}`;

    if (hits < perPage) {
      displayItems = `1 - ${hitsF}`;
    }

    const paginationButtons = (
      <div className="pagination">
        {prevPage}
        <span
          className="paginate pagination-total"
          aria-label={`Displaying ${displayItems} out of ${hitsF} total items.`}
          tabIndex="0"
        >
          {displayItems} of {hitsF}
        </span>
        {nextPage}
      </div>
    );

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

        {hits !== 0 && paginationButtons}
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
