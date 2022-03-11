import PropTypes from 'prop-types';
import React from 'react';
import appConfig from '../../../data/appConfig';
import RequestButton from './RequestButton';

const EddButton = ({ item, bibId, onClick }) => {
  if (!item.eddRequestable) return null;

  const path = `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}/edd`;

  const handleClick = (event) => {
    event.preventDefault();
    onClick(path);
  };

  return (
    <RequestButton url={path} text={`Request Scan`} onClick={handleClick} />
  );
};

EddButton.propTypes = {
  item: PropTypes.object.isRequired,
  bibId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default EddButton;
