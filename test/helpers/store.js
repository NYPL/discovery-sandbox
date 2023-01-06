/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import initialState from '../../src/app/stores/InitialState';
import { PatronProvider } from '../../src/app/context/PatronContext';

const TestProvider = ({ store, children, patron }) => {
  return (
    <PatronProvider patron={patron}>
      <Provider store={store}>
        {children}
      </Provider>
    </PatronProvider>
  );
}

function testRender(ui, renderFunc, { store, patron, ...otherOpts }) {
  return renderFunc(
    <TestProvider store={store} patron={patron}>{ui}</TestProvider>,
    {
      context: {
        router: {
          location: { query: {}, pathname: '' },
          createHref: () => {},
          push: () => {},
        },
      },
      ...otherOpts,
    }
  );
}

export const shallowTestRender = (ui, { store, ...otherOpts }) => testRender(
  ui,
  shallow,
  { store, ...otherOpts },
);

export const mountTestRender = (ui, { store, ...otherOpts }) => testRender(
  ui,
  mount,
  { store, ...otherOpts },
);

export function makeTestStore(state = {}) {
  const mockStore = configureStore([thunk]);
  const store = mockStore({
    ...initialState,
    ...state,
  });
  return store;
}
