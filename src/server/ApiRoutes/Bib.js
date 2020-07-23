import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import axios from 'axios';
import SubjectHeadings from './SubjectHeadings';

const nyplApiClientCall = (query) => {
  // If on-site-edd feature enabled in front-end, enable it in discovery-api:
  const requestOptions = appConfig.features.includes('on-site-edd') ? { headers: { 'X-Features': 'on-site-edd' } } : {};
  return nyplApiClient().then(client => client.get(`/discovery/resources/${query}`, { headers: { 'X-Features': 'on-site-edd' } }));
}

const shepApiCall = bibId => axios(`${appConfig.shepApi}/bibs/${bibId}/subject_headings`)

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
    .then((data) => {
      if (data.subjectLiteral && data.subjectLiteral.length) {
        return shepApiCall(bibId)
          .then((shepRes) => {
            data.subjectHeadingData = shepRes.data.subject_headings;
            return data;
          })
          .catch((error) => {
            logger.error(`Error in shepApiCall API error, bib_id: ${bibId}`, error);
            return data;
          });
      }
      return data
    })
    .then(response => cb(response))
    .catch((error) => {
      logger.error(`Error attemping to fetch a Bib server side in fetchBib, id: ${bibId}`, error);

      errorcb(error);
    }); /* end axios call */
}

function bibSearch(req, res) {
  const bibId = req.query.bibId || '';

  fetchBib(
    bibId,
    data => res.json(data),
    error => res.json(error),
  );
}

export default {
  bibSearch,
  fetchBib,
  nyplApiClientCall,
};
