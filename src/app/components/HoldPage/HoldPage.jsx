import React from 'react';

import Store from '../../stores/Store.js';


/**
 * The main container for the top Search section.
 */
class HoldPage extends React.Component {
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
    return (
      <div className="container holds-container">
        Holds Page
      </div>
    );
  }
}

export default HoldPage;
