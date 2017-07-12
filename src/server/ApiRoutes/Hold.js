import axios from 'axios';

import appConfig from '../../../appConfig.js';
import User from './User.js';
import Bib from './Bib.js';
import { validate } from '../../app/utils/formValidationUtils';
import {
  omit as _omit,
} from 'underscore';

const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];

function postHoldAPI(req, pickedUpItemId, pickupLocation, cb, errorCb) {
  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  // NOTE: pickedUpItemId and pickedUpBibId are coming from the EDD form function below:
  let itemId = req.params.itemId || pickedUpItemId;
  let nyplSource = 'sierra-nypl';

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
    .then(cb)
    .catch(errorCb);
}

function confirmRequestServer(req, res, next) {
  const bibId = req.params.bibId || '';
  const loggedIn = User.requireUser(req, res);

  if (!loggedIn) return false;

  return Bib.fetchBib(
    bibId,
    (data) => {
      res.locals.data.Store = {
        bib: data,
        searchKeywords: '',
        error: {},
      };
      next();
    },
    (error) => {
      console.log(error);
      res.locals.data.Store = {
        bib: {},
        searchKeywords: '',
        error,
      };
      next();
    }
  );
}

function newHoldRequestServer(req, res, next) {
  const loggedIn = User.requireUser(req, res);
  const error = req.query.error ? JSON.parse(req.query.error) : {};
  const form = req.query.form ? JSON.parse(req.query.form) : {};

  if (!loggedIn) return false;

  // Retrieve item
  return Bib.fetchBib(
    req.params.bibId,
    (data) => {
      res.locals.data.Store = {
        bib: data,
        searchKeywords: '',
        error,
        form,
      };
      next();
    },
    (error) => {
      res.locals.data.Store = {
        bib: {},
        searchKeywords: '',
        error,
        form,
      };
      next();
    }
  );
}

function createHoldRequestServer(req, res, pickedUpBibId = '', pickedUpItemId = '') {
  // Ensure user is logged in
  const loggedIn = User.requireUser(req);
  if (!loggedIn) return false;

  // NOTE: pickedUpItemId and pickedUpBibId are coming from the EDD form function below:
  let itemId = req.params.itemId || pickedUpItemId;
  let bibId = req.params.bibId || pickedUpBibId;
  const pickupLocation = req.body['delivery-location'];

  if (!bibId || !itemId) {
    // Dummy redirect for now
    return res.redirect('/someErrorPage');
  }

  return postHoldAPI(
    req,
    itemId,
    pickupLocation,
    (response) => {
      // console.log('Holds API response:', response);
      console.log('Hold Request Id:', response.data.data.id);
      console.log('Job Id:', response.data.data.jobId);
      res.redirect(
        `/hold/confirmation/${bibId}-${itemId}?pickupLocation=${response.data.data.pickupLocation}&requestId=${response.data.data.id}`
      );
    })
    .catch(error => {
      // console.log(error);
      console.log(`Error calling Holds API : ${error.data.message}`);
      res.redirect(`/hold/request/${bibId}-${itemId}?errorMessage=${error.data.message}`);
    }); /* end axios call */
}

function createHoldRequestAjax(req, res) {
  // Ensure user is logged in
  const loggedIn = User.requireUser(req);
  if (!loggedIn) return false;

  return postHoldAPI(
    req,
    req.query.itemId,
    req.query.pickupLocation,
    (response) => {
      res.json({
        id: response.data.data.id,
        jobId: response.data.data.jobId,
        pickupLocation: response.data.data.pickupLocation,
      });
    },
    (error) => {
      console.log(`Error calling Holds API : ${error.data.message}`);
      res.json({
        status: error.status,
        error,
      });
    }
  );
}

function eddServer(req, res) {
  const {
    bibId,
    itemId,
  } = req.body;

  // console.log(req.body)
  // This will give you the form values in the form of:
  // {
  //   name: '',
  //   email: '',
  //   chapter: '',
  //   author: '',
  //   date: '',
  //   volume: '',
  //   issue: '',
  //   'starting-page': '',
  //   'ending-page': '',
  //   bibId: '',
  //   itemId: '',
  // };
  // This can then be modified and sent to the Request API endpoint once we get it.
  // This is for the server side call in no-js scenarios. The form will post to the /edd
  // endpoint and this function will be hit.
  // Please delete this later.

  let serverErrors = {};

  // NOTE: We want to skip over bibId and itemId in the validation. They are hidden fields but
  // only useful for making the actual request and not for the form validation.
  // If the form is not valid, then redirect to the same page but with errors AND the user data:
  if (!validate(_omit(req.body, ['bibId', 'itemId']), (error) => { serverErrors = error; })) {
    // Very ugly but passing all the error and patron data through the url param.
    // TODO: think of a better way to pass data. For now, this works, but make sure that
    // the data is being passed and picked up by the `ElectronicDelivery` component.
    return res.redirect(`/hold/request/${bibId}-${itemId}/edd?` +
      `error=${JSON.stringify(serverErrors)}` +
      `&form=${JSON.stringify(req.body)}`);
  }

  // NOTE: Mocking that this workflow works correctly:
  // Just a dummy redirect that doesn't actually do anything yet with the correct valid data
  // that was submitted.
  return createHoldRequestServer(req, res, bibId, itemId);
}

function getDeliveryLocations(req, res) {
  const loggedIn = User.requireUser(req, res);
  const accessToken = req.tokenResponse.accessToken;

  if (!loggedIn) return false;

  axios
    .get(`${apiBase}/request/deliverylocationsbybarcode?barcodes[]=${req.query.barcode}`,
      { headers:
        {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(response => {
      res.json({
        data: response.data,
      });
    })
    .catch(error => {
      console.error(`deliverylocationsbybarcode API error: ${JSON.stringify(error, null, 2)}`);

      res.json({
        status: error.status,
        error,
      });
    }); /* end axios call */
}

export default {
  newHoldRequestServer,
  createHoldRequestServer,
  createHoldRequestAjax,
  confirmRequestServer,
  eddServer,
  getDeliveryLocations,
};
