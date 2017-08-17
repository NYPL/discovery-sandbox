import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';

function fetchBib(bibId, cb, errorcb) {
  return nyplApiClient
    .get(`/discovery/resources/${bibId}`)
    .then(response => cb(response))
    .catch(error => {
      logger.error('Error attemping to fetch a Bib server side in fetchBib', error);

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
        searchKeywords: req.query.searchKeywords || '',
        error: {},
      };
      next();
    },
    (error) => {
      logger.error('Error in bibSearchServer API error', error);
      res.locals.data.Store = {
        bib: {},
        searchKeywords: req.query.searchKeywords || '',
        error,
      };
      next();
    }
  );
}

function bibSearchAjax(req, res) {
  const bibId = req.query.bibId || '';

  fetchBib(
    bibId,
    (data) => res.json(data),
    (error) => res.json(error)
  );
}

export default {
  bibSearchServer,
  bibSearchAjax,
  fetchBib,
};
