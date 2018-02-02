import express from 'express';

import Bib from './Bib';
import Hold from './Hold';
import Search from './Search';
import appConfig from '../../../appConfig';

const router = express.Router();

function MainApp(req, res, next) {
  res.locals.data.Store = {
    searchResults: {},
    selectedFilters: {},
    searchKeywords: '',
    filters: {},
    page: '1',
    sortBy: 'relevance',
    field: 'all',
    error: {},
    isLoading: false,
  };

  next();
}

router
  .route(`${appConfig.baseUrl}/search`)
  .get(Search.searchServer)
  .post(Search.searchServerPost);

router
  .route(`${appConfig.baseUrl}/advanced`)
  .get(Search.searchServer);

router
  .route(`${appConfig.baseUrl}/hold/request/:bibId-:itemId`)
  .get(Hold.newHoldRequestServer);

router
  .route(`${appConfig.baseUrl}/hold/request/:bibId-:itemId-:itemSource`)
  .post(Hold.createHoldRequestServer);

router
  .route(`${appConfig.baseUrl}/hold/request/:bibId-:itemId/edd`)
  .get(Hold.newHoldRequestServerEdd);

router
  .route(`${appConfig.baseUrl}/hold/confirmation/:bibId-:itemId`)
  .get(Hold.confirmRequestServer);

router
  .route(`${appConfig.baseUrl}/bib/:bibId`)
  .get(Bib.bibSearchServer);

router
  .route(`${appConfig.baseUrl}/bib/:bibId/all`)
  .get(Bib.bibSearchServer);

router
  .route(`${appConfig.baseUrl}/edd`)
  .post(Hold.eddServer);

router
  .route(`${appConfig.baseUrl}/api`)
  .get(Search.searchAjax);

router
  .route(`${appConfig.baseUrl}/api/bib`)
  .get(Bib.bibSearchAjax);

router
  .route(`${appConfig.baseUrl}/api/hold/request/:bibId-:itemId`)
  .get(Hold.newHoldRequestAjax);

router
  .route(`${appConfig.baseUrl}/api/newHold`)
  .get(Hold.createHoldRequestAjax)
  .post(Hold.createHoldRequestEdd);

router
  .route(appConfig.baseUrl)
  .get(MainApp);

router
  .route('/')
  .get(MainApp);

export default router;
