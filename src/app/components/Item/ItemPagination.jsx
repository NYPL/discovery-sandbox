import React from 'react';
import PropTypes from 'prop-types';
import {
  LeftArrowIcon,
  RightArrowIcon,
} from 'dgx-svg-icons';

class ItemPagination extends React.Component {
  /*
   * getPage()
   * Get a button based on current page.
   * @param {int} page The current page number.
   * @param {string} type Either 'Next' or 'Previous' to indication button label.
   */
  getPage(page, type = 'Next') {
    if (!page) return null;
    const intPage = parseInt(page, 10);
    const pageNum = type === 'Next' ? intPage + 1 : intPage - 1;
    const prevSVG = <LeftArrowIcon />;
    const nextSVG = <RightArrowIcon />;
    const svg = type === 'Next' ? nextSVG : prevSVG;

    return (
      <a
        href="#"
        rel={type.toLowerCase()}
        onClick={(e) => this.updateItemSelectionPage(e, pageNum)}
      >
        {svg} {type} Page
      </a>
    );
  }

  /*
   * updateItemSelectionPage()
   * @param {object} e Event object.
   * @param {string} page The next page to get results from.
   */
  updateItemSelectionPage(e, page) {
    e.preventDefault();
    this.props.updatePage(page);
  }

  render() {
    const {
      total,
      page,
    } = this.props;
    if (!total) return null;

    const perPage = 20;
    const pageFactor = parseInt(page, 10) * perPage;
    const nextPage = (total < perPage || pageFactor > total) ? null : this.getPage(page, 'Next');
    const prevPage = page > 1 ? this.getPage(page, 'Previous') : null;
    const totalPages = Math.floor(total / 20) + 1;

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

ItemPagination.propTypes = {
  total: PropTypes.number,
  page: PropTypes.number,
  updatePage: PropTypes.func,
};

ItemPagination.defaultProps = {
  page: 1,
};

ItemPagination.contextTypes = {
  router: PropTypes.object,
};

export default ItemPagination;
