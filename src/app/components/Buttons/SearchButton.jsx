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
      id={id}
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

export default SearchButton;
