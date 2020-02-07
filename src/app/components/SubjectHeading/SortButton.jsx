import React from 'react';
import PropTypes from 'prop-types';

const SortButton = props => (
  <div className='subjectSortButton' onClick={() => props.handler(props.type)}>˄</div>
);

SortButton.propTypes = {
  handler: PropTypes.func,
  type: PropTypes.string,
};

export default SortButton;
