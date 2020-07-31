import React from 'react';
import PropTypes from 'prop-types';
import dataLoaderUtil from '@dataLoaderUtil';
import Content from '../Content/Content';

class DataLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: null,
    };
    this.updateState = this.updateState.bind(this);
  }

  componentDidMount() {
    dataLoaderUtil.loadDataForRoutes(this.props.location, null, null, null, this.updateState);
  }

  updateState(loaded) {
    this.setState({
      loaded,
    });
  }

  render() {
    console.log('updated: ', this.state, 'location: ', this.props.location, this.props.location === this.state.loaded);
    return (
      <Content
        location={this.props.location}
        loaded={this.state.loaded}
      >
        <React.Fragment>{this.props.children}</React.Fragment>
      </Content>
    );
  }
}

DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default DataLoader;
