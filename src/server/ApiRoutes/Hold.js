import axios from 'axios';

import appConfig from '../../../appConfig.js';
import User from './User.js';
import Bib from './Bib.js';
import { validate } from '../../app/utils/formValidationUtils';
import {
  omit as _omit,
  keys as _keys,
} from 'underscore';

function postHoldAPI(req, cb, errorCb) {
  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  // NOTE: The implementation for this needs to be redone, or
  // we may get it directly from the API.
  let itemId = req.params.itemId;
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
  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  // NOTE: pickedUpItemId and pickedUpBibId are coming from the EDD form function below:
  let itemId = req.params.itemId || pickedUpItemId;
  let bibId = req.params.bibId || pickedUpBibId;
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
  // NOTE: When this function is called from EDD, this needs to be updated to reflect that,
  // since there's no physical location anymore.
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

  return postHoldAPI(
    req,
    (response) => {
      // console.log('Holds API response:', response);
      console.log('Hold Request Id:', response.data.data.id);
      console.log('Job Id:', response.data.data.jobId);
      res.redirect(`/hold/confirmation/${bibId}-${itemId}?requestId=${response.data.data.id}`);
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

  if (!req.params.bibId || !req.params.itemId) {
    // Dummy redirect for now
    return res.redirect('/someErrorPage');
  }

  return postHoldAPI(
    req,
    (response) => {
      res.json({
        id: response.data.data.id,
        jobId: response.data.data.jobId,
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

export default {
  newHoldRequestServer,
  createHoldRequestServer,
  createHoldRequestAjax,
  confirmRequestServer,
  eddServer,
};
