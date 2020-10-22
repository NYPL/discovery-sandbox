import axios from 'axios';

import { updateAccountHtml } from '../../app/actions/Actions';

function fetchAccountPage(req, res, next) {
  const { patronId } = req.params;
  const { dispatch } = global.store;
  const nyplIdentityCookieString = req.cookies.nyplIdentityPatron;
  const encodedNyplIdentityCookie = Buffer.from(nyplIdentityCookieString).toString("base64");

  axios.get(`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patronId}/items`, {
    headers: {
      Cookie: `nyplIdentityPatron=${encodedNyplIdentityCookie}`,
    },
  })
    .then(resp => {
      dispatch(updateAccountHtml(resp.data));
      next();
    })
    .catch(console.log)
}

export default { fetchAccountPage };
