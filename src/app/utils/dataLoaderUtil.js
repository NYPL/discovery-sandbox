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

const pathInstructions = [
  {
    expression: /\/research\/collections\/shared-collection-catalog\/bib\/([cp]?b\d*)/,
    pathType: 'bib',
  },
  {
    expression: /\/research\/collections\/shared-collection-catalog\/search\?(.*)/,
    pathType: 'search',
  },
  {
    expression: /\/research\/collections\/shared-collection-catalog\/hold\/request\/([^/]*)/,
    pathType: 'holdRequest',
  },
];

const routePaths = {
  bib: `${appConfig.baseUrl}/api/bib`,
  search: `${appConfig.baseUrl}/api`,
  holdRequest: `${appConfig.baseUrl}/api/hold/request/:bibId-:itemId`,
};

const routesGenerator = () => ({
  bib: {
    apiRoute: (matchData, route) => `${route}?bibId=${matchData[1]}`,
    serverParams: (matchData, req) => { req.query.bibId = matchData[1]; },
    action: updateBibPage,
    errorMessage: 'Error attempting to make an ajax request to fetch a bib record from ResultsList',
  },
  search: {
    apiRoute: (matchData, route) => `${route}?${matchData[1]}`,
    action: updateSearchResultsPage,
    errorMessage: 'Error attempting to make an ajax request to search',
  },
  holdRequest: {
    apiRoute: (matchData, route) => route.replace(':bibId-:itemId', matchData[1]),
    serverParams: (matchData, req) => {
      const params = matchData[1].match(/\w+/g);
      if (params[0]) req.params.bibId = params[0];
      if (params[1]) req.params.itemId = params[1];
    },
    action: data => updateHoldRequestPage(data),
    // [
    //   data => Actions.updateBib(data.bib),
    //   data => Actions.updateDeliveryLocations(data.deliveryLocations),
    //   data => Actions.updateIsEddRequestable(data.isEddRequestable),
    // ],
    errorMessage: 'Error attempting to make ajax request for hold request',
  },
});

const matchingPathData = (location) => {
  const {
    pathname,
    search,
  } = location;

  return pathInstructions
    .map(instruction => ({
      matchData: (pathname + search).match(instruction.expression),
      pathType: instruction.pathType,
    }))
    .find(pair => pair.matchData)
    || { matchData: null, pathType: null };
};

function loadDataForRoutes(location, req, routeMethods, realRes) {
  const routes = routesGenerator(location);
  const {
    matchData,
    pathType,
  } = matchingPathData(location);

  if (routes[pathType]) {
    const {
      apiRoute,
      action,
      errorMessage,
      serverParams,
    } = routes[pathType];
    const route = routePaths[pathType];
    console.log('apiRoute', apiRoute(matchData, route));
    dispatch(updateLoadingStatus(true));
    const successCb = (response) => {
      dispatch(action(response.data))
        .then(() => dispatch(updateLoadingStatus(false)))
    };
    const errorCb = (error) => {
      dispatch(updateLoadingStatus(false));
      console.error(
        errorMessage,
        error,
      );
    };
    if (req) {
      if (serverParams) serverParams(matchData, req);
      return new Promise((resolve) => {
        const res = {
          redirect: url => realRes.redirect(url),
          json: (data) => {
            resolve({ data });
          },
        };
        routeMethods[pathType](req, res);
      })
        .then(({ data }) => {
          realRes.data = { ...data }
          return realRes;
        })
        .catch(errorCb);
    }
    return ajaxCall(apiRoute(matchData, route), successCb, errorCb);
  }
}

export default {
  loadDataForRoutes,
  routePaths,
};
