import React from 'react';
import PropTypes from 'prop-types';
import SearchIconReversed from './SearchIconReversed';

const SearchButton = ({
  id,
  onClick,
  value,
}) => (
  <button
    id={id}
    className="nypl-omnisearch-button nypl-primary-button"
    onClick={onClick}
    type="submit"
  >
    {value}
    <SearchIconReversed />
  </button>
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
