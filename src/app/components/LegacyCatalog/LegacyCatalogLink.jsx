import PropTypes from 'prop-types';
import React from 'react';
import appConfig from '../../data/appConfig';

const LegacyCatalogLink = ({ recordNumber, display }) => {
  return (
    (display && (
      <a
        href={`${appConfig.legacyBaseUrl}/record=${recordNumber}~S1`}
        id='legacy-catalog-link'
      >
        View in Legacy Catalog
      </a>
    )) ||
    null
  );
};

LegacyCatalogLink.propTypes = {
  recordNumber: PropTypes.string,
  display: PropTypes.bool,
};

export default LegacyCatalogLink;
