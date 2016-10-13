// ACTIONS
import alt from '../alt.js';
import modelEbsco from '../utils/model.js';

class Actions {
  updateEbscoData(data) {
    return modelEbsco.build(data);
  }

  updateSearchKeywords(data) {
    return data;
  }

  updateItem(data) {
    return data;
  }
}

export default alt.createActions(Actions);
