import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Search from '../Search/Search.jsx';

import Store from '../../stores/Store.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = Store.getState();
    this.onChange = this.onChange.bind(this);
  }


  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentDidUnMount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(Store.getState());
  }

  render() {
    let breadcrumbs = null;

    if (this.state.searchKeywords) {
       breadcrumbs = (
        <div className="page-header">
          <div className="container">
            <Breadcrumbs query={this.state.searchKeywords} />
          </div>
        </div>
      );
    }

    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

        <div className="search-container">
          <Search />
        </div>

        {breadcrumbs}

        {this.props.children}

        <Footer />
      </div>
    );
  }
}

export default App;
