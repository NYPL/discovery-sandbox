import React from 'react';
import PropTypes from 'prop-types';
// import { SearchIcon } from 'dgx-svg-icons';

const SearchButton = ({
  id,
  className,
  label,
  onClick,
}) => (
  <div id={`${id}-wrapper`} className={`${className}-wrapper`}>
    <button
      className={className}
      onSubmit={onClick}
      onClick={onClick}
      type="submit"
    >
      {label}
    </button>
  </div>
);

SearchButton.propTypes = {
  onClick: PropTypes.func,
  label: PropTypes.string,
  id: PropTypes.string,
  className: PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'searchButton',
  className: 'searchButton',
  label: 'Search',
};

export default SearchButton;
