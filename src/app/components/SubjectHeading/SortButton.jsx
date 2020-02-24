import React from 'react';
import PropTypes from 'prop-types';

const SortButton = props => (
  <button
    className='subjectSortButton'
    onClick={() => props.handler(props.type, props.direction)}
  >
    ˄
  </button>
);

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
  direction: PropTypes.string,
};

export default SortButton;
