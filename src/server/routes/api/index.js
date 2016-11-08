import axios from 'axios';
import config from '../../../../appConfig.js';

export function getUserHolds(req, res, next) {
  if (req.tokenResponse.isTokenValid
    && req.tokenResponse.accessToken
    && req.tokenResponse.decodedPatron
    && req.tokenResponse.decodedPatron.sub
  ) {
    const userId = req.tokenResponse.decodedPatron.sub;
    const userToken = req.tokenResponse.accessToken;
    const patronHoldsApi = `${config.api.development}/patrons/${userId}`;

    console.log(userId);

    axios
      .get(patronHoldsApi, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        if (response.data) {
          // Data is empty for the Patron
          if (response.data.statusCode === 404) {
            console.log(response.data.statusCode, response.data.message);
            res.locals.data = {
              patronData: {
                id: '',
                names: [],
                barcodes: [],
              },
            };
          }
          // Data exists for the Patron
          // console.log(response.data.data);
          if (response.data.statusCode === 200 && response.data.data) { 
            res.locals.data = {
              patronData: {
                id: response.data.data.id,
                names: response.data.data.names,
                barcodes: response.data.data.barCodes,
              },
            };
          }
        }
        // Continue next function call
        next();
      })
      .catch((error) => {
        // Debugging
        console.log(error);

        res.locals.data = {
          patronData: {
            id: '',
            names: [],
            barcodes: [],
          },
        };
        // Continue next function call
        next();
      });
  } else {
    next();
  }
}
