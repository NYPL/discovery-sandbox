import React from 'react';
import PropTypes from 'prop-types';

const LibraryHoldings = ({ holdings }) => {
  if (!holdings) {
    return null;
  }

  return (
    <div>
      Holdings data here
    </div>
  );
};

LibraryHoldings.propTypes = {
  holdings: PropTypes.object,
};

export default LibraryHoldings;
