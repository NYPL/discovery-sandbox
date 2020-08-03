import React from 'react';
import PropTypes from 'prop-types';
import dataLoaderUtil from '@dataLoaderUtil';
import Content from '../Content/Content';
import Store from '../../stores/Store';

class DataLoader extends React.Component {
  componentDidMount() {
    const lastLoaded = Store.getState().lastLoaded;
    const { location } = this.props;
    const relevantFields = ['pathname', 'query', 'search'];
    if (relevantFields.some(field =>
      JSON.stringify(lastLoaded[field]) !== JSON.stringify(location[field]))
    ) {
      dataLoaderUtil.loadDataForRoutes(location);
    }
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
