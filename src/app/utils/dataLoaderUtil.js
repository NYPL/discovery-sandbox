import Actions from '@Actions';
import { ajaxCall, destructureFilters } from '@utils';
import { pick as _pick } from 'underscore';
import appConfig from '@appConfig';
import Store from '@Store';

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

const routesGenerator = location => ({
  bib: {
    apiRoute: (matchData, route) => `${route}?bibId=${matchData[1]}`,
    serverParams: (matchData, req) => { req.query.bibId = matchData[1]; },
    actions: [Actions.updateBib],
    errorMessage: 'Error attempting to make an ajax request to fetch a bib record from ResultsList',
  },
  search: {
    apiRoute: (matchData, route) => `${route}?${matchData[1]}`,
    actions: [
      data => Actions.updateSearchResults(data.searchResults),
      () => Actions.updatePage(location.query.page || 1),
      () => Actions.updateSearchKeywords(location.query.q),
      data => Actions.updateFilters(data.filters),
      (data) => {
        if (data.filters && data.searchResults) {
          const unescapedQuery = Object.assign(
            {},
            ...Object.keys(location.query)
              .map(k => ({ [decodeURIComponent(k)]: decodeURIComponent(location.query[k]) })),
          );
          const urlFilters = _pick(unescapedQuery, (value, key) => {
            if (key.indexOf('filter') !== -1) {
              return value;
            }
            return null;
          });
          Actions.updateSelectedFilters(destructureFilters(urlFilters, data.filters));
        }
      },
      () => {
        const {
          sort,
          sort_direction,
        } = location.query;

        Actions.updateSortBy([sort, sort_direction].filter(field => field).join('_'));
      },
    ],
    errorMessage: 'Error attempting to make an ajax request to search',
  },
  holdRequest: {
    apiRoute: (matchData, route) => route.replace(':bibId-:itemId', matchData[1]),
    serverParams: (matchData, req) => {
      const params = matchData[1].match(/\w+/g);
      console.log('params: ', params[0], params[1]);
      if (params[0]) req.params.bibId = params[0];
      if (params[1]) req.params.itemId = params[1];
    },
    actions: [
      data => Actions.updateBib(data.bib),
      data => Actions.updateDeliveryLocations(data.deliveryLocations),
      data => Actions.updateIsEddRequestable(data.isEddRequestable),
    ],
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

function loadDataForRoutes(location, req, routeMethods) {
  const routes = routesGenerator(location);
  const {
    matchData,
    pathType,
  } = matchingPathData(location);

  if (routes[pathType]) {
    const {
      apiRoute,
      actions,
      errorMessage,
      serverParams,
    } = routes[pathType];
    const route = routePaths[pathType];
    Actions.updateLoadingStatus(true);
    const successCb = (response) => {
      actions.forEach(action => action(response.data));
      Actions.updateLoadingStatus(false);
    };
    const errorCb = (error) => {
      Actions.updateLoadingStatus(false);
      console.error(
        errorMessage,
        error,
      );
    };
    if (req) {
      if (serverParams) serverParams(matchData, req);
      return new Promise((resolve) => {
        const res = {
          json: (data) => {
            resolve({ data });
          },
        };
        routeMethods[pathType](req, res);
      })
        .then(successCb)
        .catch(errorCb);
    }
    return ajaxCall(apiRoute(matchData, route), successCb, errorCb);
  }

  return new Promise(resolve => resolve());
}

export default {
  loadDataForRoutes,
  routePaths,
};
