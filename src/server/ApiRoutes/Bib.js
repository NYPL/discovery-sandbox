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

const holdingsMappings = {
  Location: 'location',
  Format: 'format',
  'Call Number': 'shelfMark',
  'Library Has': 'holdingStatement',
  Notes: 'notes',
};

const addHoldingDefinition = (holding) => {
  holding.holdingDefinition = Object.entries(holdingsMappings)
    .map(([key, value]) => ({ term: key, definition: holding[value] }))
    .filter(data => data.definition);
};

const findUrl = (location, urls) => {
  const matches = urls[location.code] || [];
  const longestMatch = matches.reduce(
    (acc, el) => (el.code.length > acc.code.length ? el : acc), matches[0]);
  if (!longestMatch || !longestMatch.url) return undefined;
  return longestMatch.url;
};

const checkInItemsForHolding = (holding) => {
  let location = '';
  let holdingLocationCode = '';
  let locationUrl;
  if (holding.location.length) {
    holdingLocationCode = holding.location[0].code;
    location = holding.location[0].label;
    locationUrl = holding.location[0].url;
  }
  const format = holding.format || '';
  if (!holding.checkInBoxes) return [];
  return holding.checkInBoxes.map(box => (
    {
      location,
      locationUrl,
      holdingLocationCode,
      format,
      position: box.position || 0,
      status: { prefLabel: box.status || '' },
      accessMessage: { '@id': 'accessMessage: 1', prefLabel: 'Use in library' },
      volume: box.coverage || '',
      callNumber: box.shelfMark || '',
      available: true,
      isSerial: true,
      requestable: false,
    }
  ));
};

const addCheckInItems = (bib) => {
  bib.checkInItems = bib
    .holdings
    .map(holding => checkInItemsForHolding(holding))
    .reduce((acc, el) => acc.concat(el), [])
    .filter(box => !['Expected', 'Late', 'Removed'].includes(box.status.prefLabel))
    .sort((box1, box2) => box2.position - box1.position);
};

const addLocationUrls = (bib) => {
  console.log('adding location urls');
  const holdingCodes = bib.holdings ?
    bib
      .holdings
      .map(holding => holding.location.reduce((acc, el) => acc.concat([el.code]), []))
      .reduce((acc, el) => acc.concat(el), [])
    : [];

  const itemCodes = bib.items.map(item =>
    item.holdingLocation.map(location => location['@id'])
  ).reduce((acc, el) => acc.concat(el), []);

  const codes = holdingCodes.concat(itemCodes).join(',');

  console.log('codes: ', codes);

  // get locations data by codes
  return nyplApiClient()
    .then(client => client.get(`/locations?location_codes=${codes}`))
    .then((resp) => {
      // add location urls for holdings
      if (bib.holdings) {
        bib.holdings.forEach((holding) => {
          holding.location.forEach((location) => {
            location.url = findUrl(location, resp);
          });
        });
      }
      // add item location urls;
      bib.items.forEach((item) => {
        if (item.holdingLocation) {
          item.holdingLocation.forEach((holdingLocation) => {
            console.log('finding for holding location: ', holdingLocation);
            if (holdingLocation['@id']) {
              console.log('found: ', holdingLocation['@id'], findUrl({ code: holdingLocation['@id'] }, resp));
              holdingLocation.url = findUrl({ code: holdingLocation['@id'] }, resp);
            }
          });
        }
      });
      console.log('addLocationUrls bib: ', JSON.stringify(bib, null, 2));
      return bib;
    })
    .catch((err) => { console.log('catching nypl client ', err)});
};

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
    .then(bib => addLocationUrls(bib))
    .then((bib) => {
      if (bib.holdings) {
        addCheckInItems(bib);
        // addLocationUrls(bib);
        console.log('bib: ', JSON.stringify(bib, null, 2));
        // const codes = bib
        //   .holdings
        //   .map(holding => holding.location.reduce((acc, el) => acc.concat([el.code]), []))
        //   .reduce((acc, el) => acc.concat(el), [])
        //   .join(',');
        //
        // return nyplApiClient()
        //   .then(client => client.get(`/locations?location_codes=${codes}`))
        //   .then((resp) => {
        //     bib.holdings.forEach((holding) => {
        //       holding.location.forEach((location) => {
        //         location.url = findUrl(location, resp);
        //         console.log('holdings: ', JSON.stringify(bib.holdings, null, 2), 'items: ', JSON.stringify(bib.items, null, 2), 'resp: ', resp);
        //       });
        //     });
        //     return bib;
        //   });
      }
      return bib;
    })
    .then((bib) => {
      // console.log('bib: ', JSON.stringify(bib, null, 2));
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
  const { features } = req.query;
  const urlEnabledFeatures = extractFeatures(features);

  fetchBib(
    bibId,
    data => resolve(data),
    error => resolve(error),
    {
      features: urlEnabledFeatures,
      fetchSubjectHeadingData: true,
    },
  );
}

export default {
  addHoldingDefinition,
  addCheckInItems,
  bibSearch,
  fetchBib,
  nyplApiClientCall,
};
