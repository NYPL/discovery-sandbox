import axios from 'axios';

import User from './User';
import { updateAccountHtml } from '../../app/actions/Actions';

function fetchAccountPage(req, res, resolve) {
  const requireUser = User.requireUser(req, res);
  const { redirect } = requireUser;
  if (redirect) return false;

  const { patronId } = req.params;
  const content = req.params.content || 'items';
  const { dispatch } = global.store;

  axios.get(`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patronId}/${content}`, {
    headers: {
      Cookie: req.headers.cookie,
    },
    // withCredentials: true,
  })
    .then(resp => {
      resolve(resp.data);
    })
    .catch(console.log);
}

export default { fetchAccountPage };
