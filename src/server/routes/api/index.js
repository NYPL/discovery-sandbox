/* eslint import/prefer-default-export: "off" */
import { isEmpty as _isEmpty } from 'underscore';

import nyplApiClient from '../nyplApiClient';
import logger from '../../../../logger';

export function getPatronData(req, res, next) {
  if (req.patronTokenResponse.isTokenValid
    && req.patronTokenResponse.decodedPatron
    && req.patronTokenResponse.decodedPatron.sub
  ) {
    const userId = req.patronTokenResponse.decodedPatron.sub;

    return nyplApiClient()
      .then(client =>
        client.get(`/patrons/${userId}`, { cache: false })
          .then((response) => {
            if (_isEmpty(response)) {
              // Data is empty for the Patron
              res.locals.data = {
                PatronStore: {
                  id: '',
                  names: [],
                  barcodes: [],
                  emails: [],
                  loggedIn: false,
                },
              };
            } else {
              // Data exists for the Patron
              res.locals.data = {
                PatronStore: {
                  id: response.data.id,
                  names: response.data.names,
                  barcodes: response.data.barCodes,
                  emails: response.data.emails,
                  loggedIn: true,
                },
              };
            }

            // Continue next function call
            next();
          })
          .catch((error) => {
            logger.error(
              'Error attemping to make server side fetch call to patrons in getPatronData' +
              `, /patrons/${userId}`,
              error
            );
            res.locals.data = {
              PatronStore: {
                id: '',
                names: [],
                barcodes: [],
                emails: [],
                loggedIn: false,
              },
            };
            // Continue next function call
            next();
          })
      );
  }

  res.locals.data = {
    PatronStore: {
      id: '',
      names: [],
      barcodes: [],
      emails: [],
      loggedIn: false,
    },
  };
  return next();
}
