import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import axios from 'axios';
import SubjectHeadings from './SubjectHeadings';

const nyplApiClientCall = query =>
  nyplApiClient().then(client => client.get(`/discovery/resources/${query}`, { cache: false }));

const shepApiCall = bibId => axios({
  method: 'GET',
  url: `${appConfig.shepApi}/bibs/${bibId}/subject_headings`,
  crossDomain: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

function fetchBib(bibId, cb, errorcb) {
  return Promise.all([
    nyplApiClientCall(bibId),
    nyplApiClientCall(`${bibId}.annotated-marc`),
  ])
    .then((response) => {
      // First response is jsonld formatting:
      const data = response[0];
      // Assign second response (annotated-marc formatting) as property of bib:
      data.annotatedMarc = response[1];
      // Make sure retrieved annotated-marc document is valid:
      if (!data.annotatedMarc || !data.annotatedMarc.bib) data.annotatedMarc = null;

      return data;
    })
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

      if (data.subjectLiteral.length) {
        return SubjectHeadings.shepApiCall(`/bibs/${bibId}/subject_headings`)
          .then((shepRes) => {
            console.log(shepRes.data);
            data.subjectHeadingData = shepRes.data.subject_headings;
            res.locals.data.Store = {
              bib: data,
              searchKeywords: req.query.searchKeywords || '',
              error: {},
            };
            next();
          })
          .catch((error) => {
            logger.error(`Error in shepApiCall API error, bib_id: ${bibId}`, error);
            res.locals.data.Store = {
              bib: data,
              searchKeywords: req.query.searchKeywords || '',
              error,
            };
            next();
          });
      }
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
  nyplApiClientCall,
};
