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
    const patronHoldsApi = `${config.api.development}/patrons/${userId}/holds`;

    console.log(req.tokenResponse);

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
            res.locals.patronData = {
              holdsCollection: [],
            };
          }
          // Data exists for the Patron
          if (response.data.statusCode === 200 && response.data.data) {
            res.locals.patronData = {
              holdsCollection: response.data.data,
            };
          }
        }
        // Continue next function call
        next();
      })
      .catch((error) => {
        // Debugging
        console.log(error);

        res.locals.patronData = {
          holdsCollection: [],
        };
        // Continue next function call
        next();
      });
  }
}
