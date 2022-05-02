import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { RouterContext } from "react-router";

const initializeReduxReact = (props, store) =>
  ReactDOMServer.renderToString(
    <Provider store={store}>
      <RouterContext {...props} />
    </Provider>
  );

export default initializeReduxReact;
