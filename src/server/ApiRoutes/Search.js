import {
  isArray as _isArray,
  pick as _pick,
} from 'underscore';
import appConfig from '../../app/data/appConfig';
import {
  getReqParams,
  basicQuery,
  parseServerSelectedFilters,
  standardizeBibId
} from '../../app/utils/utils';
import extractFeatures from '../../app/utils/extractFeatures';
import { buildQueryDataFromForm } from '../../app/utils/advancedSearchUtils';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import ResearchNow from './ResearchNow';
import createSelectedFiltersHash from '../../app/utils/createSelectedFiltersHash';
import { searchResultItemsListLimit as itemTableLimit } from '../../app/data/constants';
import {
  addHoldingDefinition,
  fetchLocationUrls,
  findUrl,
} from './Bib';

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: 'relevance',
  field: 'all',
  selectedFilters: {},
  identifierNumbers: {},
});

const nyplApiClientCall = (query, urlEnabledFeatures = []) => {
  const requestOptions = appConfig.features.includes('on-site-edd') || urlEnabledFeatures.includes('on-site-edd') ? { headers: { 'X-Features': 'on-site-edd' } } : {};
  return nyplApiClient()
    .then(client =>
      client.get(`/discovery/resources${query}`, requestOptions),
    );
};

function fetchResults(searchKeywords = '', contributor, title, subject, page, sortBy, order, field, filters, identifierNumbers, expressRes, cb, errorcb, features) {
  if (field === 'standard_number') {
    searchKeywords = standardizeBibId(searchKeywords)
  }

  const encodedQueryString = createAPIQuery({
    searchKeywords,
    contributor,
    title,
    subject,
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFilters: filters,
    field,
    page,
    identifierNumbers,
  });

  const aggregationQuery = `/aggregations?${encodedQueryString}`;
  // TODO: Why are we hard-coding per_page=50? Could we set this to the number
  // shown on Search Results pages (3)?
  const resultsQuery = `?${encodedQueryString}&per_page=50`;
  const queryObj = {
    query: { q: searchKeywords, contributor, title, subject, sortBy, order, field, filters },
  };

  let drbRequesting = true;
  const drbPromise = appConfig.features.includes('drb-integration') ?
    Promise.race([
      new Promise((resolve) => {
        setTimeout(() => {
          if (drbRequesting) logger.error('Drb timeout');
          return resolve([]);
        }, 5000);
      }),
      ResearchNow.search(queryObj)
        .then((res) => { drbRequesting = false; return res; })
        .catch((e) => {
          drbRequesting = false;
          logger.error('Drb error: ', e);
          return [];
        }),
    ])
    :
    null;

  // Get the following in parallel:
  //  - search results
  //  - aggregations
  //  - drb results
  Promise.all([
    nyplApiClientCall(resultsQuery, features),
    nyplApiClientCall(aggregationQuery, features),
    drbPromise,
  ])
    .then((response) => {
      const [results, aggregations, drbbResults] = response;
      if (identifierNumbers.redirectOnMatch && results.totalResults === 1) {
        const bnumber = results.itemListElement[0].result.uri;
        return expressRes.redirect(`${appConfig.baseUrl}/bib/${bnumber}`);
      }
      const locationCodes = new Set();
      const { itemListElement } = results;
      if (!itemListElement) {
        return cb(
          aggregations,
          results,
          page,
          drbbResults);
      }
      itemListElement.forEach((resultObj) => {
        const { result } = resultObj;
        const { holdings } = resultObj.result;
        if (!result.items && !result.holdings) return;
        if (holdings) {
          holdings.slice(0, itemTableLimit).forEach((holding) => {
            addHoldingDefinition(holding);
            if (holding.location) locationCodes.add(holding.location[0].code);
          });
          if (holdings.length < itemTableLimit) {
            result.items.slice(0, itemTableLimit - holdings.length).forEach((item) => {
              if (item.holdingLocation) item.holdingLocation.forEach((holdingLocation) => {
                locationCodes.add(holdingLocation['@id']);
              });
            });
          }
        } else if (result.items) {
          result.items.slice(0, itemTableLimit).forEach((item) => {
            if (item.holdingLocation) locationCodes.add(item.holdingLocation[0]['@id']);
          });
        }
      });
      const codes = Array.from(locationCodes).join(',');
      return fetchLocationUrls(codes).then((resp) => {
        itemListElement.forEach((resultObj) => {
          const { result } = resultObj;
          const items = result.items;
          if (!items) return results;
          items.slice(0, itemTableLimit).forEach((item) => {
            if (!item) return;
            if (item.holdingLocation) {
              item.holdingLocation[0].url = findUrl({ code: item.holdingLocation[0]['@id'] }, resp);
              item.locationUrl = item.holdingLocation[0].url
            }
            if (item.location) item.locationUrl = findUrl({ code: item.holdingLocationCode }, resp);
          });
        });
        return results;
      })
        .then(processedResults => cb(
          aggregations,
          processedResults,
          page,
          drbbResults))
        .catch((error) => {
          logger.error('Error making server search call in search function', error);
          errorcb(error);
        });
    })
    .catch(console.error);
}

