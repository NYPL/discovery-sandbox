import alt from '../alt';
import appConfig from '@appConfig';

class AppConfigStore {
  constructor() {
    this.state = appConfig;
  }
}

export default alt.createStore(AppConfigStore, 'AppConfigStore');
