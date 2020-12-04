import express from 'express';

import User from './User';
import Hold from './Hold';
import Search from './Search';
import Feedback from './Feedback';
import appConfig from '../../app/data/appConfig';
import SubjectHeading from './SubjectHeading';
import SubjectHeadings from './SubjectHeadings';
import dataLoaderUtil from '../../app/utils/dataLoaderUtil';
import routeMethods from './RouteMethods';

const router = express.Router();
const { routes, successCb } = dataLoaderUtil;

router
  .route(`${appConfig.baseUrl}/search`)
  .post(Search.searchServerPost);

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
  .route(`${appConfig.baseUrl}/edd`)
  .post(Hold.eddServer);

// Add the paths configured in dataLoaderUtil and RouteMethods. This covers two scenarios:
// 1. Server side navigation, the / path is hit, we directly call the relevant method
// (which is routeMethods[routeName]), load the data into the store and go to next()
// 2. Api calls, the /api/ path is hit, we simply return the data to the client (res.json)
// Then client side the dataLoaderUtil will load the response into the store

Object.keys(routes).forEach((routeName) => {
  const { path, params } = routes[routeName];
  ['/', '/api/'].forEach((pathType) => {
    const api = pathType === '/api/';
    router
      .route(`${appConfig.baseUrl}${pathType}${path}${params}`)
      .get((req, res, next) => new Promise(
        resolve => routeMethods[routeName](req, res, resolve)
      )
        .then(data => (
          api ? res.json(data) : successCb(routeName, global.store.dispatch)({ data })))
        .then(() => (api ? null : next()))
        .catch(console.error)
      );
  });
});

router
  .route(`${appConfig.baseUrl}/api/patronEligibility`)
  .get(User.eligibility);

router
  .route(`${appConfig.baseUrl}/api/subjectHeading/:subjectLiteral/`)
  .get(SubjectHeading.bibsAjax);

/**
 * This wildcard route proxies the following SHEP API routes:
 *  * /api/subjectHeadings/{UUID}/context => /api/v0.1/subject_headings/{UUID}/context
 *  * /api/subjectHeadings/{UUID}/bibs => /api/v0.1/subject_headings/{UUID}/bibs
 *  * /api/subjectHeadings/{UUID}/related => /api/v0.1/subject_headings/{UUID}/related
 */
router
  .route(`${appConfig.baseUrl}/api/subjectHeadings*`)
  .get(SubjectHeadings.proxyRequest);

router
  .route(`${appConfig.baseUrl}/api/feedback*`)
  .post(Feedback.post);

export default router;
