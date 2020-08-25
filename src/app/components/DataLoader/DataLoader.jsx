import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dataLoaderUtil from '@dataLoaderUtil';
import {
  updateLoadingStatus,
  updateLastLoaded,
} from '../../actions/Actions';

// The sole responsibility of the DataLoader is to trigger a data reload whenever
// the location changes.

class DataLoader extends React.Component {
  componentDidMount() {
    const { location, dispatch, lastLoaded } = this.props;
    const {
      search,
      pathname,
    } = location;
    if (lastLoaded === `${pathname}${search}`) return;
    dataLoaderUtil.loadDataForRoutes(location, dispatch)
      .then(() => {
        dispatch(updateLastLoaded(`${pathname}${search}`));
        dispatch(updateLoadingStatus(false));
      });
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

DataLoader.propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  children: PropTypes.element,
  lastLoaded: PropTypes.string,
};

DataLoader.contextTypes = {
  router: PropTypes.object,
};

export default connect(({ lastLoaded }) => ({ lastLoaded }))(DataLoader);
