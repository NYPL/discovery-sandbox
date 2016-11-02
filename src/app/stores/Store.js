import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateEbscoData: Actions.updateEbscoData,
      updateSearchResults: Actions.updateSearchResults,
      updateSearchKeywords: Actions.updateSearchKeywords,
      updateItem: Actions.updateItem,
    });

    this.state = {
      ebscodata: {},
      searchResults: {},
      item: {},
      searchKeywords: '',
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
}

export default alt.createStore(Store, 'Store');
