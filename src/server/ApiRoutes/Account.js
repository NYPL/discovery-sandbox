import axios from 'axios';

import User from './User';

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
    .then(resp => resolve(resp.data))
    .catch(console.log);
}

export default { fetchAccountPage };