function search(req, res, resolve) {
  const {
    page,
    q,
    contributor,
    title,
    subject,
    sort,
    order,
    fieldQuery,
    filters,
    issn,
    isbn,
    oclc,
    lccn,
    redirectOnMatch,
  } = getReqParams(req.query);

  const identifierNumbers = { issn, isbn, oclc, lccn, redirectOnMatch };

  const sortBy = sort.length ? [sort, order].filter(field => field.length).join('_') : 'relevance';

  // If user is making a search for periodicals,
  // add an issuance filter on the serial field and
  // switch field from 'journal_title' to 'title'
  let apiQueryField = fieldQuery;
  const additionalFilters = {};
  if (fieldQuery === 'journal_title') {
    additionalFilters.issuance = ['urn:biblevel:s'];
    apiQueryField = 'title';
  }
  const apiQueryFilters = { ...filters, ...additionalFilters };
  const urlEnabledFeatures = extractFeatures(req.query.features);

  fetchResults(
    q,
    contributor,
    title,
    subject,
    page,
    sort,
    order,
    apiQueryField,
    apiQueryFilters,
    identifierNumbers,
    res,
    (apiFilters, searchResults, pageQuery, drbbResults) => resolve({
      filters: apiFilters,
      searchResults,
      page: pageQuery,
      drbbResults,
      selectedFilters: createSelectedFiltersHash(filters, apiFilters),
      searchKeywords: q,
      sortBy,
      field: fieldQuery,
      contributor,
      title,
      subject,
    }),
    error => resolve(error),
    urlEnabledFeatures,
  );
}

function searchServerPost(req, res) {
  if (req.body.advancedSearch) {
    return res.redirect(`${appConfig.baseUrl}/search?${createAPIQuery(buildQueryDataFromForm(Object.entries(req.body)))}`);
  }

  const { fieldQuery, q, filters, sortQuery } = getReqParams(req.body);
  const { dateAfter, dateBefore } = req.body;
  // The filters from req.body may be an array of selected filters, or just an object
  // with one selected filter.
  const reqFilters = _isArray(filters) ? filters : [filters];

  const selectedFilters = parseServerSelectedFilters(reqFilters, dateAfter, dateBefore);
  let searchKeywords = q;
  let field = fieldQuery;
  let sortBy = sortQuery;

  if (req.query.q) {
    searchKeywords = req.query.q;
  }

  if (dateAfter && dateBefore) {
    if (Number(dateAfter) > Number(dateBefore)) {
      return res.redirect(`${appConfig.baseUrl}/search?q=${searchKeywords}&` +
        'error=dateFilterError#popup-no-js');
    }
  }

  if (req.query.search_scope) {
    field = req.query.search_scope;
  }
  if (req.query.sort && req.query.sort_direction) {
    sortBy = `${req.query.sort}_${req.query.sort_direction}`;
  }

  const apiQuery = createAPIQuery({
    searchKeywords: encodeURIComponent(searchKeywords),
    selectedFilters,
    field,
    sortBy,
  });

  return res.redirect(`${appConfig.baseUrl}/search?${apiQuery}`);
}

export default {
  searchServerPost,
  search,
};
