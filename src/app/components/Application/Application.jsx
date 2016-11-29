import React from 'react';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Feedback from '../Feedback/Feedback.jsx';
import Store from '../../stores/Store.js';
import PatronStore from '../../stores/PatronStore.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
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
        <Header navData={navConfig.current} skipNav={{ target: 'mainContent' }} />

        <div className="container">{this.state.patron.names[0]}</div>

        {React.cloneElement(this.props.children, this.state.data)}

        <Footer />

        <Feedback />
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.object,
};

export default App;
