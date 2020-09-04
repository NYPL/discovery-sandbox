import { Actions } from '../actions/Actions';
import initialState from './InitialState';
import appConfig from '../data/appConfig';

function appReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.RESET_STATE:
      // Reset state except appConfig and patron
      return { ...initialState, appConfig: state.appConfig, patron: state.patron, loading: false };
    case Actions.UPDATE_LOADING_STATUS:
      return { ...state, loading: action.payload };
    case Actions.UPDATE_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    case Actions.UPDATE_DRBB_RESULTS:
      return { ...state, drbbResults: action.payload };
    case Actions.UPDATE_BIB:
      return { ...state, bib: action.payload };
    case Actions.UPDATE_FILTERS:
      return { ...state, filters: action.payload };
    case Actions.UPDATE_SELECTED_FILTERS:
      return { ...state, selectedFilters: action.payload };
    case Actions.UPDATE_SEARCH_KEYWORDS:
      return { ...state, searchKeywords: action.payload };
    case Actions.UPDATE_LAST_LOADED:
      return { ...state, lastLoaded: action.payload };
    case Actions.UPDATE_FIELD:
      return { ...state, field: action.payload };
    case Actions.UPDATE_SORT_BY:
      return { ...state, sortBy: action.payload };
    case Actions.UPDATE_PAGE:
      return { ...state, page: action.payload };
    case Actions.UPDATE_IS_EDD_REQUESTABLE:
      return { ...state, isEddRequestable: action.payload };
    case Actions.UPDATE_PATRON_DATA:
      return { ...state, patron: action.payload };
    case Actions.UPDATE_DELIVERY_LOCATIONS:
      return { ...state, deliveryLocations: action.payload };
    case Actions.SET_APP_CONFIG:
      return { ...state, appConfig };
    default:
      return state;
  }
}

export const rootReducer = (state, action) => appReducer(state, action);

export default rootReducer;
