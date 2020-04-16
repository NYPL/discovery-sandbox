import React from 'react';
import PropTypes from 'prop-types';

const LocalLoadingLayer = props => (
  <div className={`nypl-column-half ${props.classNames} subjectHeadingShowLoadingWrapper`}>
    <span
      id="loading-animation"
      className="loadingLayer-texts-loadingWord"
    >
      { props.message }
    </span>
    <div className="loadingDots">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

LocalLoadingLayer.propTypes = {
  message: PropTypes.string,
  classNames: PropTypes.string,
};

LocalLoadingLayer.defaultProps = {
  message: '',
  classNames: '',
};

export default LocalLoadingLayer;
