import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig';

const BackLink = ({ searchUrl, searchKeywords = '' }) => {
  if (!searchUrl) {
    return null;
  }

  return (
    <Link
      title={`Go back to search results ${searchKeywords ? `for ${searchKeywords}` : ''}`}
      className="nypl-back-link"
      onClick={() => trackDiscovery('Back', 'Back to Search')}
      to={`${appConfig.baseUrl}/search?${searchUrl}`}
    >
      Back to Results
    </Link>
  );
};

BackLink.propTypes = {
  searchKeywords: PropTypes.string,
  searchUrl: PropTypes.string,
};

export default BackLink;
