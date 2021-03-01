import axios from 'axios';

import User from './User';

import appConfig from '../../app/data/appConfig';

function fetchAccountPage(req, res, resolve) {
  console.log('fetching account page');
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) {
    resolve({ redirect });
    return;
  }

  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';

  // no need to fetch from Webpac for this tab
  if (content === 'settings') return resolve('');

  if (!['items', 'holds', 'overdues'].includes(content)) {
    res.redirect(`${appConfig.baseUrl}/account`);
    return;
  }

  console.log('getting axios');

  axios.get(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then((resp) => {
      // If Header thinks patron is logged in,
      // but patron is not actually logged in, the case below is hit
      // console.log('resp: ', JSON.stringify(resp, null, 2));
      if (resp.request.path.includes('/login?')) {
        console.log("login resp: ");
        // need to implement
        console.log('need to redirect, might be buggy?');
        // redirect to login
        // const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
        // if (!fullUrl.includes('%2Fapi%2F')) {
        //   res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
        // }
        throw new Error('thrown');
      }
      resolve(resp.data);
    })
    .catch((resp) => {
      console.log('resp error: ');
      resolve({ error: resp });
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
    `${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`,
    reqBodyString, {
      headers: {
        Cookie: req.headers.cookie,
      },
    })
    .then(resp => res.json(resp.data))
    .catch(resp => res.json({ error: resp }));
}

export default {
  fetchAccountPage,
  postToAccountPage,
};
