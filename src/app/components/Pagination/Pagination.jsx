import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
// import {
//   LeftWedgeIcon,
//   RightWedgeIcon,
// } from 'dgx-svg-icons';

import appConfig from '../../../../appConfig.js';

const LeftWedgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    viewBox="0 0 8.97 15.125"
  >
    <title>Wedge Left Arrow</title>
    <polygon
      points="7.563 15.125 0 7.562 7.563 0 8.97 1.407 2.815 7.562 8.97 13.717 7.563 15.125"
    />
  </svg>
);
const RightWedgeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    viewBox="0 0 8.97 15.126"
  >
    <title>Wedge Right Arrow</title>
    <polygon points="1.407 0 8.97 7.563 1.407 15.126 0 13.718 6.155 7.563 0 1.408 1.407 0" />
  </svg>
);

class Pagination extends React.Component {
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
    if (!page) return null;
    const intPage = parseInt(page, 10);
    const pageNum = type === 'Next' ? intPage + 1 : intPage - 1;
    const svg = type === 'Next' ? <RightWedgeIcon /> : <LeftWedgeIcon />;
    const apiUrl = this.props.createAPIQuery({ page: pageNum });
    const localUrl = `${this.props.to.pathname}${pageNum}`;
    const url = apiUrl ?
      { pathname: `${appConfig.baseUrl}/search?${apiUrl}` } : { pathname: localUrl };

    return (
      <Link
        to={url}
        rel={type.toLowerCase()}
        aria-controls={this.props.ariaControls}
        onClick={(e) => this.onClick(e, pageNum)}
      >
        {svg} {type}
      </Link>
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
      <nav className="nypl-results-pagination" aria-label="More results">
        {prevPage}
        <span
          className={`page-count ${page === 1 ? 'first' : ''}`}
          aria-label={`Displaying page ${page} out of ${totalPages} total pages.`}
          tabIndex="0"
        >
          Page {page} of {totalPages}
        </span>
        {nextPage}
      </nav>
    );
  }
}

Pagination.propTypes = {
  total: PropTypes.number,
  page: PropTypes.number,
  perPage: PropTypes.number,
  ariaControls: PropTypes.string,
  to: PropTypes.object,
  updatePage: PropTypes.func,
  createAPIQuery: PropTypes.func,
};

Pagination.defaultProps = {
  page: 1,
  ariaControls: 'results-region',
  to: { pathname: '#' },
  createAPIQuery: () => {},
};

export default Pagination;
