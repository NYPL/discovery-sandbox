import React from 'react';
import PropTypes from 'prop-types';
import dataLoaderUtil from '@dataLoaderUtil';

class DataLoader extends React.Component {

  componentDidMount() {
    dataLoaderUtil.loadDataForRoutes(this.props.location);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default DataLoader;
