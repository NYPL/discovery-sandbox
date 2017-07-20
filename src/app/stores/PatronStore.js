import Actions from '../actions/Actions.js';
import alt from '../alt.js';

class PatronStore {
  constructor() {
    this.bindListeners({
      updatePatronData: Actions.updatePatronData,
    });

    this.state = {
      id: '',
      names: [],
      barcodes: [],
      emails: [],
    };
  }

  updatePatronData(data) {
    this.setState({
      id: data.id,
      names: data.names,
      barcodes: data.barcodes,
      emails: data.emails,
    });
  }
}

export default alt.createStore(PatronStore, 'PatronStore');
