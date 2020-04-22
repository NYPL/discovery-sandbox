import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  LeftWedgeIcon,
  RightWedgeIcon,
} from '@nypl/dgx-svg-icons';

import appConfig from '../../data/appConfig';

class Pagination extends React.Component {
  /*
   * onClick()
   * @param {string} page The next page to get results from.
   */
  onClick(e, page, type) {
    e.preventDefault();
    this.props.updatePage(page, type);
  }

  /*
   * getPage()
   * Get a link based on current page.
   * @param {string} page The current page number.
   * @param {string} type Either 'Next' or 'Previous' to indication link label.
   */
  getPage(page, type = 'Next') {
    const {
      hasNext,
      subjectShowPage,
      shepNavigation,
      subjectIndexPage,
    } = this.props;
    if (!page) return null;
    if (type == 'Next' && subjectShowPage && !hasNext) return null;
    const intPage = parseInt(page, 10);
    const pageNum = type === 'Next' ? intPage + 1 : intPage - 1;
    const svg = type === 'Next' ? <RightWedgeIcon /> : <LeftWedgeIcon />;
    const subjectHeadingPage = subjectShowPage || subjectIndexPage;

    let url;
    let apiUrl;
    let localUrl;
    if (subjectHeadingPage && shepNavigation) {
      if (!shepNavigation[type.toLowerCase()]) return null;
      url = type === 'Next' ? shepNavigation.next : shepNavigation.previous;
    } else {
      apiUrl = this.props.createAPIQuery({ page: pageNum });
      localUrl = `${this.props.to.pathname}${pageNum}`;
      url = apiUrl ?
        { pathname: `${appConfig.baseUrl}/search?${apiUrl}` }
        : { pathname: localUrl };
    }

    const linkProps = {};
    linkProps.to = url;
    linkProps.rel = type.toLowerCase();
    linkProps.className = `${type.toLowerCase()}-link`;

    if (!subjectIndexPage) linkProps.onClick = e => this.onClick(e, pageNum);

    return (
      <Link
        aria-controls={this.props.ariaControls}
        {...linkProps}
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
      subjectIndexPage
    } = this.props;
    const subjectHeadingPage = this.props.subjectShowPage || subjectIndexPage;
    let nextPage;
    const prevPage = page > 1 || subjectIndexPage ? this.getPage(page, 'Previous') : null;
    let pageFactor;
    let totalPages;
    if (!subjectHeadingPage) {
      if (!total) return null;
      pageFactor = parseInt(page, 10) * perPage;
      nextPage = (total < perPage || pageFactor > total) ? null : this.getPage(page, 'Next');
      totalPages = Math.floor(total / perPage) + 1;
    } else {
      nextPage = this.getPage(page, 'Next');
    }

    return (
      <nav className="nypl-results-pagination showPage" aria-label="More results">
        {prevPage}
        {!subjectHeadingPage
          ?
            <span
              className={`page-count ${page === 1 ? 'first' : ''}`}
              aria-label={`Displaying page ${page} out of ${totalPages} total pages.`}
              tabIndex="0"
            >
              Page {page} of {totalPages}
            </span>
          :
            null
        }
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
  subjectShowPage: PropTypes.bool,
  shepNavigation: PropTypes.object,
  subjectIndexPage: PropTypes.bool,
};

Pagination.defaultProps = {
  page: 1,
  perPage: 50,
  ariaControls: 'results-region',
  to: { pathname: '#' },
  createAPIQuery: () => {},
};

export default Pagination;
