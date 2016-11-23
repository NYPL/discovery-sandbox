import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class PatronStore {
  constructor() {
    this.bindListeners({
      updatePatronData: Actions.updatePatronData,
    });

    this.state = {
      patronData: {},
    };
  }

  updatePatronData(data) {
    this.setState({ patronData: data });
  }
}

export default alt.createStore(PatronStore, 'PatronStore');
