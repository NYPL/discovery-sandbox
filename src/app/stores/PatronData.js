import alt from '../alt.js';

class PatronData {
  constructor() {
    this.bindListeners({
      // updateEbscoData: Actions.updateEbscoData,
    });

    this.state = {
      patronData: {},
    };
  }

}

export default alt.createStore(PatronData, 'patronData');
