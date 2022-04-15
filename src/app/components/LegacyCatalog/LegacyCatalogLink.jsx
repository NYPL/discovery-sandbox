import PropTypes from 'prop-types';
import React from 'react';
import { isNyplBnumber } from '../../utils/utils';
import appConfig from '../../data/appConfig';

const LegacyCatalogLink = ({ recordNumber }) => {
  if (!isNyplBnumber(recordNumber)) return null;

  return (
    <a
      href={`${appConfig.legacyBaseUrl}/record=${recordNumber}~S1`}
      id='legacy-catalog-link'
    >
      View in Legacy Catalog
    </a>
  );
};

LegacyCatalogLink.propTypes = {
  recordNumber: PropTypes.string,
};

export default LegacyCatalogLink;
