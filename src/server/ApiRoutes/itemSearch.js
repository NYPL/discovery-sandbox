import axios from 'axios';
import appConfig from '../../../appConfig.js';

const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];

function retrieveItem(q, cb, errorcb) {
  return axios
    .get(`${apiBase}/discovery/resources/${q}`)
    .then(response => cb(response.data))
    .catch(error => {
      console.error(`RetrieveItem error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function serverItemSearch(req, res, next) {
  const q = req.params.id || '';

  retrieveItem(
    q,
    (data) => {
      res.locals.data.Store = {
        item: data,
        searchKeywords: '',
        error: {},
      };
      next();
    },
    (error) => {
      console.log(error);
      res.locals.data.Store = {
        item: {},
        searchKeywords: '',
        error,
      };
      next();
    }
  );
}

function ajaxItemSearch(req, res) {
  const q = req.query.q || '';

  retrieveItem(
    q,
    (data) => res.json(data),
    (error) => res.json(error)
  );
}

function account(req, res, next) {
  next();
}

function requireUser(req, res) {
  if (!req.tokenResponse || !req.tokenResponse.isTokenValid ||
    !req.tokenResponse.accessToken || !req.tokenResponse.decodedPatron ||
    !req.tokenResponse.decodedPatron.sub) {
    // redirect to login
    const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);

    res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

function newHoldRequest(req, res, next) {
  const loggedIn = requireUser(req, res);

  if (!loggedIn) return false;

  // Retrieve item
  return retrieveItem(
    req.params.id,
    (data) => {
      res.locals.data.Store = {
        item: data,
        searchKeywords: '',
        error: {},
      };
      next();
    },
    (error) => {
      res.locals.data.Store = {
        item: {},
        searchKeywords: '',
        error,
      };
      next();
    }
  );
}

function createHoldRequest(req, res) {
  // console.log('Hold request', req);

  // Ensure user is logged in
  const loggedIn = requireUser(req);
  if (!loggedIn) return false;

  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  let itemId = req.params.id;
  let nyplSource = 'nypl-sierra';

  if (itemId.indexOf('-') >= 0) {
    const parts = itemId.split('-');
    itemId = parts[parts.length - 1];

    if (itemId.substring(0, 2) === 'pi') {
      nyplSource = 'recap-PUL';
    } else if (itemId.substring(0, 2) === 'ci') {
      nyplSource = 'recap-CUL';
    }
  }
  itemId = itemId.replace(/\D/g, '');
  const pickupLocation = req.body.pickupLocation;

  const data = {
    patron: patronId,
    recordType: 'i',
    record: itemId,
    nyplSource,
    pickupLocation,
    // neededBy: "2013-03-20",
    numberOfCopies: 1,
  };
  console.log('Making hold request', data, accessToken);

  return axios
    .post(patronHoldsApi, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      // console.log('Holds API response:', response);
      console.log('Hold Request Id:', response.data.data.id);
      console.log('Job Id:', response.data.data.jobId);
      res.redirect(`/hold/confirmation/${req.params.id}?requestId=${response.data.data.id}`);
    })
    .catch(error => {
      // console.log(error);
      console.log(`Error calling Holds API : ${error.data.message}`);
      res.redirect(`/hold/request/${req.params.id}?errorMessage=${error.data.message}`);
    }); /* end axios call */
}

export default {
  serverItemSearch,
  newHoldRequest,
  createHoldRequest,
  account,
  ajaxItemSearch,
};
