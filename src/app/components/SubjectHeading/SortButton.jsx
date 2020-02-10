import React from 'react';
import PropTypes from 'prop-types';

const SortButton = (props) => {
  console.log('sortprops ', props);
  return (
    <div className='subjectSortButton' onClick={() => props.handler(props.type, props.direction)}>˄</div>
  );
};

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
  direction: PropTypes.string,
};

export default SortButton;
