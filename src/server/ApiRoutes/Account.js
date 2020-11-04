import axios from 'axios';

import User from './User';

import appConfig from '../../app/data/appConfig';

function myLists(req, res) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) res.json({ redirect });

  const patronId = req.patronTokenResponse.decodedPatron.sub;

  const listNumQuery = req.body.listNum ? `listNum=${req.body.listNum}` : '';

  const query = `${listNumQuery}`;

  axios.get(`https://ilsstaff.nypl.org/dp/patroninfo*eng~Sdefault/${patronId}/mylists${query ? `?${query}` : ''}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then(resp => res.json(resp.data))
    .catch((resp) => {
      const { statusText } = resp.response;
      return res.json({ error: statusText });
    });
}

function fetchAccountPage(req, res, resolve) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) resolve({ redirect });

  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';

  axios.get(`https://ilsstaff.nypl.org/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then((resp) => {
      if (resp.request.path.includes('/login?')) {
        // need to implement
        console.log('need to redirect');
      }
      resolve(resp.data);
    })
    .catch((resp) => {
      const { statusText } = resp.response;
      return res.json({ error: statusText });
    });
}

function postToAccountPage(req, res) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) res.json({ redirect });
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const content = req.params.content || 'items';
  axios.post(`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, req.body, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then(resp => res.json(resp.data))
    .catch((resp) => {
      const { statusText } = resp.response;
      return res.json({ error: statusText });
    });
}

function manageHolds(req, res) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) res.json({ redirect });
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  axios.post(`https://ilsstaff.nypl.org/dp/patroninfo*eng~Sdefault/${patronId}/holds`, req.body, {
    headers: {
      Cookie: req.headers.cookie,
    },
  })
    .then((resp) => {
      // global.store.dispatch(updateAccountHtml(resp.data));
      res.redirect(`${appConfig.baseUrl}/account/holds`);
    })
    .catch((resp) => {
      console.log('ERROR', resp);
      const { statusText } = resp.response;
      return res.json({ error: statusText });
    });
}

export default {
  fetchAccountPage,
  postToAccountPage,
  myLists,
  manageHolds,
};
