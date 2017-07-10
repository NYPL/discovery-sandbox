import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from 'dgx-svg-icons';
import { times as _times } from 'underscore';

class SearchPagination extends React.Component {
  /*
   * onClick()
   * @param {string} page The next page to get results from.
   */
  onClick(e, page) {
    e.preventDefault();
    this.props.updatePage(page);
  }

  /*
   * getPage()
   * Get a button based on current page.
   * @param {string} page The current page number.
   * @param {string} type Either 'Next' or 'Previous' to indication button label.
   */
  getPage(page, type = 'Next') {
    if (!page && type !== 'Number') return null;

    const intPage = parseInt(page, 10);
    const pageNum = type === 'Previous' ? intPage - 1 : intPage + 1;
    const svg = type === 'Previous' ? <LeftArrowIcon /> : <RightArrowIcon />;
    const apiUrl = this.props.createAPIQuery({ page: pageNum });
    const localUrl = `${this.props.to.pathname}${pageNum}`;
    const url = apiUrl ? { pathname: `/search?${apiUrl}` } : { pathname: localUrl };
    let label;
    const pageClass = (type === 'Number') ? 'page-number' : '';
    let currentPageClass = '';

    if (type === 'Number') {
      label = pageNum;
      currentPageClass = (pageNum === this.props.page) ? 'current-page' : '';
    } else {
      label = <div>{svg} <span>{type} Page</span></div>;
    }

    return (
      <Link
        to={url}
        rel={type.toLowerCase()}
        aria-controls={this.props.ariaControls}
        onClick={(e) => this.onClick(e, pageNum)}
        key={(type === 'Number') ? pageNum : type}
        className={`${pageClass} ${currentPageClass}`}
      >
        {label}
      </Link>
    );
  }

  /*
   * renderPageLinks(totalPages)
   * Renders the links to each page.
   *
   * @param {Number} total pages.
   * @return {Array} an array contains all the links to each page.
   */
  renderPageLinks(totalPages) {
    const linksArray = [];
    const perPageInGroup = this.props.perPageInGroup;
    const firstPageInGroup = (Math.ceil(this.props.page / perPageInGroup) - 1) * perPageInGroup;
    const lastPageInGroup = firstPageInGroup + perPageInGroup;
    let pageNum = 0;

    _times(
      totalPages,
      () => {
        linksArray.push(this.getPage(pageNum, 'Number'));
        pageNum ++;
      }
    );

    const lastPage = ((totalPages - firstPageInGroup) > perPageInGroup) ?
      linksArray[(linksArray.length)-1] : null;

    if (linksArray.length > 8) {
      return this.renderPagerElement(
        linksArray.slice(firstPageInGroup, lastPageInGroup),
        lastPage
      );
    }

    return linksArray;
  }

  /*
   * renderPagerElement(pageArray, lastPage)
   * Renders the HTML element for the pagination UI.
   *
   * @param {Array} pageArray
   * @param {Object} lastPage
   * @return {HTML Element}
   */
  renderPagerElement(pageArray, lastPage) {
    return (
      <div>
        {pageArray}{(lastPage) && <span>...</span>}{lastPage}
      </div>
    );
  }

  render() {
    const {
      total,
      page,
      perPage,
    } = this.props;
    if (!total) return null;

    const pageFactor = parseInt(page, 10) * perPage;
    const nextPage = (total < perPage || pageFactor > total) ? null : this.getPage(page, 'Next');
    const prevPage = page > 1 ? this.getPage(page, 'Previous') : null;
    const totalPages = Math.floor(total / perPage) + 1;

    return (
      <div className="nypl-results-pagination">
        {prevPage}
        <span
          className={`page-count ${page === 1 ? 'first' : ''}`}
          aria-label={`Displaying page ${page} out of ${totalPages} total pages.`}
          tabIndex="0"
        >
          {this.renderPageLinks(totalPages)}
        </span>
        {nextPage}
      </div>
    );
  }
}

SearchPagination.propTypes = {
  total: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  ariaControls: PropTypes.string,
  to: PropTypes.object,
  updatePage: PropTypes.func,
  createAPIQuery: PropTypes.func,
};

SearchPagination.defaultProps = {
  page: 1,
  ariaControls: 'results-region',
  to: { pathname: '#' },
  createAPIQuery: () => {},
};

export default SearchPagination;
