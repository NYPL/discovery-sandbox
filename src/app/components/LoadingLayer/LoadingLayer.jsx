import React from 'react';
import PropTypes from 'prop-types';

class LoadingLayer extends React.Component {
  render() {
    if (this.props.status === false) {
      return null;
    }

    return (
      <div
        className="loadingLayer"
        role="alertdialog"
        aria-labelledby="loading-animation"
        aria-describedby="loading-description"
      >
        <div className="loadingLayer-layer"></div>
        <div aria-live="assertive" aria-atomic="true" className="loadingLayer-texts">
          <span id="loading-animation" className="loadingLayer-texts-loadingWord">
            Loading...
          </span>
          <span
            id="lloading-description"
            className="loadingLayer-texts-title"
            ref={this.props.childRef}
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
