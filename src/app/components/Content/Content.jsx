import React from 'react';

class Content extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      location,
      loaded,
    } = nextProps;
    console.log('Content: ', location, loaded, location === loaded);
    return location === loaded;
  }
  render() {
    return (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export default Content;
