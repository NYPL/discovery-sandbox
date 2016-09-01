import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateEbscoData: Actions.updateEbscoData,
    });

    // this.on('init', () => {
    //   this.ebscodata = {};
    // });
    this.state = {
      ebscodata: {}
    };
  }

  updateEbscoData(data) {
    this.setState({ ebscodata: data });
  }
}

export default alt.createStore(Store, 'Store');
