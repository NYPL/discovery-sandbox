import React from 'react';
import PropTypes from 'prop-types';

import { trackDiscovery } from '../../utils/utils.js';

const MarcRecord = ({ bNumber }) => {
  if (!bNumber) {
    return null;
  }
  const onClick = () => trackDiscovery('MARC Record', `Click - ${bNumber}`);
  const marcRecordLink =
    `https://catalog.nypl.org/search~S1?/.b${bNumber}/.b${bNumber}/1%2C1%2C1%2CB/marc`;

  return (<a href={marcRecordLink} onClick={onClick}>MARC Record</a>);
};

MarcRecord.propTypes = {
  bNumber: PropTypes.string,
};

export default MarcRecord;
