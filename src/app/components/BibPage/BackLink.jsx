import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { LeftArrowIcon } from 'dgx-svg-icons';

const BibPage = ({ searchURL, searchKeywords = '' }) => {
  if (!searchURL) {
    return null;
  }

  return (
    <Link
      title={`Go back to search results ${searchKeywords ? `for ${searchKeywords}` : ''}`}
      className="nypl-back-link"
      to={`/search?${searchURL}`}
    >
      <LeftArrowIcon />
      Back to Search Results
    </Link>
  );
};

BibPage.propTypes = {
  searchKeywords: PropTypes.string,
  searchURL: PropTypes.string,
};

export default BibPage;
