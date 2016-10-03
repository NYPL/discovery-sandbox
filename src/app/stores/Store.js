import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateEbscoData: Actions.updateEbscoData,
      updateSearchKeywords: Actions.updateSearchKeywords,
    });

    this.state = {
      ebscodata: {},
      searchKeywords: '',
    };
  }

  updateEbscoData(data) {
    this.setState({ ebscodata: data });
  }

  updateSearchKeywords(data) {
    this.setState({ searchKeywords: data });
  }
}

export default alt.createStore(Store, 'Store');
