import Actions from '../actions/Actions';
import alt from '../alt';

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
      loggedIn: false,
    };
  }

  updatePatronData(data) {
    this.setState({
      id: data.id,
      names: data.names,
      barcodes: data.barcodes,
      emails: data.emails,
      loggedIn: true,
    });
  }
}

export default alt.createStore(PatronStore, 'PatronStore');
