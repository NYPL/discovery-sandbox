import {
  extend as _extend,
  mapObject as _mapObject,
  omit as _omit,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import locationCodes from '../../../locationCodes.js';
import locationDetails from '../../../locations.js';
import User from './User.js';
import Bib from './Bib.js';
import LibraryItem from './../../app/utils/item.js';
import { validate } from '../../app/utils/formValidationUtils';
import nyplApiClient from '../routes/nyplApiClient';

const nyplApiClientGet = (endpoint) =>
  nyplApiClient().then(client => client.get(endpoint));

const nyplApiClientPost = (endpoint, opts) =>
  nyplApiClient().then(client => client.post(endpoint, opts));
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
  // retrieve patron info
  const patronId = req.patronTokenResponse.decodedPatron.sub;
  const holdRequestEndpoint = '/hold-requests';

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
    pickupLocation: (pickupLocation === 'edd') ? null : pickupLocation,
    // neededBy: "2013-03-20",
    numberOfCopies: 1,
    docDeliveryData: (pickupLocation === 'edd') ? docDeliveryData : null,
  };
  console.log('Making hold request', data);

  return nyplApiClientPost(holdRequestEndpoint, JSON.stringify(data))
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
        const locationDetailsItem = locationDetails[c.location];

        loc.address = (locationDetailsItem) ?
          locationDetailsItem.address.address1 : null;
        loc.shortName = (locationDetailsItem) ?
          locationDetailsItem['short-name'] : null;

        return true;
      }

      return false;
    });
  });

  return locations;
}

/**
 * getDeliveryLocations(barcode, patronId, cb, errorCb)
 * The function to make a request to get delivery locations of an item.
 *
 * @param {string} barcode
 * @param {string} patronId
 * @param {function} cb - callback when we have valid response
 * @param {function} errorCb - callback when error
 * @return {function}
 */
