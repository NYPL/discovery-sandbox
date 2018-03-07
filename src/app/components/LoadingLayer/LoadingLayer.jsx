import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

const LoadingLayer = ({ status, title }) => {
  if (status === false) {
    return null;
  }

  return (
    <FocusTrap className="focus-trap">
      <div
        className="loadingLayer"
        role="alert"
        aria-labelledby="loading-animation"
        aria-describedby="loading-description"
        aria-live="assertive"
        aria-atomic="true"
        tabIndex="0"
      >
        <div className="loadingLayer-layer" />
        <div className="loadingLayer-texts">
          <span id="loading-animation" className="loadingLayer-texts-loadingWord">
            Loading...
          </span>
          <span
            id="loading-description"
            className="loadingLayer-texts-title"
          >
            {title}
          </span>
          <div className="loadingDots">
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};

LoadingLayer.propTypes = {
  status: PropTypes.bool,
  title: PropTypes.string,
};

LoadingLayer.defaultProps = {
  status: false,
};

export default LoadingLayer;
