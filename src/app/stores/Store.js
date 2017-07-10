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
      updateSpinner: Actions.updateSpinner,
      updateField: Actions.updateField,
      updateForm: Actions.updateForm,
    });

    this.state = {
      searchResults: {},
      bib: {},
      searchKeywords: '',
      facets: {},
      selectedFacets: {},
      page: '1',
      sortBy: 'relevance',
      spinning: false,
      field: 'all',
      error: {},
      form: {},
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

  updateSpinner(data) {
    this.setState({ spinning: data });
  }

  updateField(data) {
    this.setState({ field: data });
  }

  updateForm(data) {
    this.setState({ form: data });
  }
}

export default alt.createStore(Store, 'Store');
