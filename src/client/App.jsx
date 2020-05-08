/* global loadA11y, window */
// lines 2 and 3 replace deprecated "babel-polyfill"
import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import { useScroll } from 'react-router-scroll';
import { config, gaUtils } from 'dgx-react-ga';
import a11y from 'react-a11y';
import Iso from 'iso';

import alt from '../app/alt';

import './styles/main.scss';

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

  // Render Isomorphically
  Iso.bootstrap((state, container) => {
    alt.bootstrap(state);

    ReactDOM.render(
      <Router
        history={browserHistory}
        render={applyRouterMiddleware(useScroll())}
      >
        {routes.client}
      </Router>,
      container,
    );
    gaUtils.trackPageview(window.location.pathname);
  });
};
