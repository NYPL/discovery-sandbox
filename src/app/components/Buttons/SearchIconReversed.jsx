import React from 'react';
import PropTypes from 'prop-types';

const SearchIconReversed = ({ viewBox, height, width, title, className, style, fill, ariaHidden }) => (
  <svg
    viewBox={viewBox}
    width={width}
    height={height}
    className={`${className}`}
    fill={fill}
    style={style}
    aria-hidden={ariaHidden}
  >
    <title>{title}</title>
    <path d="M6.71738,25.58968a1.38782,1.38782,0,0,0,1.96268,0l3.86877-3.86822a8.53632,8.53632,0,1,0-2.07145-1.85393l-3.76,3.75948A1.38782,1.38782,0,0,0,6.71738,25.58968Zm10.401-5.31077h-.00064a5.75044,5.75044,0,1,1,.00064,0Z" />
  </svg>
);

SearchIconReversed.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  viewBox: PropTypes.string,
  fill: PropTypes.string,
  style: PropTypes.object,
  ariaHidden: PropTypes.bool,
};

SearchIconReversed.defaultProps = {
  ariaHidden: true,
  className: 'nypl-search-icon',
  title: 'NYPL Search SVG Icon',
  width: '28',
  height: '28',
  viewBox: '0 0 28 28',
};

export default SearchIconReversed;
