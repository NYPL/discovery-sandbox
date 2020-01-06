import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../appConfig';

const BibPage = ({ searchURL, searchKeywords = '' }) => {
  if (!searchURL) {
    return null;
  }

  return (
    <Link
      title={`Go back to search results ${searchKeywords ? `for ${searchKeywords}` : ''}`}
      className="nypl-back-link"
      onClick={() => trackDiscovery('Back', 'Back to Search')}
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
