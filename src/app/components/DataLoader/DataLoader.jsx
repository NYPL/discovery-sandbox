import React from 'react';
import PropTypes from 'prop-types';
import Store from '@Store';
import loadDataForRoutes from '@dataLoaderUtil';

class DataLoader extends React.Component {

  componentDidMount() {
    const {
      location,
    } = this.props;

    if (Store.getState().lastLoadedPage !== location.pathname) {
      console.log('DataLoader location: ', location);
      loadDataForRoutes(location);
    }
  }

  render() {
    return (
      <React.Fragment>{this.props.children}</React.Fragment>
    );
  }
}

export default DataLoader;
