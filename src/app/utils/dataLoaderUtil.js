import Actions from '@Actions';
import { ajaxCall } from '@utils';
import appConfig from '@appConfig';
import Bib from '../../server/ApiRoutes/Bib';
import Hold from '../../server/ApiRoutes/Hold';
import Search from '../../server/ApiRoutes/Search';
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

const routeConfig = {
  bib: {
    route: `${appConfig.baseUrl}/api/bib`,
    method: Bib.bibSearchAjax,
  },
  search: {
    route: `${appConfig.baseUrl}/api`,
    method: Search.searchAjax,
  },
  holdRequest: {
    route: `${appConfig.baseUrl}/api/hold/request/:bibId-:itemId`,
    method: Hold.newHoldRequestAjax,
  },
};

const routesGenerator = location => ({
  bib: {
    apiRoute: (matchData, route) => `${route}?bibId=${matchData[1]}`,
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
      () => {
        const {
          sort,
          sort_direction,
        } = location.query;
        Actions.updateSortBy(`${sort}_${sort_direction}`);
      },
    ],
    errorMessage: 'Error attempting to make an ajax request to search',
  },
  holdRequest: {
    apiRoute: (matchData, route) => route.replace(':bibId-itemId', matchData[1]),
    actions: [
      data => Actions.updateBib(data.bib),
      data => Actions.updateDeliveryLocations(data.deliveryLocations),
      data => Actions.updateIsEddRequestable(data.isEddRequestable),
    ],
    errorMessage: 'Error attempting to make ajax request for hold request',
  },
});

const reducePathExpressions = location => (acc, instruction) => {
  const {
    pathname,
    search,
  } = location;

  const {
    matchData,
    pathType,
  } = acc;

  const newMatchData = (pathname + search).match(instruction.expression);
  return {
    matchData: matchData || newMatchData,
    pathType: pathType || (newMatchData ? instruction.pathType : null),
  };
};

function loadDataForRoutes(location, req) {
  const routes = routesGenerator(location);
  const {
    matchData,
    pathType,
  } = pathInstructions
    .reduce(reducePathExpressions(location), { matchData: null, pathType: null });

  if (routes[pathType]) {
    const {
      apiRoute,
      actions,
      errorMessage,
    } = routes[pathType];
    const {
      route,
      method,
    } = routeConfig[pathType];
    Actions.updateLoadingStatus(true);
    console.log('ajaxCall: ', pathType, apiRoute(matchData, route));
    const successCb = (response) => {
      console.log('api response: ', typeof response.data === 'object' ? response.data : typeof response.data);
      actions.forEach(action => action(response.data));
      console.log('Store: ', Store.getState());
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
      return new Promise((resolve) => {
        const res = {
          json: (data) => {
            resolve({ data });
          },
        };
        method(req, res);
      })
        .then(successCb)
        .catch(errorCb);
    }
    return ajaxCall(apiRoute(matchData, route), successCb, errorCb);
  }

  return new Promise(resolve => resolve());
}

console.log('dataLoader routeConfig: ', routeConfig);

export {
  loadDataForRoutes,
  routeConfig,
};
