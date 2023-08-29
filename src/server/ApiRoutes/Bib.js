import axios from 'axios';

import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import extractFeatures from '../../app/utils/extractFeatures';
import { itemBatchSize } from '../../app/data/constants';
import { isNyplBnumber, standardizeBibId } from '../../app/utils/utils';
import { appendDimensionsToExtent } from '../../app/utils/appendDimensionsToExtent';

const nyplApiClientCall = (query, itemFrom, filterItemsStr = "") => {
  const itemRelatedQueries = []
  if (typeof itemFrom !== 'undefined') itemRelatedQueries.push(`items_size=${itemBatchSize}&items_from=${itemFrom}`)
  let fullQuery;
  if (query.includes('.annotated-marc')) {
    fullQuery = query;
  } else {
    if (filterItemsStr.length) itemRelatedQueries.push(`${filterItemsStr}`)
    itemRelatedQueries.push('merge_checkin_card_items=true')
    fullQuery = `${query}?${itemRelatedQueries.join('&')}`
  }
  return nyplApiClient({ apiName: 'discovery' })
    .then(client => {
      return client.get(
        `/discovery/resources/${fullQuery}`
      )
    }
    );
};

const shepApiCall = (bibId) => {
  const source = axios.CancelToken.source()
  const timeout = setTimeout(() => {
    source.cancel()
  }, 5000)
  return axios({
    method: 'get',
    url: `${appConfig.shepApi}/bibs/${bibId}/subject_headings`,
    timeout: 4000,
    cancelToken: source.token
  }).then((response) => {
    clearTimeout(timeout)
    return response
  }).catch((e) => {
    if (axios.isCancel(e)) {
      console.log('SHEP Api connection timeout')
    }
  })
};

const holdingsMappings = {
  Location: 'location',
  Format: 'format',
  'Call Number': 'shelfMark',
  'Library Has': 'holdingStatement',
  Notes: 'notes',
};

export const addHoldingDefinition = (holding) => {
  holding.holdingDefinition = Object.entries(holdingsMappings)
    .map(([key, value]) => ({ term: key, definition: holding[value] }))
    .filter(data => data.definition);
};

function fetchBib(bibId, cb, errorcb, reqOptions, res) {
  // Redirect if bibId has a Check Digit
  const standardBibId = standardizeBibId(bibId)
  if (standardBibId !== bibId) { res.redirect(`${appConfig.baseUrl}/bib/${standardBibId}`); }

  const options = Object.assign({
    fetchSubjectHeadingData: true,
    features: [],
  }, reqOptions);
  // Determine if it's an NYPL bibId:
  const isNYPL = isNyplBnumber(bibId);
  return Promise.all([
    nyplApiClientCall(bibId, reqOptions.itemFrom || 0, reqOptions.filterItemsStr),
    // Don't fetch annotated-marc for partner records:
    isNYPL ? nyplApiClientCall(`${bibId}.annotated-marc`) : null,
  ])
    .then((response) => {
      // First response is jsonld formatting:
      const data = response[0];
      // Assign second response (annotated-marc formatting) as property of bib:
      data.annotatedMarc = response[1];
      // Make sure retrieved annotated-marc document is valid:
      if (!data.annotatedMarc || !data.annotatedMarc.bib)
        data.annotatedMarc = null;
      return data;
    })
    .then((bib) => {
      const status = (!bib || !bib.uri || !bibId.includes(bib.uri)) ? '404' : '200';
      if (status === '404') {
        return nyplApiClient()
          .then(client => client.get(`/bibs/sierra-nypl/${bibId.slice(1)}`))
          .then((resp) => {
            const classic = appConfig.legacyBaseUrl;
            if (resp.statusCode === 200) { res.redirect(`${appConfig.circulatingCatalog}/iii/encore/record/C__R${bibId}`); }
          })
          .catch((err) => {
            console.log('error: ', err);
            console.log('bib not found');
          })
          .then(() => {
            res.status(404);
            return Object.assign({ status }, bib);
          });
      }
      return Object.assign({ status }, bib);
    })
    .then((bib) => {
      return appendDimensionsToExtent(bib)
    })
    .then((bib) => {
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
  const query = req.query;
  const { features, item_page = 1, items_from } = req.query;
  const urlEnabledFeatures = extractFeatures(features);
  delete query.items_from;

  let filterItemsStr = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  return fetchBib(
    bibId,
    data => resolve(data),
    error => resolve(error),
    {
      features: urlEnabledFeatures,
      fetchSubjectHeadingData: true,
      // If items_from is set, use that value, otherwise calculate it
      // based on the current page and the batch size.
      itemFrom: items_from ? items_from : (item_page - 1) * itemBatchSize,
      filterItemsStr
    },
    res,
  );
}

export default {
  addHoldingDefinition,
  bibSearch,
  fetchBib,
  nyplApiClientCall,
  appendDimensionsToExtent,
};
