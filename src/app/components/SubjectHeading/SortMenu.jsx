import React from 'react';
import PropTypes from 'prop-types';

const SortButton = props => (
  <select onChange={props.handler} defaultValue={props.sortBy}>
    <option value="alphabetical">Alphabetically</option>
    <option value="bibs">By title count</option>
    <option value="descendants">By subheading count</option>
  </select>
);

SortButton.propTypes = {
  sortBy: PropTypes.string,
  handler: PropTypes.func,
};

export default SortButton;