function getDeliveryLocations(barcode, patronId, cb, errorCb) {
  const deliveryEndpoint = `/request/deliveryLocationsByBarcode?barcodes[]=${barcode}` +
    `&patronId=${patronId}`;

  return nyplApiClientGet(deliveryEndpoint)
    .then(barcodeAPIresponse => {
      const eddRequestable = (barcodeAPIresponse.itemListElement[0].eddRequestable) ?
        barcodeAPIresponse.itemListElement[0].eddRequestable : false;
      const deliveryLocationWithAddress =
        (barcodeAPIresponse.itemListElement[0].deliveryLocation) ?
        mapLocationDetails(barcodeAPIresponse.itemListElement[0].deliveryLocation) : [];

      cb(
        deliveryLocationWithAddress,
        eddRequestable
      );
    })
    .catch(barcodeAPIError => {
      console.log(`getDeliveryLocations error: ${barcodeAPIError}`);
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
  const requestId = req.query.requestId || '';
  const searchKeywords = req.query.searchKeywords || '';
  const errorStatus = req.query.errorStatus ? req.query.errorStatus : null;
  const errorMessage = req.query.errorMessage ? req.query.errorMessage : null;
  const error = _extend({}, { errorStatus, errorMessage });

  if (!loggedIn) return false;

  if (!requestId) {
    res.locals.data.Store = {
      bib: {},
      searchKeywords,
      error,
      deliveryLocations: [],
    };

    next();
    return false;
  }

  const patronId = req.patronTokenResponse.decodedPatron.sub || '';
  let barcode;

  return nyplApiClientGet(`/hold-requests/${requestId}`)
    .then(response => {
      const patronIdFromHoldRequest = response.patron;

      // The patron who is seeing the confirmation made the Hold Request
      if (patronIdFromHoldRequest === patronId) {
        // Retrieve item
        return Bib.fetchBib(
          bibId,
          (bibResponseData) => {
            barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

            getDeliveryLocations(
              barcode,
              patronId,
              (deliveryLocations, isEddRequestable) => {
                res.locals.data.Store = {
                  bib: bibResponseData,
                  searchKeywords,
                  error,
                  deliveryLocations,
                  isEddRequestable,
                };
                next();
              },
              (deliveryLocationError) => {
                console.error(
                  `deliveryLocationsByBarcode API error: ` +
                  `${JSON.stringify(deliveryLocationError, null, 2)}`
                );

                res.locals.data.Store = {
                  bib: bibResponseData,
                  searchKeywords,
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
              searchKeywords,
              error,
              deliveryLocations: [],
            };
            next();
          }
        );
      }

      return false;
    })
    .catch(requestIdError => {
      console.log(`Error fetching Hold Request from id. Error: ${requestIdError}`);

      res.locals.data.Store = {
        bib: {},
        searchKeywords,
        error,
        deliveryLocations: [],
      };
      next();

      return false;
    });
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

  const patronId = req.patronTokenResponse.decodedPatron.sub || '';
  let barcode;

  // Retrieve item
  return Bib.fetchBib(
    bibId,
    (bibResponseData) => {
      barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

      getDeliveryLocations(
        barcode,
        patronId,
        (deliveryLocations, isEddRequestable) => {
          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: req.query.searchKeywords || '',
            error,
            form,
            deliveryLocations,
            isEddRequestable,
          };

          next();
        },
        (e) => {
          console.error(`deliverylocationsbybarcode API error 2: ${JSON.stringify(e, null, 2)}`);

          res.locals.data.Store = {
            bib: bibResponseData,
            searchKeywords: req.query.searchKeywords || '',
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
        searchKeywords: req.query.searchKeywords || '',
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
  const patronId = req.patronTokenResponse.decodedPatron ?
    req.patronTokenResponse.decodedPatron.sub : '';
  let barcode;

  // Retrieve item
  return Bib.fetchBib(
    bibId,
    (bibResponseData) => {
      barcode = LibraryItem.getItem(bibResponseData, req.params.itemId).barcode;

      getDeliveryLocations(
        barcode,
        patronId,
        (deliveryLocations, isEddRequestable) => {
          res.json({
            bib: bibResponseData,
            deliveryLocations,
            isEddRequestable,
          });
        },
        (deliveryLocationsError) => {
          console.error(
            'deliverylocationsbybarcode API error 3: ' +
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
        searchKeywords: req.query.searchKeywords || '',
        error,
        form,
      };
      next();
    },
    (bibResponseError) => {
      res.locals.data.Store = {
        bib: {},
        searchKeywords: req.query.searchKeywords || '',
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
  const searchKeywordsQuery = (req.body['search-keywords']) ?
    `&searchKeywords=${req.body['search-keywords']}` : '';

  if (!bibId || !itemId) {
    // Dummy redirect for now
    return res.redirect(`${appConfig.baseUrl}/someErrorPage`);
  }

  if (pickupLocation === 'edd') {
    const eddSearchKeywordsQuery = (req.body['search-keywords']) ?
      `?searchKeywords=${req.body['search-keywords']}` : '';

    return res.redirect(
      `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}/edd${eddSearchKeywordsQuery}`
    );
  }

  return postHoldAPI(
    req,
    itemId,
    pickupLocation,
    docDeliveryData,
    itemSource,
    (response) => {
      const data = JSON.parse(response).data;
      console.log('data', data);
      console.log('Hold Request Id:', data.id);
      console.log('Job Id:', data.jobId);

      res.redirect(
        `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?pickupLocation=` +
        `${pickupLocation}&requestId=${data.id}${searchKeywordsQuery}`
      );
    },
    (error) => {
      console.log(`Error calling Holds API createHoldRequestServer : ${error.data.message}`);
      res.redirect(
        `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?pickupLocation=` +
        `${pickupLocation}&errorStatus=${error.status}` +
        `&errorMessage=${error.statusText}${searchKeywordsQuery}`
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
      const data = JSON.parse(response).data;
      res.json({
        id: data.id,
        jobId: data.jobId,
        pickupLocation: data.pickupLocation,
      });
    },
    (error) => {
      console.log(`Error calling Holds API createHoldRequestAjax : ${error}`);

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
      const data = JSON.parse(response).data;
      res.json({
        id: data.id,
        jobId: data.jobId,
        pickupLocation: data.pickupLocation,
      });
    },
    (error) => {
      console.log(`Error calling Holds API createHoldRequestEdd : ${error}`);

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
    searchKeywords,
  } = req.body;
  const searchKeywordsQuery = (searchKeywords) ? `&searchKeywords=${searchKeywords}` : '';

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

  // Ensure user is logged in
  const loggedIn = User.requireUser(req);

  if (!loggedIn) return false;

  return postHoldAPI(
    req,
    req.body.itemId,
    req.body.pickupLocation,
    req.body,
    req.body.itemSource,
    (response) => {
      const data = JSON.parse(response).data;

      res.redirect(
        `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}` +
        `?pickupLocation=${req.body.pickupLocation}&requestId=${data.id}${searchKeywordsQuery}`
      );
    },
    (error) => {
      console.log(`Error calling Holds API eddServer : ${error}`);

      res.redirect(
        `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}?pickupLocation=edd` +
        `&errorStatus=${error.status}` +
        `&errorMessage=${error.statusText}${searchKeywordsQuery}`
      );
    }
  );
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
