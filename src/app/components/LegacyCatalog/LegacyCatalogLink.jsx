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

export default LegacyCatalogLink;
