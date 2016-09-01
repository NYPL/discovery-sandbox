import React from 'react';

import { Header, navConfig } from 'dgx-header-component';
import Footer from 'dgx-react-footer';

import Search from '../Search/Search.jsx';

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

        <Search />

        <Footer />
      </div>
    );
  }
}

export default App;
