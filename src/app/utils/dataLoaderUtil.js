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

const routePaths = {
  bib: `${appConfig.baseUrl}/api/bib/:bibId`,
  search: `${appConfig.baseUrl}/api/search`,
  holdRequest: `${appConfig.baseUrl}/api/hold/request/:bibId-:itemId`,
};

const routesGenerator = () => ({
  bib: {
    action: updateBibPage,
  },
  search: {
    action: updateSearchResultsPage,
  },
  holdRequest: {
    action: updateHoldRequestPage,
  },
});

const matchingPathData = (location) => {
  const {
    pathname,
    search,
  } = location;

  console.log('entries: ', Object.entries(routePaths));
  return Object.entries(routePaths)
    .map(([pathType, path]) => {
      console.log(pathType, path, typeof path);
      return {
        matchData: (pathname + search).match(new RegExp(path.replace(/:.*/, '').replace(/\/api/, ''))),
        pathType,
      };
    })
    .find(pair => pair.matchData)
    || { matchData: null, pathType: null };
};

function loadDataForRoutes(location, req, routeMethods, realRes) {
  const routes = routesGenerator(location);
  const {
    pathType,
  } = matchingPathData(location);

  if (routes[pathType]) {
    const {
      action,
    } = routes[pathType];
    const successCb = (response) => {
      dispatch(action(response.data, location));
    };
    const errorCb = (error) => {
      console.error(
        `Error attempting to make ajax request for ${routes[pathType]}`,
        error,
      );
    };
    if (req) {
      console.log('making server side call', routes[pathType], req.params, req.serverParams);
      req.params = Object.assign(req.serverParams, req.params);
      return new Promise((resolve) => {
        const res = {
          redirect: url => realRes.redirect(url),
          json: (data) => {
            resolve({ data });
          },
        };
        return routeMethods[pathType](req, res);
      })
        .then(successCb)
        .catch(errorCb);
    }
    const baseUrl = appConfig.baseUrl;
    // console.log('making ajaxCall', location, 'route ', location.pathname.replace(baseUrl, `${baseUrl}/api`));
    // return ajaxCall(apiRoute(matchData, route), successCb, errorCb);
    return ajaxCall(location.pathname.replace(baseUrl, `${baseUrl}/api`) + location.search, successCb, errorCb);
  }
  return new Promise(resolve => resolve());
}

export default {
  loadDataForRoutes,
  routePaths,
};
