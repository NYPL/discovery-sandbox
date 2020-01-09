/* global loadA11y, window */
// lines 2 and 3 replace deprecated "babel-polyfill"
import "core-js/stable";
import "regenerator-runtime/runtime";

import React from 'react';
import ReactDOM from 'react-dom';
import { useRouterHistory } from 'react-router';
import { Route, BrowserRouter } from 'react-router-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useSimpleScroll';
import { config, gaUtils } from 'dgx-react-ga';
import a11y from 'react-a11y';
import Iso from 'iso';

import appConfig from '../app/data/appConfig'
import Application from '../app/components/Application/Application'

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

    const appHistory = useScroll(useRouterHistory(createBrowserHistory))();

    ReactDOM.render(
      <BrowserRouter basename={appConfig.baseUrl}>
        <Route path="/"
          component={Application}
        />
      </BrowserRouter>,
      container,
    );
    gaUtils.trackPageview(window.location.pathname);
  });
};
