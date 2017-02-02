import React from 'react';

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
  onClick: React.PropTypes.func,
  label: React.PropTypes.string,
  id: React.PropTypes.string,
  className: React.PropTypes.string,
};

SearchButton.defaultProps = {
  id: 'searchButton',
  className: 'searchButton',
  label: 'Search',
};

export default SearchButton;
