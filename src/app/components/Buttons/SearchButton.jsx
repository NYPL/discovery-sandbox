import React from 'react';
import PropTypes from 'prop-types';
import SearchIconReversed from './SearchIconReversed';

const SearchButton = ({
  id,
  className,
  onClick,
  value,
}) => (
  <button
    id={id}
    className={`${className}`}
    onClick={onClick}
    type="submit"
    aria-controls="results-description"
  >
    {value}
    <SearchIconReversed />
  </button>
);

SearchButton.propTypes = {
  onClick: PropTypes.func,
  id: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'nypl-omni-button',
  value: 'Search',
};

export default SearchButton;
