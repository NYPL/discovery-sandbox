import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

const LoadingLayer = ({ status, title }) => {
  if (status === false) {
    return null;
  }

  return (
    <FocusTrap
      className="focus-trap"
      focusTrapOptions={{
        returnFocusOnDeactivate: false,
        initialFocus: 'loadingLayer-texts',
      }}
    >
      <div
        className="loadingLayer"
        role="alert"
        aria-labelledby="loading-animation"
        aria-describedby="loading-description"
      >
        <div className="loadingLayer-layer" />
        <div id="loadingLayer-texts" className="loadingLayer-texts">
          <span tabIndex="0" id="loading-animation" className="loadingLayer-texts-loadingWord">
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
