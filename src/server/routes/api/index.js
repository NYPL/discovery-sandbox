import auth from '../auth';
import { isEmpty as _isEmpty } from 'underscore';

export function getPatronData(req, res, next) {
  if (req.patronTokenResponse.isTokenValid
    && req.patronTokenResponse.decodedPatron
    && req.patronTokenResponse.decodedPatron.sub
  ) {
    const userId = req.patronTokenResponse.decodedPatron.sub;

    return auth.client
      .get(`/patrons/${userId}`)
      .then((response) => {
        if (_isEmpty(response)) {
          // Data is empty for the Patron
          res.locals.data = {
            PatronStore: {
              id: '',
              names: [],
              barcodes: [],
              emails: [],
            },
          };
        } else {
          // Data exists for the Patron
          res.locals.data = {
            PatronStore: {
              id: response.id,
              names: response.names,
              barcodes: response.barCodes,
              emails: response.emails,
            },
          };
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
