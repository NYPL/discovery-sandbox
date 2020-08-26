/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { mock } from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import initialState from '../../src/app/stores/InitialState';

const TestProvider = ({
  store,
  children,
}) => <Provider store={store}>{children}</Provider>;

function testRender(ui, renderFunc, { store, ...otherOpts }) {
  const { dive } = otherOpts;
  if (dive) shallow(<TestProvider store={store}>{ui}</TestProvider>, otherOpts).dive();
  return renderFunc(<TestProvider store={store}>{ui}</TestProvider>, otherOpts);
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

export function makeTestStore(opts = initialState) {
  const mockStore = configureStore([thunk]);
  const store = mockStore(opts);
  const origDispatch = store.dispatch;
  store.dispatch = mock(origDispatch);
  return store;
}
