/* global loadA11y, window */
// lines 2 and 3 replace deprecated "babel-polyfill"
import 'core-js/stable';

import { DSProvider } from '@nypl/design-system-react-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import a11y from 'react-a11y';
import { Provider } from 'react-redux';
// import useScroll from 'react-router-scroll/lib/useScroll';

import store from '../app/stores/Store';
import './styles/main.scss';
import './assets/drbb_promo.png';

import routes from '../app/routes/routes';
import { trackVirtualPageView } from '../app/utils/utils';

if (loadA11y) {
  a11y(React, { ReactDOM, includeSrcNode: true });
}

window.onload = () => {
  const url = window.location.toString();
  const queryParams = url.slice(url.indexOf("?"))
  const appElement = global.document.getElementById('app');
  ReactDOM.render(
    <DSProvider>
      <Provider store={store}>
        <Router
          // history={browserHistory}
          // render={applyRouterMiddleware(useScroll())}
        >
          {routes.client}
        </Router>
      </Provider>
    </DSProvider>,
    appElement,
  );
  trackVirtualPageView(window.location.pathname, queryParams);
};
