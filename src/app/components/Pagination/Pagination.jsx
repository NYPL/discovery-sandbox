import React from 'react';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sortValue: this.props.sortBy };
  }

  getPage(page, type = 'Next') {
    if (!page) return null;
    const intPage = parseInt(page, 10);
    const pageNum = type === 'Next' ? intPage + 1 : intPage - 1;

    return (
      <button
        className={`paginate ${type.toLowerCase()}`}
        onClick={() => this.fetchResults(pageNum)}
        rel={type}
        aria-controls="results-region"
      >
        {type} Page
      </button>
    );
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

  render() {
    const {
      hits,
      page,
    } = this.props;
    if (!hits) return null;

    const perPage = 50;
    const pageFactor = parseInt(page, 10) * 50;
    const totalHits = hits.toLocaleString();
    const pageFactorF = pageFactor.toLocaleString();
    const nextPage = (hits < perPage || pageFactor > hits) ? null : this.getPage(page, 'Next');
    const prevPage = page > 1 ? this.getPage(page, 'Previous') : null;
    const from = pageFactor - (perPage - 1);
    const to = pageFactor > hits ? totalHits : pageFactorF;
    let displayItems = `${from} - ${to}`;

    if (hits < perPage) {
      displayItems = `1 - ${totalHits}`;
    }

    return (
      <div className="pagination">
        {prevPage}
        <span
          className="paginate pagination-total"
          aria-label={`Displaying ${displayItems} out of ${totalHits} total items.`}
          tabIndex="0"
        >
          {displayItems} of {totalHits}
        </span>
        {nextPage}
      </div>
    );
  }
}

Pagination.propTypes = {
  hits: React.PropTypes.number,
  sortBy: React.PropTypes.string,
  location: React.PropTypes.object,
  page: React.PropTypes.string,
};

Pagination.defaultProps = {
  page: '1',
  sortBy: 'relevance',
};

Pagination.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default Pagination;
