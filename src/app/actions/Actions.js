// ACTIONS
import alt from '../alt.js';

class Actions {
  updateAngularApps(data) {
    this.dispatch(data);
  }
}

export default alt.createActions(Actions);
