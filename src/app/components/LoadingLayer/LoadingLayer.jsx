import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

const LoadingLayer = ({ status, title, focus }) => {
  if (status === false) {
    return null;
  }

  return (
    <FocusTrap
      className="focus-trap"
      focusTrapOptions={{
        onDeactivate: () => {
          if (focus) {
            focus();
          }
        },
      }}
    >
      <div
        className="loadingLayer"
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
          <span id="loading-description" className="loadingLayer-texts-title">
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
  focus: PropTypes.func,
};

LoadingLayer.defaultProps = {
  status: false,
};

export default LoadingLayer;
