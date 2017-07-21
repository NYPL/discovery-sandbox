import axios from 'axios';
import config from '../../../../appConfig.js';

function constructApiHeaders(token = '') {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
}

export function getPatronData(req, res, next) {
  if (req.tokenResponse.isTokenValid
    && req.tokenResponse.accessToken
    && req.tokenResponse.decodedPatron
    && req.tokenResponse.decodedPatron.sub
  ) {
    const userId = req.tokenResponse.decodedPatron.sub;
    const userToken = req.tokenResponse.accessToken;
    const patronHoldsApi = `${config.api.development}/patrons/${userId}`;

    return axios
      .get(patronHoldsApi, constructApiHeaders(userToken))
      .then((response) => {
        if (response.data) {
          // Data is empty for the Patron
          if (response.data.statusCode === 404) {
            res.locals.data = {
              PatronStore: {
                id: '',
                names: [],
                barcodes: [],
                emails: [],
              },
            };
          }
          // Data exists for the Patron
          if (response.data.statusCode === 200 && response.data.data) {
            res.locals.data = {
              PatronStore: {
                id: response.data.data.id,
                names: response.data.data.names,
                barcodes: response.data.data.barCodes,
                emails: response.data.data.emails,
              },
            };
          }
        }
        // Continue next function call
        next();
      })
      .catch((error) => {
        console.log(error);
        res.locals.data = {
          PatronStore: {
            id: '',
            names: [],
            barcodes: [],
            emails: [],
          },
        };
        // Continue next function call
        next();
      });
  }
  res.locals.data = {
    PatronStore: {
      id: '',
      names: [],
      barcodes: [],
      emails: [],
    },
  };
  return next();
}
