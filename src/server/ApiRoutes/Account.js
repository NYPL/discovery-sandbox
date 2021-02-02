import axios from 'axios';

import User from './User';

import appConfig from '../../app/data/appConfig';

function fetchAccountPage(req, res, resolve) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) {
    resolve({ redirect });
    return;
  }

  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';

  const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

  axios.get(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then((resp) => {
      // If Header thinks patron is logged in,
      // but patron is not actually logged in, the case below is hit
      if (resp.request.path.includes('/login?')) {
        console.warn('Hit login mismatch. Logging user out.');
        // This will hit the login redirect infinite loop. Let's log the user out properly.
        axios.get(`${appConfig.logoutUrl}`, {
          headers: {
            Cookie: req.headers.cookie,
          },
        })
          .then(resp => {
            res.redirect(`${appConfig.baseUrl}/logout`);
          });
        return;
      }
      resolve(resp.data);
    })
    .catch((resp) => {
      if (resp.status === 429) {
        console.warn('Hit infinite login redirect. Logging user out');
        if (!fullUrl.includes('%2Fapi%2F')) {
          res.redirect(`${appConfig.logoutUrl}?redirect_uri=${fullUrl}`);
          return;
        }
      }
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
