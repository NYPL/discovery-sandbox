import React from 'react';

import Actions from '../../actions/Actions.js';
import {
  ajaxCall,
  getSortQuery,
} from '../../utils/utils.js';

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = { sortValue: this.props.sortBy };
  }

  /*
   * getPage()
   * Get a button based on current page.
   * @param {string} page The current page number.
   * @param {string} type Either 'Next' or 'Previous' to indication button label.
   */
  getPage(page, type = 'Next') {
    if (!page) return null;
    const intPage = parseInt(page, 10);
    const pageNum = type === 'Next' ? intPage + 1 : intPage - 1;

    return (
      <a
        href="#"
        onClick={(e) => this.fetchResults(e, pageNum)}
        rel={type.toLowerCase()}
        aria-controls="results-region"
      >
        {type} Page
      </a>
    );
  }

  /*
   * fetchResults()
   * Make ajax call with updated page selected.
   * @param {string} page The next page to get results from.
   */
  fetchResults(e, page) {
    e.preventDefault();
    const query = this.props.location.query.q;
    const pageParam = page !== 1 ? `&page=${page}` : '';
    const sortQuery = getSortQuery(this.state.sortValue);

    ajaxCall(`/api?q=${query}${pageParam}${sortQuery}`, response => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(page.toString());
      this.context.router.push(`/search?q=${encodeURIComponent(query)}${pageParam}${sortQuery}`);
    });
  }

  render() {
    const {
      hits,
      page,
    } = this.props;
    if (!hits) return null;

    const perPage = 50;
    const pageFactor = parseInt(page, 10) * perPage;
    const nextPage = (hits < perPage || pageFactor > hits) ? null : this.getPage(page, 'Next');
    const prevPage = page > 1 ? this.getPage(page, 'Previous') : null;
    const totalPages = Math.floor(hits / 50) + 1;

    return (
      <div className="nypl-results-pagination">
        {prevPage}
        <span
          className="page-count"
          aria-label={`Displaying page ${page} out of ${totalPages} total pages.`}
          tabIndex="0"
        >
          Page {page} of {totalPages}
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
