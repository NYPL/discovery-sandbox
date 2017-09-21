import Actions from '../actions/Actions.js';
import alt from '../alt.js';

import { reject as _reject } from 'underscore';

class Store {
  constructor() {
    this.bindListeners({
      updateSearchResults: Actions.updateSearchResults,
      updateSearchKeywords: Actions.updateSearchKeywords,
      updateBib: Actions.updateBib,
      updateFacets: Actions.updateFacets,
      updateSelectedFacets: Actions.updateSelectedFacets,
      removeFacet: Actions.removeFacet,
      updatePage: Actions.updatePage,
      updateSortBy: Actions.updateSortBy,
      updateLoadingStatus: Actions.updateLoadingStatus,
      updateField: Actions.updateField,
      updateForm: Actions.updateForm,
      updateDeliveryLocations: Actions.updateDeliveryLocations,
      updateIsEddRequestable: Actions.updateIsEddRequestable,
    });

    this.state = {
      searchResults: {},
      bib: {},
      searchKeywords: '',
      facets: {},
      selectedFacets: {
        materialType: [],
        language: [],
        dateAfter: {},
        dateBefore: {},
      },
      page: '1',
      sortBy: 'relevance',
      isLoading: false,
      field: 'all',
      error: {},
      form: {},
      deliveryLocations: [],
      isEddRequestable: false,
    };
  }

  updateSearchResults(data) {
    this.setState({ searchResults: data });
  }

  updateSearchKeywords(data) {
    this.setState({ searchKeywords: data });
  }

  updateBib(data) {
    this.setState({ bib: data });
  }

  updateFacets(data) {
    this.setState({ facets: data });
  }

  updateSelectedFacets(data) {
    this.setState({ selectedFacets: data });
  }

  removeFacet({ facetKey, valueId }) {
    if (facetKey === 'dateBefore' || facetKey === 'dateAfter') {
      this.state.selectedFacets[facetKey] = {};
    } else {
      this.state.selectedFacets[facetKey] =
        _reject(this.state.selectedFacets[facetKey], { id: valueId });
    }
    this.setState({ selectedFacets: this.state.selectedFacets });
  }

  updatePage(page) {
    this.setState({ page });
  }

  updateSortBy(sortBy) {
    this.setState({ sortBy });
  }

  updateLoadingStatus(data) {
    this.setState({ isLoading: data });
  }

  updateField(data) {
    this.setState({ field: data });
  }

  updateForm(data) {
    this.setState({ form: data });
  }

  updateDeliveryLocations(data) {
    this.setState({ deliveryLocations: data });
  }

  updateIsEddRequestable(data) {
    this.setState({ isEddRequestable: data });
  }
}

export default alt.createStore(Store, 'Store');
