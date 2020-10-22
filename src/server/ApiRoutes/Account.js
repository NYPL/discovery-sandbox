import axios from 'axios';

import { updateAccountHtml } from '../../app/actions/Actions';

function fetchAccountPage(req, res, next) {
  const { patronId } = req.params;
  const { dispatch } = global.store;
  axios(`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patronId}/items`)
    .then(resp => {
      dispatch(updateAccountHtml(resp.data));
      next();
    })
    .catch(console.log)
}

export default { fetchAccountPage };
