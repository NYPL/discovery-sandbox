import axios from 'axios';

import appConfig from '../../../appConfig.js';
import locationCodes from '../../../locationCodes.js';
import locationDetails from '../../../locations.js';
import User from './User.js';
import Bib from './Bib.js';
import LibraryItem from './../../app/utils/item.js';
import { validate } from '../../app/utils/formValidationUtils';
import {
  mapObject as _mapObject,
  omit as _omit,
} from 'underscore';

const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];

/**
 * postHoldAPI(req, pickedUpItemId, pickupLocation, cb, errorCb)
 * The function to make a POST request to the hold request API.
 *
 * @param {req} req
 * @param {string} pickedUpItemId
 * @param {string} pickupLocation
 * @param {object} docDeliveryData
 * @param {string} itemSource The source of the item, either nypl, cul, or pul.
 * @param {function} cb - callback when we have valid response
 * @param {function} errorCb - callback when error
 * @return {function}
 */
function postHoldAPI(
  req,
  pickedUpItemId,
  pickupLocation,
  docDeliveryData,
  itemSource,
  cb,
  errorCb
) {
  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  // NOTE: pickedUpItemId and pickedUpBibId are coming from the EDD form function below:
  let itemId = req.params.itemId || pickedUpItemId;
  itemId = itemId.replace(/\D/g, '');

  const data = {
    patron: patronId,
    record: itemId,
    nyplSource: itemSource,
    requestType: (pickupLocation === 'edd') ? 'edd' : 'hold',
    recordType: 'i',
    pickupLocation: (pickupLocation === 'edd') ? 'null' : pickupLocation,
    // neededBy: "2013-03-20",
    numberOfCopies: 1,
    docDeliveryData: (pickupLocation === 'edd') ? docDeliveryData : null,
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

/**
 * mapLocationDetails(locations)
 * The function extracts the details of the delivery locations from the location.js and
 * locationCodes.js based on the location ID we get from deliveryLocationsByBarcode API.
 *
 * @param {array} locations
 * @return {array}
 */
function mapLocationDetails(locations) {
  locations.map(loc => {
    _mapObject(locationCodes, (c) => {
      if (loc['@id'].replace('loc:', '') === c.delivery_location) {
        loc.address = (locationDetails[c.location]) ?
          locationDetails[c.location].address.address1 : null;

        return true;
      }

      return false;
    });
  });

  return locations;
}

/**
 * getDeliveryLocations(barcode, patronId, accessToken, cb, errorCb)
 * The function to make a request to get delivery locations of an item.
 *
 * @param {string} barcode
 * @param {string} patronId
 * @param {string} accessToken
 * @param {function} cb - callback when we have valid response
 * @param {function} errorCb - callback when error
 * @return {function}
 */
function getDeliveryLocations(barcode, patronId, accessToken, cb, errorCb) {
  return axios.get(
    `${apiBase}/request/deliveryLocationsByBarcode?barcodes[]=${barcode}&patronId=${patronId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  .then(barcodeAPIresponse => {
    const deliveryLocationWithAddress = mapLocationDetails(
      barcodeAPIresponse.data.itemListElement[0].deliveryLocation
    );

    cb(
      deliveryLocationWithAddress,
      barcodeAPIresponse.data.itemListElement[0].eddRequestable
    );
  })
  .catch(barcodeAPIError => {
    errorCb(barcodeAPIError);
  });
}

/**
 * confirmRequestServer(req, res, next)
 * The function to return the bib and item data with its delivery locations to confirmation page.
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @return {function}
 */
function confirmRequestServer(req, res, next) {
  const bibId = req.params.bibId || '';
  const loggedIn = User.requireUser(req, res);
  const error = req.query.error ? JSON.parse(req.query.error) : {};

  if (!loggedIn) return false;

  const accessToken = req.tokenResponse.accessToken || '';
  const patronId = req.tokenResponse.decodedPatron.sub || '';
  let barcode;

  // Retrieve item
  return Bib.fetchBib(
    bibId,
    (bibResponseData) => {
      barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

      getDeliveryLocations(
        barcode,
        patronId,
        accessToken,
        (deliveryLocations, isEddRequestable) => {
          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: '',
            error,
            deliveryLocations,
            isEddRequestable,
          };
          next();
        },
        (e) => {
          console.error(`deliverylocationsbybarcode API error: ${JSON.stringify(e, null, 2)}`);

          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: '',
            error,
            deliveryLocations: [],
            isEddRequestable: false,
          };

          next();
        }
      );
    },
    (bibResponseError) => {
      res.locals.data.Store = {
        bib: {},
        searchKeywords: '',
        error,
      };
      next();
    }
  );
}

/**
 * newHoldRequestServer(req, res, next)
 * The function to return the bib and item data with its delivery locations to hold request page.
 *
 * @param {req}
 * @param {res}
 * @param {next}
 * @return {function}
 */
function newHoldRequestServer(req, res, next) {
  const bibId = req.params.bibId || '';
  const loggedIn = User.requireUser(req, res);
  const error = req.query.error ? JSON.parse(req.query.error) : {};
  const form = req.query.form ? JSON.parse(req.query.form) : {};

  if (!loggedIn) return false;

  const accessToken = req.tokenResponse.accessToken || '';
  const patronId = req.tokenResponse.decodedPatron.sub || '';
  let barcode;

  // Retrieve item
  return Bib.fetchBib(
    bibId,
    (bibResponseData) => {
      barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

      getDeliveryLocations(
        barcode,
        patronId,
        accessToken,
        (deliveryLocations, isEddRequestable) => {
          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: '',
            error,
            form,
            deliveryLocations,
            isEddRequestable,
          };

          next();
        },
        (e) => {
          console.error(`deliverylocationsbybarcode API error: ${JSON.stringify(e, null, 2)}`);

          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: '',
            error,
            form,
            deliveryLocations: [],
            isEddRequestable: false,
          };

          next();
        }
      );
    },
    (bibResponseError) => {
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

/**
 * newHoldRequestAjax(req, res, next)
 * The function to return the bib and item data with its delivery locations to the
 * hold request route.
 *
 * @param {req}
 * @param {res}
 * @return {function}
 */
function newHoldRequestAjax(req, res) {
  const bibId = req.params.bibId || '';
  const accessToken = req.tokenResponse.accessToken || '';
  const patronId = req.tokenResponse.decodedPatron ? req.tokenResponse.decodedPatron.sub : '';
  let barcode;

  // Retrieve item
  return Bib.fetchBib(
    bibId,
    (bibResponseData) => {
      barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

      getDeliveryLocations(
        barcode,
        patronId,
        accessToken,
        (deliveryLocations, isEddRequestable) => {
          res.json({
            bib: bibResponseData,
            deliveryLocations,
            isEddRequestable,
          });
        },
        (deliveryLocationsError) => {
          console.error(
            'deliverylocationsbybarcode API error: ' +
            `${JSON.stringify(deliveryLocationsError, null, 2)}`
          );

          res.json({
            bib: bibResponseData,
            deliveryLocations: [],
            isEddRequestable: false,
          });
        }
      );
    },
    (bibResponseError) => res.json(bibResponseError)
  );
}

function newHoldRequestServerEdd(req, res, next) {
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
    (bibResponseError) => {
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

/**
 * createHoldRequestServer(req, res, pickedUpBibId = '', pickedUpItemId = '')
 * The function to make a server side hold request call.
 *
 * @param {req}
 * @param {res}
 * @param {string} pickedUpBibId
 * @param {string} pickedUpItemId
 * @return {function}
 */
function createHoldRequestServer(req, res, pickedUpBibId = '', pickedUpItemId = '') {
  // Ensure user is logged in
  const loggedIn = User.requireUser(req);
  if (!loggedIn) return false;

  // NOTE: pickedUpItemId and pickedUpBibId are coming from the EDD form function below:
  const itemId = req.params.itemId || pickedUpItemId;
  const bibId = req.params.bibId || pickedUpBibId;
  const itemSource = req.params.itemSource || '';
  const pickupLocation = req.body['delivery-location'];
  const docDeliveryData = (req.body.form && pickupLocation === 'edd') ? req.body.form : null;

  if (!bibId || !itemId) {
    // Dummy redirect for now
    return res.redirect(`${appConfig.baseUrl}/someErrorPage`);
  }

  return postHoldAPI(
    req,
    itemId,
    pickupLocation,
    docDeliveryData,
    itemSource,
    (response) => {
      console.log('Hold Request Id:', response.data.data.id);
      console.log('Job Id:', response.data.data.jobId);

      res.redirect(
        `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?pickupLocation=` +
        `${response.data.data.pickupLocation}&requestId=${response.data.data.id}`
      );
    },
    (error) => {
      console.log(`Error calling Holds API : ${error.data.message}`);
      res.redirect(
        `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}?errorMessage=${error.data.message}`
      );
    }
  );
}

/**
 * createHoldRequestAjax(req, res)
 * The function to make a client side hold request call.
 *
 * @param {req}
 * @param {res}
 * @return {function}
 */
function createHoldRequestAjax(req, res) {
  // Ensure user is logged in
  const loggedIn = User.requireUser(req);
  if (!loggedIn) return false;

  return postHoldAPI(
    req,
    req.query.itemId,
    req.query.pickupLocation,
    null,
    req.query.itemSource,
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

function createHoldRequestEdd(req, res) {
  // Ensure user is logged in
  const loggedIn = User.requireUser(req);
  if (!loggedIn) return false;

  return postHoldAPI(
    req,
    req.body.itemId,
    req.body.pickupLocation,
    req.body.form,
    req.body.itemSource,
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

  let serverErrors = {};

  // NOTE: We want to skip over bibId and itemId in the validation. They are hidden fields but
  // only useful for making the actual request and not for the form validation.
  // If the form is not valid, then redirect to the same page but with errors AND the user data:
  if (!validate(_omit(req.body, ['bibId', 'itemId']), (error) => { serverErrors = error; })) {
    // Very ugly but passing all the error and patron data through the url param.
    // TODO: think of a better way to pass data. For now, this works, but make sure that
    // the data is being passed and picked up by the `ElectronicDelivery` component.
    return res.redirect(`${appConfig.baseUrl}/hold/request/${bibId}-${itemId}/edd?` +
      `error=${JSON.stringify(serverErrors)}` +
      `&form=${JSON.stringify(req.body)}`);
  }

  // NOTE: Mocking that this workflow works correctly:
  // Just a dummy redirect that doesn't actually do anything yet with the correct valid data
  // that was submitted.
  return createHoldRequestServer(req, res, bibId, itemId);
}

export default {
  getDeliveryLocations,
  confirmRequestServer,
  newHoldRequestServer,
  newHoldRequestAjax,
  newHoldRequestServerEdd,
  createHoldRequestServer,
  createHoldRequestAjax,
  createHoldRequestEdd,
  eddServer,
};
