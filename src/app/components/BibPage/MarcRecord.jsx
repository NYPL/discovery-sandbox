import React from 'react';
import PropTypes from 'prop-types';

const MarcRecord = ({ bNumber }) => {
  if (!bNumber) {
    return null;
  }
  const marcRecordLink =
    `https://catalog.nypl.org/search~S1?/.b${bNumber}/.b${bNumber}/1%2C1%2C1%2CB/marc`;

  return (
    <span>
      <dt>MARC Record</dt>
      <dd><a href={marcRecordLink}>MARC Record</a></dd>
    </span>
  );
};

MarcRecord.propTypes = {
  bNumber: PropTypes.string,
};

export default MarcRecord;
