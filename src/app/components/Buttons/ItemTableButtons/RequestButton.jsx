import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

const RequestButton = ({ text, secondary, url, onClick, children }) => {
  return (
    <div className='nypl-request-btn'>
      <Link
        href={url}
        onClick={onClick}
        className={(secondary && 'secondary') || null}
        tabIndex='0'
      >
        {text}
      </Link>
      {children}
    </div>
  );
};

RequestButton.propTypes = {
  text: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  secondary: PropTypes.bool,
  children: PropTypes.node,
};

export default RequestButton;

export const RequestButtonLabel = ({ children }) => {
  return (
    <>
      <br />
      <span className='nypl-request-btn-label'>{children}</span>
    </>
  );
};

RequestButtonLabel.propTypes = {
  children: PropTypes.node,
};
