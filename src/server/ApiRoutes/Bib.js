import axios from 'axios';

import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';

const nyplApiClientCall = (query) => {
  // If on-site-edd feature enabled in front-end, enable it in discovery-api:
  const requestOptions = appConfig.features.includes('on-site-edd') ? { headers: { 'X-Features': 'on-site-edd' } } : {};
  return nyplApiClient().then(client => client.get(`/discovery/resources/${query}`, requestOptions));
};

const shepApiCall = bibId => axios(`${appConfig.shepApi}/bibs/${bibId}/subject_headings`);

const holdingsMappings = {
  location: {
    to: 'Location',
    mapping: location => location.label,
  },
  format: {
    to: 'Format',
    mapping: x => x,
  },
  shelfMark: {
    to: 'Call Number',
    mapping: x => x,
  },
  holdingStatement: {
    to: 'Library Has',
    mapping: x => x,
  },
  note: {
    to: 'Note',
    mapping: x => x,
  },
};

const addHoldingDefinition = (holding) => {
  holding.holdingDefinition = [
    {
      term: 'Location',
      definition: holding.location.map(location => location.label),
    },
    {
      term: 'Format',
      definition: holding.format,
    },
    {
      term: 'Call Number',
      definition: holding.shelfMark,
    },
    {
      term: 'Library Has',
      definition: holding.holdingStatement,
    },
    {
      term: 'Note',
      definition: holding.note,
    },
  ].filter(data => data.definition);
};

// const addHoldingDefinition = (holding) => {
//   holding.holdingDefinition = Object.entries(holdingsMappings)
//     .map((mappingsKey, mappingsValue) =>
//       (Array.isArray(holding[mappingsKey])
//         ?
//         holding[mappingsKey].map(value => (
//           {
//             term: mappingsValue.to,
//             definition: mappingsValue.mapping(value),
//           }
//         ))
//         :
//         holding[mappingsKey]
//       ),
//     ).reduce((acc, el) => acc.concat(el), []);
// };

function fetchBib(bibId, cb, errorcb, options = { fetchSubjectHeadingData: true }) {
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
    .then((bib) => {
      bib.holdings.forEach((holding) => {
        Object.keys(holding).forEach((key) => {
          if (Array.isArray(holding[key])) {
            holding[key] = holding[key].concat(holding[key])
          }
        },
        );
      });
      console.log('bib: ', JSON.stringify(bib.holdings, null, 2));
      if (bib.holdings) {
        bib.holdings.forEach(holding => addHoldingDefinition(holding));
      }
      if (options.fetchSubjectHeadingData && bib.subjectLiteral && bib.subjectLiteral.length) {
        return shepApiCall(bibId)
          .then((shepRes) => {
            bib.subjectHeadingData = shepRes.data.subject_headings;
            return { bib };
          })
          .catch((error) => {
            logger.error(`Error in shepApiCall API error, bib_id: ${bibId}`, error);
            return { bib };
          });
      }
      return { bib };
    })
    .then(bib => cb(bib))
    .catch((error) => {
      logger.error(`Error attemping to fetch a Bib in fetchBib, id: ${bibId}`, error);

      errorcb(error);
    }); /* end axios call */
}

function bibSearch(req, res, resolve) {
  const bibId = req.params.bibId;


  fetchBib(
    bibId,
    data => resolve(data),
    error => resolve(error),
  );
}

export default {
  bibSearch,
  fetchBib,
  nyplApiClientCall,
};
