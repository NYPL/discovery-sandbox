import { Link } from '@nypl/design-system-react-components';
import React from 'react';
import PropTypes from 'prop-types';

import { trackDiscovery } from '../../utils/utils';

const MarcRecord = ({ bNumber }) => {
  if (!bNumber) {
    return null;
  }
  const onClick = () => trackDiscovery('MARC Record', `Click - ${bNumber}`);
  const marcRecordLink =
    `https://catalog.nypl.org/search~S1?/.b${bNumber}/.b${bNumber}/1%2C1%2C1%2CB/marc`;

  return (<Link href={marcRecordLink} onClick={onClick}>MARC Record</Link>);
};

MarcRecord.propTypes = {
  bNumber: PropTypes.string,
};

export default MarcRecord;
