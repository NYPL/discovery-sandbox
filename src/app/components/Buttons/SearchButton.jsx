import React from 'react';
import PropTypes from 'prop-types';
// import { SearchIcon } from 'dgx-svg-icons';

const SearchButton = ({
  id,
  className,
  label,
  onClick,
}) => (
    <input
      id="nypl-omni-button"
      onSubmit={onClick}
      onClick={onClick}
      type="submit"
    >
    </input>
);

SearchButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'searchButton',
  label: 'Search',
};

export default SearchButton;
