import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import initialState from '../../src/app/stores/InitialState';

function testRender(ui, renderFunc, { store, ...otherOpts }) {
  return renderFunc(<Provider store={store}>{ui}</Provider>, {
    context: {
      router: {
        location: {},
        createHref: () => undefined,
        push: () => undefined,
      },
    },
    ...otherOpts,
  });
}

export const shallowTestRender = (ui, { store, ...otherOpts }) =>
  testRender(ui, shallow, { store, ...otherOpts });

export const mountTestRender = (ui, { store, ...otherOpts }) =>
  testRender(ui, mount, { store, ...otherOpts });

export function makeTestStore(state = {}) {
  const mockStore = configureStore([thunk]);
  const store = mockStore({
    ...initialState,
    ...state,
  });
  return store;
}
