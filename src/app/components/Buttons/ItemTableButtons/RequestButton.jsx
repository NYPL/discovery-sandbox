import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { isAeonLink } from '../../../utils/utils';

const RequestButton = ({ text, secondary, url, onClick, children }) => {
  const handleClick = (event) => {
    // Allow the button link handler to deal with routing
    // if (!isAeonLink(url)) {
    //   event.preventDefault();
    // }

    onClick(url);
  };

  return (
    <div className='nypl-request-btn'>
      <Link
        href={url}
        onClick={handleClick}
        className={(secondary && 'secondary') || null}
        tabIndex='0'
      >
        {text}
      </Link>
      <RequestButtonLabel>{children}</RequestButtonLabel>
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
    (children && (
      <>
        <br />
        <span className='nypl-request-btn-label'>{children}</span>
      </>
    )) ||
    null
  );
};

RequestButtonLabel.propTypes = {
  children: PropTypes.node,
};
