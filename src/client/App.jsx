/* global loadA11y */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import FeatureFlags from 'dgx-feature-flags';
import { config, gaUtils } from 'dgx-react-ga';
import a11y from 'react-a11y';

import alt from '../app/alt.js';
import Iso from 'iso';

import './styles/main.scss';

import routes from '../app/routes/routes.jsx';

if (loadA11y) {
  a11y(React, { ReactDOM, includeSrcNode: true });
}

window.onload = () => {
  // Used to activate/deactivate AB tests on global namespace.
  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  if (!window.ga) {
    const isProd = process.env.NODE_ENV === 'production';
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(config.google.code(isProd), gaOpts);
  }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);

    const appHistory = useScroll(useRouterHistory(createBrowserHistory))();

    ReactDOM.render(
      <Router history={appHistory}>{routes.client}</Router>,
      container
    );
    gaUtils.trackPageview(window.location.pathname);
  });
};
