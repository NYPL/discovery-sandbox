import Actions from '@Actions';
import { ajaxCall, destructureFilters } from '@utils';
import { pick as _pick } from 'underscore';
import appConfig from '@appConfig';

const pathInstructions = [
  {
    expression: 'bib/:bibId',
    pathType: 'bib',
  },
  {
    expression: 'search',
    pathType: 'search',
  },
  {
    expression: 'hold/request/:bibId-:itemId',
    pathType: 'holdRequest',
  },
];

const pathExpressions = pathInstructions.map(({ expression, pathType }) => (
  {
    expression: `${appConfig.baseUrl}/${expression.replace(/:\w*/, '\\w*')}`,
    pathType,
  }
));

const routesGenerator = location => ({
  bib: {
    actions: [Actions.updateBib],
  },
  search: {
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
      (data) => {
        if (data.drbbResults) Actions.updateDrbbResults(data.drbbResults);
      },
    ],
  },
  holdRequest: {
    actions: [
      data => Actions.updateBib(data.bib),
      data => Actions.updateDeliveryLocations(data.deliveryLocations),
      data => Actions.updateIsEddRequestable(data.isEddRequestable),
    ],
  },
});

function loadDataForRoutes(location, req, routeMethods) {
  const {
    pathname,
    search,
  } = location;
  const routes = routesGenerator(location);
  const fullPath = pathname + search;
  pathExpressions.forEach(({ expression, pathType }) => {
    if (fullPath.match(expression)) {
      const {
        actions,
      } = routes[pathType];
      Actions.updateLoadingStatus(true);
      const successCb = (response) => {
        actions.forEach(action => action(response.data));
        Actions.updateLoadingStatus(false);
      };
      const errorCb = (error) => {
        Actions.updateLoadingStatus(false);
        console.error(
          `Error fetching data for ${pathType}`,
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
          routeMethods[pathType](req, res);
        })
          .then(successCb)
          .catch(errorCb);
      }
      return ajaxCall(
        fullPath.replace(`${appConfig.baseUrl}`, `${appConfig.baseUrl}/api`),
        successCb,
        errorCb,
      );
    }
  });

  return new Promise(resolve => resolve());
}

export default {
  loadDataForRoutes,
  pathInstructions,
};
