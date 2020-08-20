import { combineReducers } from 'redux';
import { Actions } from '../actions/Actions';

import appConfigData from '../data/appConfig';

const loading = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_LOADING_STATUS:
      return action.payload;
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
      return action.payload;
    default:
      return state;
  }
};

const drbbResults = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_DRBB_RESULTS:
      return action.payload;
    default:
      return state;
  }
};

const bib = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_BIB:
      return action.payload;
    default:
      return state;
  }
};

const filters = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_FILTERS:
      return action.payload;
    default:
      return state;
  }
};

const selectedFilters = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_SELECTED_FILTERS:
      return action.payload;
    default:
      return state;
  }
};

const searchKeywords = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_SEARCH_KEYWORDS:
      return action.payload;
    default:
      return state;
  }
};

const field = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_FIELD:
      return action.payload;
    default:
      return state;
  }
};

const sortBy = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_SORT_BY:
      return action.payload;
    default:
      return state;
  }
};

const page = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_PAGE:
      return action.payload;
    default:
      return state;
  }
};

const deliveryLocations = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_DELIVERY_LOCATIONS:
      return action.payload;
    default:
      return state;
  }
};

const isEddRequestable = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_IS_EDD_REQUESTABLE:
      return action.payload;
    default:
      return state;
  }
};

const patron = (state = null, action) => {
  switch (action.type) {
    case Actions.UPDATE_PATRON_DATA:
      return action.payload;
    default:
      return state;
  }
};

const appReducer = combineReducers({
  searchResults,
  loading,
  appConfig,
  drbbResults,
  bib,
  filters,
  selectedFilters,
  searchKeywords,
  patron,
  deliveryLocations,
  isEddRequestable,
  sortBy,
  page,
  field,
});

export const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
