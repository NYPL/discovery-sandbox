import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateEbscoData: Actions.updateEbscoData,
      updateSearchKeywords: Actions.updateSearchKeywords,
      updateItem: Actions.updateItem,
    });

    this.state = {
      ebscodata: {},
      item: {},
      searchKeywords: '',
    };
  }

  updateEbscoData(data) {
    this.setState({ ebscodata: data });
  }

  updateItem(data) {
    this.setState({ item: data });
  }

  updateSearchKeywords(data) {
    this.setState({ searchKeywords: data });
  }
}

export default alt.createStore(Store, 'Store');
