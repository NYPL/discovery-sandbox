import { ajaxCall } from '@utils';
import {
  updateBibPage,
  updateSearchResultsPage,
  updateHoldRequestPage,
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

const successCb = pathType => (response) => {
  dispatch(routes[pathType].action(response.data));
};

function loadDataForRoutes(location) {
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
    successCb(pathType),
    errorCb,
  );
}

export default {
  loadDataForRoutes,
  routes,
  successCb,
};
