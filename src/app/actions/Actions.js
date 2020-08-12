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
  type: Actions.UPDATE_FILTERS,
  filters,
});

export const updateBib = bib => ({
  type: Actions.UPDATE_DRBB_RESULTS,
  bib,
});

export const updateDeliveryLocations = deliveryLocations => ({
  type: Actions.UPDATE_DELIVERY_LOCATIONS,
  deliveryLocations,
});

export const updateIsEddRequestable = isEddRequestable => ({
  type: Actions.UPDATE_IS_EDD_REQUESTABLE,
  isEddRequestable,
});

/* `updateSearchResultsPage` fetches data and performs:
    * updateSearchResults
    * updatePage
    * updateSearchKeywords
    * updateFilters
    * updateSelectedFilters
    * updateSortBy
    * updateDrbbResults
*/
export const updateSearchResultsPage = (apiUrl) => {
  console.log("updateSearchResults", apiUrl);
  return (
    dispatch => axios
      .get(apiUrl)
      .then((resp) => {
        console.log("search results resp", resp);
        if (resp.data) {
          const { searchResults, filters, drbbResults } = resp.data;
          dispatch(updateSearchResults(searchResults));
          dispatch(updateDrbbResults(drbbResults));
          dispatch(updateFilters(filters));
        }
      })
      .catch((error) => {
        console.error('An error occurred during updateSearchResultsPage', error.message);
        throw new Error('An error occurred during updateSearchResultsPage', error.message);
      })
  );
};

export const updateBibPage = apiUrl => (
  dispatch => axios
    .get(apiUrl)
    .then((resp) => {
      if (resp.data) {
        const { bib } = resp.data;
        dispatch(updateBib(bib));
      }
    })
    .catch((error) => {
      console.error('An error occurred during fetchSearchResults', error.message);
      throw new Error('An error occurred during fetchSearchResults', error.message);
    })
);

export const updateHoldRequestPage = apiUrl => (
  dispatch => axios
    .get(apiUrl)
    .then((resp) => {
      if (resp.data) {
        const {
          bib,
          deliveryLocations,
          isEddRequestable,
        } = resp.data;
        dispatch(updateBib(bib));
        dispatch(updateDeliveryLocations(deliveryLocations));
        dispatch(updateIsEddRequestable(isEddRequestable));
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
