import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dataLoaderUtil from '@dataLoaderUtil';


// The sole responsibility of the DataLoader is to trigger a data reload whenever
// the location changes.

class DataLoader extends React.Component {
  componentDidMount() {
    const { location, dispatch } = this.props;
    dataLoaderUtil.loadDataForRoutes(location, dispatch);
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

export default connect()(DataLoader);
