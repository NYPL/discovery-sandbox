import { Link } from '@nypl/design-system-react-components';
import React from 'react';
import appConfig from '../../data/appConfig';

const LegacyCatalogLink = ({ recordNumber, display }) => {
  return display ? (
    <Link
      href={`${appConfig.legacyBaseUrl}/record=${recordNumber}~S1`}
      id='legacy-catalog-link'
    >
      View in Legacy Catalog
    </Link>
  ) : null;
};

export default LegacyCatalogLink;
