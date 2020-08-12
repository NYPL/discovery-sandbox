import axios from 'axios';

import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import extractFeatures from '../../app/utils/extractFeatures';

const nyplApiClientCall = (query, urlEnabledFeatures) => {
  // If on-site-edd feature enabled in front-end, enable it in discovery-api:
  const requestOptions = appConfig.features.includes('on-site-edd') || urlEnabledFeatures.includes('on-site-edd') ? { headers: { 'X-Features': 'on-site-edd' } } : {};
  return nyplApiClient().then(client => client.get(`/discovery/resources/${query}`, requestOptions));
};

const shepApiCall = bibId => axios(`${appConfig.shepApi}/bibs/${bibId}/subject_headings`);

function fetchBib(bibId, cb, errorcb, reqOptions) {
  const options = Object.assign({
    fetchSubjectHeadingData: true,
    features: [],
  }, reqOptions);
  return Promise.all([
    nyplApiClientCall(bibId, options.features),
    nyplApiClientCall(`${bibId}.annotated-marc`, options.features),
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
      if (options.fetchSubjectHeadingData && data.subjectLiteral && data.subjectLiteral.length) {
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
      return data;
    })
    .then(response => cb(response))
    .catch((error) => {
      logger.error(`Error attemping to fetch a Bib server side in fetchBib, id: ${bibId}`, error);

      errorcb(error);
    }); /* end axios call */
}

function bibSearch(req, res) {
  const bibId = req.query.bibId || '';
  const { features } = req.query;
  const urlEnabledFeatures = extractFeatures(features);

  fetchBib(
    bibId,
    data => res.json(data),
    error => res.json(error),
    {
      features: urlEnabledFeatures,
      fetchSubjectHeadingData: true,
    },
  );
}

export default {
  bibSearch,
  fetchBib,
  nyplApiClientCall,
};
