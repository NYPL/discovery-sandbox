import BookActions from '../actions/Actions.js';
import alt from '../alt.js';

class Store {
  constructor() {
    this.bindListeners({
      updateAngularApps: BookActions.UPDATE_ANGULAR_APPS,
    });

    this.on('init', () => {
      this._angularApps = [];
    });
  }

  updateAngularApps(data) {
    this._angularApps = data;
  }
}

export default alt.createStore(Store, 'Store');
