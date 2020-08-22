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

Object.keys(routes).forEach((routeName) => {
  const { path, params } = routes[routeName];
  router
    .route(`${appConfig.baseUrl}/api/${path}${params}`)
    .get((req, res) => new Promise(
      resolve => routeMethods[routeName](req, res, resolve),
    )
      .then(data => res.json(data)),
    );

  router
    .route(`${appConfig.baseUrl}/${path}${params}`)
    .get((req, res, next) => {
      const method = routeMethods[routeName];
      return new Promise(
        resolve => method(req, res, resolve),
      )
        .then(data => successCb(routeName)({ data }))
        .then(() => next());
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
