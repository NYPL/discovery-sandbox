import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import ResultList from './ResultsList.jsx';

class Results extends React.Component {
  fetchResults(page) {
    const query = this.props.location.query.q;
    const pageParam = page !== 1 ? `&page=${page}` : '';

    axios
      .get(`/api?q=${query}&page=${page}`)
      .then(response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updatePage(page);
        this.context.router.push(`/search?q=${encodeURIComponent(query)}${pageParam}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getPage(page, type = 'next') {
    if (!page) return null;
    const pageNum = type === 'next' ?  parseInt(page, 10) + 1 : parseInt(page, 10) - 1;

    return (
      <a className={`paginate ${type}`} onClick={(e) => this.fetchResults(pageNum)}>
        {type[0].toUpperCase()}{type.substring(1)} Page
      </a>
    );
  }

  render() {
    const {
      results,
      hits,
      page,
    } = this.props;
    const perPage = 50;
    const pageFactor = parseInt(page, 10) * 50;

    const hitsF = hits.toLocaleString();
    const pageFactorF = pageFactor.toLocaleString();

    let displayItems = `${pageFactor - (perPage - 1)} - ${pageFactor > hits ? hitsF : pageFactorF}`;
    let nextPage = (hits < perPage || pageFactor > hits)
      ? null : this.getPage(page, 'next');
    let prevPage = page > 1 ? this.getPage(page, 'previous') : null;

    if (hits < perPage) {
      displayItems = `1 - ${hitsF}`;
    }

    const paginationButtons = (
      <div className="pagination">
        {prevPage}
        <span className="paginate pagination-total">{displayItems} of {hitsF}</span>
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
                <label htmlFor="sort-by">Sort by</label>
                <select id="sort-by" name="sort">
                  <option value="relevance">Relevance</option>
                  <option value="title_asc">Title (a - z)</option>
                  <option value="title_desc">Title (z - a)</option>
                  <option value="author_asc">Author (a - z)</option>
                  <option value="author_desc">Author (z - a)</option>
                  <option value="date_asc">Date (old to new)</option>
                  <option value="date_desc">Date (new to old)</option>
                </select>

                <button className="visuallyHidden" type="submit">Search</button>
              </form>
            </div>
          </div>)
        }

        <ResultList results={results} query={this.props.query} />

        { hits !== 0 && paginationButtons }
      </div>
    );
  }
}

Results.propTypes = {
  results: React.PropTypes.array,
  hits: React.PropTypes.number,
  query: React.PropTypes.string,
};

Results.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Results;
