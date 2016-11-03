import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateEbscoData: Actions.updateEbscoData,
      updateSearchResults: Actions.updateSearchResults,
      updateSearchKeywords: Actions.updateSearchKeywords,
      updateItem: Actions.updateItem,
      updateFacets: Actions.updateFacets,
    });

    this.state = {
      ebscodata: {},
      searchResults: {},
      item: {},
      searchKeywords: '',
      facets: {},
    };
  }

  updateEbscoData(data) {
    this.setState({ ebscodata: data });
  }

  updateSearchResults(data) {
    this.setState({ searchResults: data });
  }

  updateSearchKeywords(data) {
    this.setState({ searchKeywords: data });
  }

  updateItem(data) {
    this.setState({ item: data });
  }

  updateFacets(data) {
    this.setState({ facets: data });
  }
}

export default alt.createStore(Store, 'Store');
