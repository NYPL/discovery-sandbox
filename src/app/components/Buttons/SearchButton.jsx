import React from 'react';
import PropTypes from 'prop-types';

const SearchButton = ({
  id,
  onClick,
  value,
}) => (
  <input
    id={id}
    onSubmit={onClick}
    onClick={onClick}
    type="submit"
    value={value}
  />
);

SearchButton.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.string,
  value: PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'nypl-omni-button',
  value: 'Search',
};

export default SearchButton;
