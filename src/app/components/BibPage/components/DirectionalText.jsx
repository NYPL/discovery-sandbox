import PropTypes from 'prop-types';
import React from 'react';

const DirectionalText = ({ text }) => {
  if (!text) return null;

  return (
    <span dir={unicodeDirection(text)} style={{ display: 'block' }}>
      {text}
    </span>
  );
};

DirectionalText.propTypes = {
  text: PropTypes.string,
};
