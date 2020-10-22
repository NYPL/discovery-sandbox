import axios from 'axios';

import { updateAccountHtml } from '../../app/actions/Actions';

function fetchAccountPage(req, res, resolve) {
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
