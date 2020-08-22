import { ajaxCall } from '@utils';
import {
  updateBibPage,
  updateSearchResultsPage,
  updateHoldRequestPage,
} from '@Actions';
import appConfig from '@appConfig';

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

const successCb = (pathType, dispatch) => (response) => {
  dispatch(routes[pathType].action(response.data));
};

function loadDataForRoutes(location, dispatch) {
  const { pathname } = location;

  const matchingPath = Object.entries(routes).find(([pathKey, pathValue]) => {
    const { path } = pathValue;
    return pathname.match(`${baseUrl}/${path}`);
  });

  if (!matchingPath) return null;

  const pathType = matchingPath[0];

  const errorCb = (error) => {
    console.error(
      `Error attempting to make ajax request for ${pathType}`,
      error,
    );
  };

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
