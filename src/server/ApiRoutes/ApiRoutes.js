import express from 'express';

import Bib from './Bib.js';
import Hold from './Hold.js';
import Search from './Search.js';
import appConfig from '../../../appConfig.js';

const router = express.Router();

function MainApp(req, res, next) {
  res.locals.data.Store = {
    searchResults: {},
    selectedFacets: {},
    searchKeywords: '',
    facets: {},
    page: '1',
    sortBy: 'relevance',
    field: 'all',
    error: {},
  };

  next();
}

router
  .route(`${appConfig.baseUrl}/search`)
  .get(Search.searchServer);

router
  .route('/search')
  .post(Search.searchServerPost);

router
  .route(`${appConfig.baseUrl}/advanced`)
  .get(Search.searchServer);

router
  .route(`${appConfig.baseUrl}/hold/request/:bibId-:itemId`)
  .get(Hold.newHoldRequestServer);

router
  .route('/hold/request/:bibId-:itemId-:itemSource')
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
  .route('/edd')
  .post(Hold.eddServer);

router
  .route('/api')
  .get(Search.searchAjax);

router
  .route('/api/bib')
  .get(Bib.bibSearchAjax);

router
  .route('/api/hold/request/:bibId-:itemId')
  .get(Hold.newHoldRequestAjax);

router
  .route('/api/newHold')
  .get(Hold.createHoldRequestAjax)
  .post(Hold.createHoldRequestEdd);

router
  .route(appConfig.baseUrl)
  .get(MainApp);

router
  .route('/')
  .get(MainApp);

export default router;
