import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import SearchResultsPage from '../SearchResultsPage/SearchResultsPage.jsx';

import Store from '../../stores/Store.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = Store.getState();
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

        <SearchResultsPage />

        <Footer />
      </div>
    );
  }
}

export default App;
