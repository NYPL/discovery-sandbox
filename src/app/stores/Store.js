/* eslint-disable no-underscore-dangle */
import configureStore from './configureStore';
import initialState from './InitialState';

const preloadedState = global && global.window && global.window.__PRELOADED_STATE__;
if (preloadedState) {
  delete global.window.__PRELOADED_STATE__;
}

const store = configureStore(preloadedState || initialState);

export default store;
