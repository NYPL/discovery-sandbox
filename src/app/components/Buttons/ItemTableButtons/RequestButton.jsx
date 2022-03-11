import { Link } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';

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
  text: PropTypes.string,
  url: PropTypes.string,
  onClick: PropTypes.func,
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
