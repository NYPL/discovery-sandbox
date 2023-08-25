import axios from 'axios';

import nyplApiClient from '../routes/nyplApiClient';
import User from './User';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import { defaultHtml, preprocessAccountHtml } from '../../app/utils/accountPageUtils';

const nyplApiClientGet = endpoint => (
  nyplApiClient()
    .then(client => client.get(endpoint, { cache: false }))
);

function getHomeLibrary (code) {
  return nyplApiClientGet(`/locations?location_codes=${code}`)
    .then((resp) => {
      if (!resp || !resp[code] || !resp[code][0] || !resp[code][0].label) return { code };
      return {
        code,
        label: resp[code][0].label,
      };
    })
    .catch((error) => {
      console.error(error);
      return { code };
    });
}

function getAccountPage (res, req) {
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';
  const urlPathParams = appConfig.sierraUpgradeAugust2023 ?
    `/patroninfo/${patronId}/${content}` :
    `/dp/patroninfo*eng~Sdefault/${patronId}/${content}`
  return axios.get(appConfig.webpacBaseUrl + urlPathParams, {
    headers: {
      Cookie: req.headers.cookie,
    },
  });
}

function fetchAccountPage (req, res, resolve) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) {
    resolve({ redirect });
    return;
  }

  const content = req.params.content || 'items';
  // no need to fetch from Webpac for this tab
  if (content === 'settings') {
    const patron = req.store.getState().patron;
    if (patron.homeLibraryCode && !patron.homeLibraryName) {
      getHomeLibrary(patron.homeLibraryCode)
        .then((resp) => {
          resolve({
            patron: {
              ...patron,
              homeLibraryName: resp.label,
            },
            accountHtml: {}
          });
        });
      return;
    }
    resolve({ patron, accountHtml: {} });

    return;
  }

  if (!['items', 'holds', 'overdues'].includes(content)) {
    res.redirect(`${appConfig.baseUrl}/account`);
    return;
  }


  getAccountPage(res, req)
    .then((resp) => {
      // If Header thinks patron is logged in,
      // but patron is not actually logged in, the case below is hit
      if (resp.request && resp.request.path && resp.request.path.includes('/login?')) {
        // need to implement
        console.log('Encountered login redirect while fetching account page');
        throw new Error('detected state mismatch, throwing error');
      }

      resolve({ accountHtml: preprocessAccountHtml(resp.data) });
    })
    .catch((resp) => {
      console.error('Account page response error: ', resp);
      resolve({ accountHtml: defaultHtml });
    });
}

function postToAccountPage (req, res) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) res.json({ redirect });
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';
  const reqBodyString = Object.keys(req.body).map(key => `${key}=${req.body[key]}`).join('&');
  const urlPathParams = appConfig.sierraUpgradeAugust2023 ?
    `/patroninfo/${patronId}/${content}` :
    `/dp/patroninfo*eng~Sdefault/${patronId}/${content}`
  axios.post(
    appConfig.webpacBaseUrl + urlPathParams,
    reqBodyString, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then(resp => res.json(resp.data))
    .catch(resp => res.json({ error: resp }));
}

function logError (req) {
  logger.error('Account Error', req.url.replace(/\w+:\/\//g, ''));
}

export default {
  fetchAccountPage,
  postToAccountPage,
  getHomeLibrary,
  logError,
};
