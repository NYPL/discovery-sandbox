import React from 'react';
import PropTypes from 'prop-types';

const SortButtons = props => (
  <span>
    <select onChange={props.handler} defaultValue={props.sortBy}>
      <option value="alphabetical">Alphabetical</option>
      <option value="bibs">Titles</option>
      <option value="descendants">Subheadings</option>
    </select>
  </span>
);

SortButtons.propTypes = {
  sortBy: PropTypes.string,
  handler: PropTypes.func,
};

export default SortButtons;
