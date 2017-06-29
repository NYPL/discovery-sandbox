import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from 'dgx-svg-icons';

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
    const svg = type === 'Next' ? <RightArrowIcon /> : <LeftArrowIcon />;
    const url = this.props.createAPIQuery({ page: pageNum });

    return (
      <Link
        to={url ? { pathname: `/search?${url}` } : this.props.to}
        rel={type.toLowerCase()}
        aria-controls={this.props.ariaControls}
        onClick={(e) => this.onClick(e, pageNum)}
      >
        {svg} {type} Page
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
      <div className="nypl-results-pagination">
        {prevPage}
        <span
          className={`page-count ${page === 1 ? 'first' : ''}`}
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
