import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const LoadingLayer = ({ loading, title, focus }) => {
  useEffect(() => {
    if (typeof window !== undefined) {
      const element = document.getElementById(window.location.hash.slice(1));
      if (element) element.scrollIntoView()
    }
  })

  if (loading === false) {
    return null;
  }


  return (
    <div
      className="loadingLayer focus-trap"
      aria-labelledby="loading-animation"
      aria-describedby="loading-description"
      role="alert"
      tabIndex="0"
    >
      <div className="loadingLayer-layer" />
      <div className="loadingLayer-texts">
        <span id="loading-animation" className="loadingLayer-texts-loadingWord">
          Loading...
        </span>
        <div className="loadingDots">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
};

LoadingLayer.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string,
  focus: PropTypes.func,
};

LoadingLayer.defaultProps = {
  loading: false,
};

export default LoadingLayer;
