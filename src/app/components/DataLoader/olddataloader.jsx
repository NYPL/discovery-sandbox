



// import { useEffect } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import dataLoaderUtil from '@dataLoaderUtil';
// import {
//   updateLoadingStatus,
// } from '../../actions/Actions';

// // The sole responsibility of the DataLoader is to trigger a data reload whenever
// // the location changes.

// const DataLoader = ({ location, dispatch, lastLoaded, children }) => {
//   const {
//     search,
//     pathname,
//   } = location;
//   // const nextPage = `${pathname}${search}`;
//   // const isItemFiltering = pathname === lastLoaded.split('?')[0] && pathname.includes('/bib/');
//   // if (lastLoaded === nextPage || isItemFiltering) {
//   //   dispatch(updateLoadingStatus(false));
//   //   return null;
//   // }
//   useEffect(() => {
//     console.log({ location })
//     dataLoaderUtil.loadDataForRoutes(location, dispatch);
//   }, [location])

//   return (
//     <React.Fragment>
//       {children}
//     </React.Fragment>
//   );
// }

// DataLoader.propTypes = {
//   location: PropTypes.object,
//   dispatch: PropTypes.func,
//   children: PropTypes.element,
//   // lastLoaded: PropTypes.string,
// };

// export default DataLoader
// // export default connect(({ lastLoaded }) => ({ lastLoaded }))(DataLoader);
