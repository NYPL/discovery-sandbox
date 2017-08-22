// ACTIONS
import alt from '../alt.js';

class Actions {
  updateSearchResults(data) {
    return data;
  }

  updateSearchKeywords(data) {
    return data;
  }

  updateBib(data) {
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

  removeFacet(facetKey, valueId) {
    return { facetKey, valueId };
  }

  updatePage(page) {
    return page;
  }

  updateSortBy(sort) {
    return sort;
  }

  updateDiscoveryingStatus(data) {
    return data;
  }

  updateField(data) {
    return data;
  }

  updateForm(data) {
    return data;
  }

  updateDeliveryLocations(data) {
    return data;
  }

  updateIsEddRequestable(data) {
    return data;
  }
}

export default alt.createActions(Actions);
