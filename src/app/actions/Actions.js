// ACTIONS
import alt from 'dgx-alt-center';

class Actions {
  updateAngularApps(data) {
    this.dispatch(data);
  }

  updateReactApps(data) {
    this.dispatch(data);
  }
}

export default alt.createActions(Actions);
