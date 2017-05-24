import React from 'react';
import { Link } from 'react-router';

import Actions from '../../actions/Actions.js';
import {
  ajaxCall,
  getSortQuery,
  getFieldParam,
  getFacetFilterParam,
} from '../../utils/utils.js';

class Pagination extends React.Component {
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
    const prevSVG = (
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 32 32">
        <title>Left arrow</title>
        <polygon points="16.959 24.065 9.905 16.963 27.298 16.963 27.298 14.548 9.905 14.548 16.959 7.397 15.026 5.417 4.688 15.707 15.026 25.998 16.959 24.065" />
      </svg>
    );
    const nextSVG = (
      <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" viewBox="0 0 32 32">
        <title>Right arrow</title>
        <polygon points="16.959 25.998 27.298 15.707 16.959 5.417 15.026 7.397 22.08 14.548 4.688 14.548 4.687 16.963 22.08 16.963 15.026 24.065 16.959 25.998" />
      </svg>
    );
    const svg = type === 'Next' ? nextSVG : prevSVG;

    const searchStr = this.props.location.search;
    const index = searchStr.indexOf('&page=');
    let newSearch = '';
    if (index !== -1) {
      const pageIndex = index + 6;
      newSearch = `${searchStr.substring(0, pageIndex - 1)}` +
        `${pageNum}${searchStr.substring(pageIndex + 1)}`;
    }

    return (
      <Link
        to={{ pathname: newSearch }}
        onClick={(e) => this.fetchResults(e, pageNum)}
        rel={type.toLowerCase()}
        aria-controls="results-region"
      >
        {svg} {type} Page
      </Link>
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
    const sortQuery = getSortQuery(this.props.sortBy);
    const fieldQuery = getFieldParam(this.props.field);
    const filterQuery = getFacetFilterParam(this.props.selectedFacets);

    ajaxCall(`/api?q=${query}${pageParam}${filterQuery}${sortQuery}${fieldQuery}`, response => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(page.toString());
      this.context.router
        .push(`/search?q=${encodeURIComponent(query)}${pageParam}${filterQuery}` +
          `${sortQuery}${fieldQuery}`);
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
  field: React.PropTypes.string,
  selectedFacets: React.PropTypes.object,
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
