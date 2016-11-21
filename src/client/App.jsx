import React from 'react';
import ReactDOM from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import FeatureFlags from 'dgx-feature-flags';

import alt from '../app/alt.js';
import Iso from 'iso';

import './styles/main.scss';

import routes from '../app/routes/routes.jsx';

window.onload = () => {
  // Used to activate/deactivate AB tests on global namespace.
  if (!window.dgxFeatureFlags) {
    window.dgxFeatureFlags = FeatureFlags.utils;
  }

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);

    const appHistory = useScroll(useRouterHistory(createBrowserHistory))();

    ReactDOM.render(
      <Router history={appHistory}>{routes}</Router>,
      container
    );
  });
};
