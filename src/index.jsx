import { DSProvider } from '@nypl/design-system-react-components';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { RouterContext } from 'react-router';

const initializeReduxReact = (props, store) =>
  ReactDOMServer.renderToString(
    <DSProvider>
      <Provider store={store}>
        <RouterContext {...props} />
      </Provider>
    </DSProvider>,
  );

export default initializeReduxReact;
