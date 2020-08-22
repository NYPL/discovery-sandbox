import { ajaxCall } from '@utils';
import {
  updateBibPage,
  updateSearchResultsPage,
  updateHoldRequestPage,
  updateLoadingStatus,
} from '@Actions';
import appConfig from '@appConfig';
import store from '../stores/Store';

const { dispatch } = store;


const baseUrl = appConfig.baseUrl;

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
};

function loadDataForRoutes(location, req, routeMethods, realRes) {
  const { pathname } = location;

  let pathType;
  let matchingAction;

  Object.entries(routes).forEach(([pathKey, pathValue]) => {
    const { action, path } = pathValue;
    if (pathname.match(`${baseUrl}/${path}`)) {
      pathType = pathKey;
      matchingAction = action;
    }
  });

  if (!pathType) return new Promise(resolve => resolve());

  const successCb = (response) => {
    dispatch(matchingAction(response.data, location));
  };

  const errorCb = (error) => {
    console.error(
      `Error attempting to make ajax request for ${pathType}`,
      error,
    );
  };

  if (req) {
    console.log('making server side call', routes[pathType], req.params, req.serverParams);
    req.params = Object.assign(req.serverParams, req.params);
    const res = resolve => ({
      redirect: url => realRes.redirect(url),
      json: (data) => {
        resolve({ data });
      },
    });

    return new Promise(resolve =>
      routeMethods[pathType](req, res(resolve)),
    )
      .then(successCb)
      .catch(errorCb);
  }

  return ajaxCall(location.pathname.replace(baseUrl, `${baseUrl}/api`) + location.search, successCb, errorCb);
}

export default {
  loadDataForRoutes,
  routes,
};
