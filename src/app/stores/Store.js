import Actions from '../actions/Actions.js';
import alt from '../alt.js';

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

  removeFacet(field) {
    this.state.selectedFacets[field] = { id: '', value: '' };
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
}

export default alt.createStore(Store, 'Store');
