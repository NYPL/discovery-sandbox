import axios from 'axios';

import appConfig from '../../../appConfig.js';
import Hold from './Hold.js';
import LibraryItem from './../../app/utils/item.js';

const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];

function fetchBib(bibId, cb, errorcb) {
  return axios
    .get(`${apiBase}/discovery/resources/${bibId}`)
    .then(response => cb(response.data))
    .catch(error => {
      console.error(`fetchBib API error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function bibSearchServer(req, res, next) {
  const bibId = req.params.bibId || '';

  fetchBib(
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
      console.error(`bibSearchServer API error: ${JSON.stringify(error, null, 2)}`);
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
 * bibSearchAjax(req, res)
 * The function for getting the bib-item data along with its delivery locations.
 *
 * @param {req}
 * @param {res}
 */
function bibSearchAjax(req, res) {
  const bibId = req.query.bibId || '';
  const itemId = req.query.itemId || '';
  const accessToken = req.tokenResponse.accessToken || '';
  const patronId = req.tokenResponse.decodedPatron.sub || '';

  fetchBib(
    bibId,
    (bibData) => {
      const barcode = LibraryItem.getItem(bibData, itemId).barcode;

      Hold.getDeliveryLocations(
        barcode,
        patronId,
        accessToken,
        (deliveryLocations, isEddRequestable) => {
          res.json({
            bib: bibData,
            deliveryLocations,
            isEddRequestable,
          });
        },
        (deliveryLocationsError) => {
          console.error(
            `deliverylocations API error: ${JSON.stringify(deliveryLocationsError, null, 2)}`
          );

          res.json({
            bib: bibData,
            deliveryLocations: [],
            isEddRequestable: false,
          });
        }
      );
    },
    (error) => res.json(error)
  );
}

export default {
  bibSearchServer,
  bibSearchAjax,
  fetchBib,
};
