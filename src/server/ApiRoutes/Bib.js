import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../../appConfig';

const nyplApiClientCall = query =>
  nyplApiClient().then(client => client.get(`/discovery/resources/${query}`, { cache: false }));

function fetchBib(bibId, cb, errorcb) {
  return nyplApiClientCall(bibId)
    .then(response => cb(response))
    .catch((error) => {
      logger.error(`Error attemping to fetch a Bib server side in fetchBib, id: ${bibId}`, error);

      errorcb(error);
    }); /* end axios call */
}

function bibSearchServer(req, res, next) {
  const bibId = req.params.bibId || '';

  fetchBib(
    bibId,
    (data) => {
      if (data.status && data.status === 404) {
        return res.redirect(`${appConfig.baseUrl}/404`);
      }

      res.locals.data.Store = {
        bib: data,
        searchKeywords: req.query.searchKeywords || '',
        error: {},
      };
      next();
    },
    (error) => {
      logger.error(`Error in bibSearchServer API error, id: ${bibId}`, error);
      res.locals.data.Store = {
        bib: {},
        searchKeywords: req.query.searchKeywords || '',
        error,
      };
      next();
    },
  );
}

function bibSearchAjax(req, res) {
  const bibId = req.query.bibId || '';

  fetchBib(
    bibId,
    data => res.json(data),
    error => res.json(error),
  );
}

export default {
  bibSearchServer,
  bibSearchAjax,
  fetchBib,
};
