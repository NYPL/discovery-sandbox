import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

const EddButton = ({ display, link, onClick }) => {
  if (!display) return null;

  return (
    <div className='nypl-request-btn'>
      <Link to={link} onClick={onClick} tabIndex='0'>
        {`Request Scan`}
      </Link>
    </div>
  );
};

EddButton.propTypes = {
  display: PropTypes.boolean,
  link: PropTypes.string,
  onClick: PropTypes.function,
};

export default EddButton;
