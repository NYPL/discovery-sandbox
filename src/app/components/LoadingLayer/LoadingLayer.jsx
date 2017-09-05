import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

class LoadingLayer extends React.Component {
  render() {
    if (this.props.status === false) {
      return null;
    }

    return (
      <FocusTrap className="focus-trap">
        <div
          className="loadingLayer"
          role="alertdialog"
          aria-labelledby="loading-animation"
          aria-describedby="loading-description"
          aria-live="assertive"
          aria-atomic="true"
          ref={this.props.childRef}
          tabIndex={0}
        >
          <div className="loadingLayer-layer"></div>
          <div className="loadingLayer-texts">
            <span id="loading-animation" className="loadingLayer-texts-loadingWord">
              Loading...
            </span>
            <span
              id="loading-description"
              className="loadingLayer-texts-title"
            >
              {this.props.title}
            </span>
            <div className="loadingDots">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </FocusTrap>
    );
  }
}

LoadingLayer.propTypes = {
  status: PropTypes.bool,
  title: PropTypes.string,
  childRef: PropTypes.func,
};

LoadingLayer.defaultProps = {
  status: false,
};

export default LoadingLayer;
