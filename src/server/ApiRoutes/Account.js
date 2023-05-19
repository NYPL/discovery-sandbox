import axios from 'axios';

import nyplApiClient from '../routes/nyplApiClient';
import User from './User';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';

const nyplApiClientGet = endpoint => (
  nyplApiClient()
    .then(client => client.get(endpoint, { cache: false }))
);

function getHomeLibrary(code) {
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

function getAccountPage(res, req) {
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';

  return axios.get(`${appConfig.webpacBaseUrl}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  });
}

/**
 *  Given raw Account HTML, removes <link> and remote <script> tags to ensure
 *  they're not injected into the html sent to the client (lest they generate a
 *  bunch of erroneous 404s or worse.
 */
function removeLinkAndScriptTags(html) {
  html = html.replace(/<link [^>]+\/>/g, '')
  html = html.replace(/<script type="text\/javascript" src=[^>]+>\s*<\/script>/g, '')
  return html
}
/**
 * Swap actual status labels for something more patron-friendly
 */
function swapStatusLabels(html) {
  html = html.replace(/<td class="patFuncStatus"> AVAILABLE <\/td>/g, '<td class="patFuncStatus"> REQUEST PLACED </td>')
  html = html.replace(/<td class="patFuncStatus"> READY SOON <\/td>/g, '<td class="patFuncStatus"> READY FOR PICKUP </td>')
  return html
}

function preprocessAccountHtml(html) {
  html = removeLinkAndScriptTags(html)
  html = swapStatusLabels(html)
  return html
}

function fetchAccountPage(req, res, resolve) {
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
      if (resp.request && resp.request.path.includes('/login?')) {
        // need to implement
        console.log('Encountered login redirect while fetching account page');
        throw new Error('detected state mismatch, throwing error');
      }

      resolve({ accountHtml: preprocessAccountHtml(resp.data) });
    })
    .catch((resp) => {
      console.error('Account page response error: ', resp);
      resolve({ accountHtml: { error: resp } });
    });
}

function postToAccountPage(req, res) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) res.json({ redirect });
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';
  const reqBodyString = Object.keys(req.body).map(key => `${key}=${req.body[key]}`).join('&');
  axios.post(
    `${appConfig.webpacBaseUrl}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`,
    reqBodyString, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then(resp => res.json(resp.data))
    .catch(resp => res.json({ error: resp }));
}

function logError(req) {
  logger.error('Account Error', req.url.replace(/\w+:\/\//g, ''));
}

export default {
  removeLinkAndScriptTags,
  preprocessAccountHtml,
  fetchAccountPage,
  postToAccountPage,
  getHomeLibrary,
  logError,
  swapStatusLabels,
};
