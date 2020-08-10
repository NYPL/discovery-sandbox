import { combineReducers } from 'redux';
import { Actions } from '../actions/Actions';

import appConfigData from '../data/appConfig';

const loading = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_LOADING_STATUS:
      return action.loading;
    default:
      return state;
  }
};

const appConfig = (state = appConfigData, action) => {
  switch (action.type) {
    case Actions.APP_CONFIG:
      return action.appConfig;
    default:
      return state;
  }
};

const searchResults = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_SEARCH_RESULTS:
      return action.searchResults;
    default:
      return state;
  }
};

const sort = (state = null, action) => (action.sort ? action.sort : state);

const appReducer = combineReducers({
  searchResults,
  sort,
  loading,
  appConfig,
});

export const rootReducer = (state, action) => {
  console.log("STATE", state, "ACTION", action);
  return appReducer(state, action);
};

export default rootReducer;
