import { combineReducers } from 'redux';
import { Actions } from '../actions/Actions';
import initialState from './InitialState';

import appConfigData from '../data/appConfig';

export const loading = (state = null, action) => {
  switch (action.type) {
    case Actions.LOADING:
      return action.loading;
    default:
      return state;
  }
};

export const appConfig = (state = appConfigData, action) => {
  switch (action.type) {
    case Actions.APP_CONFIG:
      return action.appConfig;
    default:
      return state;
  }
};

export const searchResults = (state = null, action) => {
  switch (action.type) {
    case Actions.SEARCH:
      return {
        data: action.results,
      };
    default:
      return state;
  }
};

export const searchQuery = (state = null, action) => {
  if (action.type === Actions.SET_QUERY) {
    return action.searchQuery;
  }
  return state;
};

export const sort = (state = null, action) => (action.sort ? action.sort : state);

const appReducer = combineReducers({
  searchResults,
  searchQuery,
  sort,
  loading,
  appConfig,
});

export const rootReducer = (state, action) => {
  if (action.type === Actions.RESET_SEARCH) {
    // Reset everything except total books
    return Object.assign({}, initialState, {
      totalWorks: state.totalWorks,
    });
  }
  return appReducer(state, action);
};

export default rootReducer;
