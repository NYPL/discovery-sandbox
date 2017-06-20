import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from 'dgx-svg-icons';

import Actions from '../../actions/Actions.js';
import { ajaxCall } from '../../utils/utils.js';

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
    const prevSVG = <LeftArrowIcon />;
    const nextSVG = <RightArrowIcon />;
    const svg = type === 'Next' ? nextSVG : prevSVG;

    const searchStr = this.props.urlSearchString;
    const index = searchStr.indexOf('&page=');
    let newSearch = '';
    if (index !== -1) {
      const pageIndex = index + 6;
      newSearch = `${searchStr.substring(0, pageIndex)}` +
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
    Actions.updateSpinner(true);
    // Temporary. Need to check cross-browser and if it's needed at all.
    window.scrollTo(0, 0);
    const apiQuery = this.props.createAPIQuery({ page });

    ajaxCall(`/api?${apiQuery}`, response => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(page.toString());
      Actions.updateSpinner(false);
      this.context.router.push(`/search?${apiQuery}`);
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
          className={`page-count ${page === '1' ? 'first' : ''}`}
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
  hits: PropTypes.number,
  urlSearchString: PropTypes.string,
  page: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

Pagination.defaultProps = {
  page: '1',
  sortBy: 'relevance',
};

Pagination.contextTypes = {
  router: PropTypes.object,
};

export default Pagination;
