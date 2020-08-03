import React from 'react';
import Store from '@Store';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: Store.getState().lastLoaded,
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    Store.listen(this.onChange);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      location,
    } = nextProps;

    const {
      loaded,
    } = nextState;

    return location === loaded;
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState({
      loaded: Store.getState().lastLoaded,
    });
  }

  render() {
    return (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export default Content;
