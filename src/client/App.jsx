/* global loadA11y, window */
// lines 2 and 3 replace deprecated "babel-polyfill"
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useSimpleScroll';
import { config, gaUtils } from 'dgx-react-ga';
import a11y from 'react-a11y';
import { Provider } from 'react-redux';

import store from '../app/stores/Store';
import './styles/main.scss';
import './assets/drbb_promo.png';

import routes from '../app/routes/routes';

if (loadA11y) {
  a11y(React, { ReactDOM, includeSrcNode: true });
}

window.onload = () => {
  if (!window.ga) {
    const isProd = process.env.GA_ENV === 'development' ? false : process.env.NODE_ENV === 'production';
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(config.google.code(isProd), gaOpts);
  }
  const appElement = global.document.getElementById('app');
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes.client}
      </Router>
    </Provider>,
    appElement,
  );
  gaUtils.trackPageview(window.location.pathname);
};
