import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Search from '../Search/Search.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

        <div className="search-container">
          <Search />
        </div>

        {this.props.children}

        <Footer />
      </div>
    );
  }
}

export default App;
