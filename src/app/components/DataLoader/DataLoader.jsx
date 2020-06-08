import React from 'react';
import PropTypes from 'prop-types';
import { loadDataForRoutes } from '@dataLoaderUtil';

class DataLoader extends React.Component {

  componentDidMount() {
    loadDataForRoutes(this.props.location);
  }

  render() {
    return (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default DataLoader;
