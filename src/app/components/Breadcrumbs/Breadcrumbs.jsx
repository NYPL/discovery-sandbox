import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../appConfig';

const {
  baseUrl,
  displayTitle,
} = appConfig;

const Breadcrumbs = ({ query = '', type, bibUrl, itemUrl, edd, headingDetails }) => {
  const defaultText = displayTitle;
  const onClick = pageTitle => trackDiscovery('Breadcrumbs', pageTitle);
  const homeLink = (
    <li key="home">
      <Link to={`${baseUrl}/`} onClick={() => onClick(defaultText)}>
        {defaultText}
      </Link>
    </li>);

  /*
   * getCrumbs()
   * Returns an array of list elements to render for the breadcrumbs navigation.
   * This will keep pushing new elements onto an array until it reaches the spot desired.
   * It will then return the list up to that point with the active location being a simple
   * text list element.
   * @returns {array}
   */
  const getCrumbs = () => {
    // The first link is the homepage and it will being appearing starting from the
    // Search Results page.
    const crumbs = [homeLink];

    if (type === 'subjectHeading') {
      crumbs.push(
        <li key="subjectHeading">
          <Link to={`${baseUrl}/subject_headings`}>
            Subject Headings
          </Link>
        </li>
      );
      if (headingDetails) {
        crumbs.push(<li key="subjectHeadingDetails">Heading Details</li>);
      }
      return crumbs
    }

    if (type === 'search') {
      crumbs.push(<li key="search">Search Results</li>);
      return crumbs;
    }

    crumbs.push(
      <li key="search">
        <Link to={`${baseUrl}/search?${query}`} onClick={() => onClick('Search Results')}>
          Search Results
        </Link>
      </li>);

    if (type === 'bib') {
      crumbs.push(<li key="bib">Item Details</li>);
      return crumbs;
    }

    crumbs.push(
      <li key="bib">
        <Link to={`${baseUrl}${bibUrl}`} onClick={() => onClick('Item Details')}>Item Details</Link>
      </li>);

    if (type === 'hold') {
      crumbs.push(<li key="hold">Item Request</li>);
      return crumbs;
    }

    crumbs.push(
      <li key="hold">
        <Link to={`${baseUrl}${itemUrl}`} onClick={() => onClick('Item Request')}>Item Request</Link>
      </li>);

    if (type === 'edd') {
      crumbs.push(<li key="edd">Electronic Delivery Request</li>);
      return crumbs;
    }

    // If you came from the EDD form, then you want a link in the breadcrumbs for it.
    if (edd) {
      crumbs.push(
        <li key="edd">
          <Link
            to={`${baseUrl}${itemUrl}/edd`}
            onClick={() => onClick('Electronic Delivery Request')}
          >
            Electronic Delivery Request
          </Link>
        </li>);
    }

    // The last possible point in the breadcrumbs will be the Confirmation page.
    crumbs.push(<li key="confirmation">Request Confirmation</li>);

    return crumbs;
  };

  const crumbs = getCrumbs();

  return (
    <nav aria-label="Breadcrumbs" className="nypl-breadcrumbs">
      <span className="nypl-screenreader-only">You are here:</span>
      <ol>
        {crumbs}
      </ol>
    </nav>
  );
};

Breadcrumbs.propTypes = {
  query: PropTypes.string,
  type: PropTypes.string,
  bibUrl: PropTypes.string,
  itemUrl: PropTypes.string,
  edd: PropTypes.bool,
};

export default Breadcrumbs;
