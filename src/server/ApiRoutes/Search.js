import {
  isArray as _isArray,
} from 'underscore';

import appConfig from '../../app/data/appConfig';
import {
  getReqParams,
  basicQuery,
  parseServerSelectedFilters,
} from '../../app/utils/utils';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import ResearchNow from './ResearchNow';

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: '',
  field: '',
  selectedFilters: {},
});

const nyplApiClientCall = query =>
  nyplApiClient()
    .then(client =>
      client.get(`/discovery/resources${query}`, { cache: false }),
    );

function search(searchKeywords = '', page, sortBy, order, field, filters, cb, errorcb) {
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
  const queryObj = { query: { q: searchKeywords, sortBy, order, field, filters } };

  // Need to get both results and aggregations before proceeding.
  Promise.all([
    nyplApiClientCall(resultsQuery),
    nyplApiClientCall(aggregationQuery)])
    .then(response => ResearchNow.search(queryObj)
      .then((drbbResults) => {
        response.push(drbbResults);
        return response;
      })
      .catch(console.error))
    .then((response) => {
      const [results, aggregations, drbbResults] = response;
      cb(aggregations, results, page, drbbResults);
    })
    .catch((error) => {
      logger.error('Error making server search call in search function', error);
      errorcb(error);
    });
}

function searchAjax(req, res) {
  const { page, q, sort, order, fieldQuery, filters } = getReqParams(req.query);

  search(
    q,
    page,
    sort,
    order,
    fieldQuery,
    filters,
    (apiFilters, searchResults, pageQuery, drbbResults) => res.json({
      filters: apiFilters,
      searchResults,
      pageQuery,
      drbbResults,
    }),
    error => res.json(error),
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
  searchAjax,
  search,
};
