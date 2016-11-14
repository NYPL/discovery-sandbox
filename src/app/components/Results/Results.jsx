import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

import EResourceResults from './EResourceResults.jsx';
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
        this.context.router.push(`/search?q=${query}${pageParam}`);
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
    let displayItems = `${pageFactor - (perPage - 1)} - ${pageFactor > hits ? hits : pageFactor}`;
    let nextPage = (hits < perPage || pageFactor > hits) 
      ? null : this.getPage(page, 'next');
    let prevPage = page > 1 ? this.getPage(page, 'previous') : null;

    if (hits < perPage) {
      displayItems = `1 - ${hits}`;
    }

    return (
      <div>
        <div className="results-nav">
          <div className="pagination">
            {prevPage}
            <span className="paginate pagination-total">{displayItems} of {hits}</span>
            {nextPage}
          </div>

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
            </form>
          </div>
        </div>

        {/*<EResourceResults results={results} query={this.props.query} />*/}
        <ResultList results={results} query={this.props.query} />
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
