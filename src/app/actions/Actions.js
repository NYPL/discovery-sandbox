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

const searchUrl = query => `${appConfig.baseUrl}/api?${query}`;

export const fetchSearchResults = (query) => {
  console.log('QUERY', query);
  return dispatch => axios
    .get(searchUrl(query))
    .then((resp) => {
      if (resp.data) {
        dispatch(updateSearchResults(resp.data));
      }
    })
    .catch((error) => {
      console.log('An error occurred during searchPost', error.message);
      throw new Error('An error occurred during searchPost', error.message);
    });
};

export const updateLoadingStatus = loading => ({
  type: Actions.UPDATE_LOADING_STATUS,
  loading,
});

export default {
  setAppConfig,
};
