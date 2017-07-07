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

    if (type === 'Number') {
      label = pageNum;
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
   * @reruen {Array} an array contains all the links to each page.
   */
  renderPageLinks(totalPages) {
    const linksArray = [];
    let pageNum = 0;

    _times(
      totalPages,
      () => {
        linksArray.push(this.getPage(pageNum, 'Number'));
        pageNum ++;
      }
    );

    if (linksArray.length > 8) {
      return linksArray.slice(0, 8);
    }

    return linksArray;
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
          Page {page} of {totalPages}
        </span>
        {this.renderPageLinks(totalPages)}
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
