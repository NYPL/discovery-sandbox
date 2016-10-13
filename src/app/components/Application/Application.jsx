import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

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

  onChange() {
    this.setState(Store.getState());
  }

  componentDidUnMount() {
    Store.unlisten(this.onChange);
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

        <div className="search-container">
          <Search />
        </div>

        {React.cloneElement(this.props.children, this.state)}

        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

export default App;
