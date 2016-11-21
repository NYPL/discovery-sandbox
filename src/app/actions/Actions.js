// ACTIONS
import alt from '../alt.js';

class Actions {
  updateEbscoData(data) {
    return data;
  }

  updateSearchResults(data) {
    return data;
  }

  updateSearchKeywords(data) {
    return data;
  }

  updateItem(data) {
    return data;
  }

  updateFacets(data) {
    return data;
  }

  updateSelectedFacets(data) {
    return data;
  }

  updatePatronData(data) {
    return data;
  }

  removeFacet(field) {
    return field;
  }

  updatePage(page) {
    return page;
  }

  updateSortBy(sort) {
    return sort;
  }
}

export default alt.createActions(Actions);
