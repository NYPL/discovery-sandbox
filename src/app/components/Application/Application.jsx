import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Store from '../../stores/Store.js';
import PatronData from '../../stores/PatronData.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Store.getState(),
      patron: PatronData.getState(),
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  onChange() {
    this.setState({ data: Store.getState() });
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  render() {
    return (
      <div className="app-wrapper">
        <Header navData={navConfig.current} />

        {React.cloneElement(this.props.children, this.state.data)}

        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

export default App;
