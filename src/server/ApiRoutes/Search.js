import {
  isArray as _isArray,
  pick as _pick,
} from 'underscore';
import appConfig from '../../app/data/appConfig';
import {
  getReqParams,
  basicQuery,
  parseServerSelectedFilters,
} from '../../app/utils/utils';
import extractFeatures from '../../app/utils/extractFeatures';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import ResearchNow from './ResearchNow';
import createSelectedFiltersHash from '../../app/utils/createSelectedFiltersHash';
import { searchResultItemsListLimit as itemTableLimit } from '../../app/data/constants';
import {
  addHoldingDefinition,
  addCheckInItems,
  addLocationUrls,
} from './Bib';

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: 'relevance',
  field: 'all',
  selectedFilters: {},
});

const nyplApiClientCall = (query, urlEnabledFeatures = []) => {
  const requestOptions = appConfig.features.includes('on-site-edd') || urlEnabledFeatures.includes('on-site-edd') ? { headers: { 'X-Features': 'on-site-edd' } } : {};

  return nyplApiClient()
    .then(client =>
      client.get(`/discovery/resources${query}`, requestOptions),
    );
};

function fetchResults(searchKeywords = '', page, sortBy, order, field, filters, cb, errorcb, features) {
  const encodedResultsQueryString = createAPIQuery({
    searchKeywords,
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFilters: filters,
    field,
    page,
  });
  const encodedAggregationsQueryString = createAPIQuery({
    searchKeywords,
    selectedFilters: filters,
    field,
  });

  const aggregationQuery = `/aggregations?${encodedAggregationsQueryString}`;
  const resultsQuery = `?${encodedResultsQueryString}&per_page=50`;
  const queryObj = {
    query: { q: searchKeywords, sortBy, order, field, filters },
  };

  // Need to get both results and aggregations before proceeding.
  Promise.all([
    nyplApiClientCall(resultsQuery, features),
    nyplApiClientCall(aggregationQuery, features)])
    .then(response => ResearchNow.search(queryObj)
      .then((drbbResults) => {
        response.push(drbbResults);
        return response;
      })
      .catch(console.error))
    .then((response) => {
      const [results, aggregations, drbbResults] = response;
      return Promise.all(results.itemListElement.map((resultObj) => {
        const { result } = resultObj;
        return addLocationUrls(result).then((updatedResult) => {
          const { holdings } = updatedResult;
          if (!holdings) return { ...resultObj, updatedResult };
          addCheckInItems(updatedResult);
          holdings.slice(0, itemTableLimit).forEach(
            holding => addHoldingDefinition(holding));
          return { ...resultObj, updatedResult };
        });
      })).then((processedItems) => {
        return ({
          aggregations,
          results: {
            ...results,
            itemListElement: processedItems,
          },
          drbbResults,
        });
      });
    })
    .then((combinedResults) => {
      const { aggregations, results, drbbResults } = combinedResults;
      cb(aggregations, results, page, drbbResults);
    })
    .catch((error) => {
      logger.error('Error making server search call in search function', error);
      errorcb(error);
    });
}

function search(req, res, resolve) {
  const { page, q, sort, order, fieldQuery, filters } = getReqParams(req.query);

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
    page,
    sort,
    order,
    apiQueryField,
    apiQueryFilters,
    (apiFilters, searchResults, pageQuery, drbbResults) => resolve({
      filters: apiFilters,
      searchResults,
      page: pageQuery,
      drbbResults,
      selectedFilters: createSelectedFiltersHash(filters, apiFilters),
      searchKeywords: q,
      sortBy,
      field: fieldQuery,
    }),
    error => resolve(error),
    urlEnabledFeatures,
  );
}

function searchServerPost(req, res) {
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
