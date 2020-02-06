import React from 'react';

class Content extends React.Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <React.Fragment>
        { this.props.component }
      </React.Fragment>
    );
  }
}

export default Content;
