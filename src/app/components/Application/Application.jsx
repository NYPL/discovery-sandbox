import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

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

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

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
