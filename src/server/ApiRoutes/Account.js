import axios from 'axios';

import User from './User';

import appConfig from '../../app/data/appConfig';

function fetchAccountPage(req, res, resolve) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) resolve({ redirect });

  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';

  axios.get(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then((resp) => {
      // If Header thinks patron is logged in,
      // but patron is not actually logged in, the case below is hit
      if (resp.request.path.includes('/login?')) {
        // need to implement
        console.log('need to redirect, might be buggy?');
        // redirect to login
        const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
        if (!fullUrl.includes('%2Fapi%2F')) {
          res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
        }
      }
      resolve(resp.data);
    })
    .catch((resp) => {
      res.json({ error: resp });
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
