import React from 'react';
import PropTypes from 'prop-types';

const SortButton = props => (
  <div className="subjectSortButton" onClick={props.handler}>˄</div>
);

SortButton.propTypes = {
  handler: PropTypes.func,
};

export default SortButton;
