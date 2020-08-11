import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';

import store from '../../stores/Store';
import { updateLoadingStatus } from '../../actions/Actions';

const { dispatch } = store;

// intercepts all http request to update the status of loading in the Store
axios.interceptors.request.use(
  (config) => {
    console.log("config", config);
    dispatch(updateLoadingStatus(true));
    return config;
  },
  (error) => {
    dispatch(updateLoadingStatus(false));
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => {
    console.log("response", response);
    dispatch(updateLoadingStatus(false));
    return response;
  },
  (error) => {
    setTimeout(() => {
      dispatch(updateLoadingStatus(false));
    }, 5000);
    return Promise.reject(error);
  },
);

const LoadingLayer = ({ loading, title, focus }) => {
  console.log("LOADING", loading);
  if (loading === false) {
    return null;
  }

  return (
    <FocusTrap
      focusTrapOptions={{
        onDeactivate: () => {
          if (focus) {
            focus();
          }
        },
      }}
    >
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
  loading: PropTypes.bool,
  title: PropTypes.string,
  focus: PropTypes.func,
};

LoadingLayer.defaultProps = {
  loading: false,
};

export default connect(({ loading }) => ({ loading }))(LoadingLayer);
