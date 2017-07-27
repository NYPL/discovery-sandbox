import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../../../appConfig.js';

const BibPage = ({ searchURL, searchKeywords = '' }) => {
  if (!searchURL) {
    return null;
  }

  return (
    <Link
      title={`Go back to search results ${searchKeywords ? `for ${searchKeywords}` : ''}`}
      className="nypl-back-link"
      to={`${appConfig.baseUrl}/search?${searchURL}`}
    >
      Back to Results
    </Link>
  );
};

BibPage.propTypes = {
  searchKeywords: PropTypes.string,
  searchURL: PropTypes.string,
};

export default BibPage;
