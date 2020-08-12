import axios from 'axios';

import appConfig from '../data/appConfig';

export const Actions = {
  SET_APP_CONFIG: 'SET_APP_CONFIG',
  UPDATE_SEARCH_RESULTS: 'UPDATE_SEARCH_RESULTS',
  UPDATE_SEARCH_KEYWORDS: 'UPDATE_SEARCH_KEYWORDS',
  UPDATE_BIB: 'UPDATE_BIB',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_SELECTED_FILTERS: 'UPDATE_SELECTED_FILTERS',
  REMOVE_FILTER: 'REMOVE_FILTER',
  UPDATE_PAGE: 'UPDATE_PAGE',
  UPDATE_SORT_BY: 'UPDATE_SORT_BY',
  UPDATE_LOADING_STATUS: 'UPDATE_LOADING_STATUS',
  UPDATE_DELIVERY_LOCATIONS: 'UPDATE_DELIVERY_LOCATIONS',
  UPDATE_IS_EDD_REQUESTABLE: 'UPDATE_IS_EDD_REQUESTABLE',
  UPDATE_SUBJECT_HEADING: 'UPDATE_SUBJECT_HEADING',
  UPDATE_DRBB_RESULTS: 'UPDATE_DRBB_RESULTS',
};

export const setAppConfig = data => ({
  type: Actions.SET_APP_CONFIG,
  appConfig: data,
});

export const updateSearchResults = searchResults => ({
  type: Actions.UPDATE_SEARCH_RESULTS,
  searchResults,
});

export const updateDrbbResults = drbbResults => ({
  type: Actions.UPDATE_DRBB_RESULTS,
  drbbResults,
});

export const updateFilters = filters => ({
  type: Actions.UPDATE_DRBB_RESULTS,
  filters,
});

const searchUrl = query => `${appConfig.baseUrl}/api?${query}`;

export const fetchSearchResults = query => (
  dispatch => axios
    .get(searchUrl(query))
    .then((resp) => {
      if (resp.data) {
        const { searchResults, filters, drbbResults } = resp.data;
        dispatch(updateSearchResults(searchResults));
        dispatch(updateDrbbResults(drbbResults));
        dispatch(updateFilters(filters));
      }
    })
    .catch((error) => {
      console.error('An error occurred during fetchSearchResults', error.message);
      throw new Error('An error occurred during fetchSearchResults', error.message);
    })
);

export const updateLoadingStatus = loading => ({
  type: Actions.UPDATE_LOADING_STATUS,
  loading,
});
