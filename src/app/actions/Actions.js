import axios from 'axios';

export const Actions = {
  RESET_STATE: 'RESET_STATE',
  SET_APP_CONFIG: 'SET_APP_CONFIG',
  UPDATE_SEARCH_RESULTS: 'UPDATE_SEARCH_RESULTS',
  UPDATE_SEARCH_KEYWORDS: 'UPDATE_SEARCH_KEYWORDS',
  UPDATE_BIB: 'UPDATE_BIB',
  UPDATE_FILTERS: 'UPDATE_FILTERS',
  UPDATE_FIELD: 'UPDATE_FIELD',
  UPDATE_SELECTED_FILTERS: 'UPDATE_SELECTED_FILTERS',
  REMOVE_FILTER: 'REMOVE_FILTER',
  UPDATE_PAGE: 'UPDATE_PAGE',
  UPDATE_SORT_BY: 'UPDATE_SORT_BY',
  UPDATE_LOADING_STATUS: 'UPDATE_LOADING_STATUS',
  UPDATE_DELIVERY_LOCATIONS: 'UPDATE_DELIVERY_LOCATIONS',
  UPDATE_IS_EDD_REQUESTABLE: 'UPDATE_IS_EDD_REQUESTABLE',
  UPDATE_SUBJECT_HEADING: 'UPDATE_SUBJECT_HEADING',
  UPDATE_DRBB_RESULTS: 'UPDATE_DRBB_RESULTS',
  UPDATE_PATRON_DATA: 'UPDATE_PATRON_DATA',
};

export const resetState = () => ({
  type: Actions.RESET_STATE,
  payload: null,
});

export const setAppConfig = appConfig => ({
  type: Actions.SET_APP_CONFIG,
  payload: appConfig,
});

export const updateSearchResults = searchResults => ({
  type: Actions.UPDATE_SEARCH_RESULTS,
  payload: searchResults,
});

export const updateDrbbResults = drbbResults => ({
  type: Actions.UPDATE_DRBB_RESULTS,
  payload: drbbResults,
});

export const updateSearchKeywords = searchKeywords => ({
  type: Actions.UPDATE_SEARCH_KEYWORDS,
  payload: searchKeywords,
});

export const updateField = field => ({
  type: Actions.UPDATE_FIELD,
  payload: field,
});

export const updateFilters = filters => ({
  type: Actions.UPDATE_FILTERS,
  payload: filters,
});

export const updateSelectedFilters = selectedFilters => ({
  type: Actions.UPDATE_SELECTED_FILTERS,
  payload: selectedFilters,
});

export const updatePage = page => ({
  type: Actions.UPDATE_PAGE,
  payload: page,
});

export const updateSortBy = sortBy => ({
  type: Actions.UPDATE_SORT_BY,
  payload: sortBy,
});

export const updateBib = bib => ({
  type: Actions.UPDATE_BIB,
  payload: bib,
});

export const updateDeliveryLocations = deliveryLocations => ({
  type: Actions.UPDATE_DELIVERY_LOCATIONS,
  payload: deliveryLocations,
});

export const updateIsEddRequestable = isEddRequestable => ({
  type: Actions.UPDATE_IS_EDD_REQUESTABLE,
  payload: isEddRequestable,
});

export const updatePatronData = patronData => ({
  type: Actions.UPDATE_PATRON_DATA,
  payload: patronData,
});

/* `updateSearchResultsPage` performs:
    * updateSearchResults
    * updatePage
    * updateSearchKeywords
    * updateFilters
    * updateSelectedFilters
    * updateSortBy
    * updateDrbbResults
*/
export const updateSearchResultsPage = data => dispatch => new Promise(() => {
  const {
    searchResults,
    filters,
    drbbResults,
    selectedFilters,
    searchKeywords,
    page,
    sortBy,
    field,
  } = data;

  dispatch(updateSearchResults(searchResults));
  dispatch(updateDrbbResults(drbbResults));
  dispatch(updateFilters(filters));
  dispatch(updateSelectedFilters(selectedFilters));
  dispatch(updateField(field));
  dispatch(updateSearchKeywords(searchKeywords));
  if (page) dispatch(updatePage(page));
  if (sortBy) dispatch(updateSortBy(sortBy));
});

export const updateBibPage = ({ bib }) => dispatch => new Promise(() => dispatch(updateBib(bib)));

export const updateHoldRequestPage = data => dispatch => new Promise(() => {
  const { bib, deliveryLocations, isEddRequestable } = data;
  dispatch(updateBib(bib));
  dispatch(updateDeliveryLocations(deliveryLocations));
  dispatch(updateIsEddRequestable(isEddRequestable));
});

export const updateLoadingStatus = loading => ({
  type: Actions.UPDATE_LOADING_STATUS,
  payload: loading,
});
