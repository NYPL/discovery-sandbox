import { Link as DSLink } from '@nypl/design-system-react-components';
import React from 'react';
import { Link } from 'react-router';

const BackToSearchResults = ({ selection, bibId }) => {
  return (
    (selection.fromUrl && selection.bibId === bibId && (
      <DSLink>
        <Link to={selection.fromUrl}>Back to search results</Link>
      </DSLink>
    )) ||
    null
  );
};

export default BackToSearchResults;
