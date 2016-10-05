import React from 'react';

import Store from '../../stores/Store.js';

class HoldPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = Store.getState();
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
