import { ajaxCall } from '@utils';
import {
  updateBibPage,
  updateSearchResultsPage,
  updateHoldRequestPage,
  resetState,
} from '@Actions';
import appConfig from '@appConfig';
import { updateLoadingStatus } from '../actions/Actions';

const baseUrl = appConfig.baseUrl;

// For each named route type, we need to know what path corresponds to that route,
// which action to use to load that data when it is received, and which params
// are required in the relevant routes.
// Note that the path is used in two places: 1. Frontend routes and 2. ApiRoutes, and
// the only difference is the addition of /api/ in the route.

const routes = {
  bib: {
    action: updateBibPage,
    path: 'bib',
    params: '/:bibId',
  },
  search: {
    action: updateSearchResultsPage,
    path: 'search',
    params: '',
  },
  holdRequest: {
    action: updateHoldRequestPage,
    path: 'hold/request',
    params: '/:bibId-:itemId',
  },
  home: {
    action: resetState,
    path: '',
  },
};

// A simple function for loading data into the store. The only reason it is broken
// out separately is because it is used front-end and back-end

const successCb = (pathType, dispatch) => (response) => {
  dispatch(routes[pathType].action(response.data));
};


// This function is called only on the front end, by the DataLoader, when a location changes.
// Its sole responsibility is to check if any of the configured paths match
// the current location, and if so, make an api call and pass the resulting data
// on. Note that it makes use of the fact that now for every frontend route, the
// corresponding api route can be found simply by adding /api/

function loadDataForRoutes(location, dispatch) {
  const { pathname } = location;

  const matchingPath = Object.entries(routes).find(([pathKey, pathValue]) => {
    const { path } = pathValue;
    return pathname.match(`${baseUrl}/${path}`);
  });

  if (!matchingPath) return new Promise(resolve => resolve());

  const pathType = matchingPath[0];

  const errorCb = (error) => {
    console.error(
      `Error attempting to make ajax request for ${pathType}`,
      error,
    );
  };
  dispatch(updateLoadingStatus(true));

  return ajaxCall(
    location.pathname.replace(baseUrl, `${baseUrl}/api`) + location.search,
    successCb(pathType, dispatch),
    errorCb,
  );
}

export default {
  loadDataForRoutes,
  routes,
  successCb,
};
