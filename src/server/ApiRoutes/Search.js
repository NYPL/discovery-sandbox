import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  mapObject as _mapObject,
  isArray as _isArray,
  forEach as _forEach,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import {
  getReqParams,
  basicQuery,
  parseServerSelectedFilters,
} from '../../app/utils/utils.js';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: '',
  field: '',
  selectedFilters: {},
});

const nyplApiClientCall = (query) =>
  nyplApiClient().then(client => client.get(`/discovery/resources${query}`, { cache: false }));

function search(searchKeywords, page, sortBy, order, field, filters, cb, errorcb) {
  const apiQuery = createAPIQuery({
    searchKeywords,
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFilters: filters,
    field,
    page,
  });

  const aggregationQuery = `/aggregations?${apiQuery}`;
  const queryString = `?${apiQuery}&per_page=50`;

  // Need to get both results and aggregations before proceeding.
  Promise.all([nyplApiClientCall(queryString), nyplApiClientCall(aggregationQuery)])
    .then(response => {
      const [results, aggregations] = response;
      cb(aggregations, results, page);
    })
    .catch(error => {
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
    (apiFilters, searchResults, pageQuery) => res.json({
      filters: apiFilters,
      searchResults,
      pageQuery,
    }),
    (error) => res.json(error)
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

  if (!searchKeywords) {
    return res.redirect(`${appConfig.baseUrl}/search?error=noKeyword`);
  }

  if (dateAfter && dateBefore) {
    if (Number(dateAfter) > Number(dateBefore)) {
      return res.redirect(`${appConfig.baseUrl}/search?q=${searchKeywords}&error=dateFilterError`);
    }
  }

  const updatedSearchKeywords = searchKeywords === '*' ? '' : searchKeywords;

  if (req.query.search_scope) {
    field = req.query.search_scope;
  }
  if (req.query.sort && req.query.sort_direction) {
    sortBy = `${req.query.sort}_${req.query.sort_direction}`;
  }

  const apiQuery = createAPIQuery({
    searchKeywords: encodeURIComponent(updatedSearchKeywords),
    selectedFilters,
    field,
    sortBy,
  });

  return res.redirect(`${appConfig.baseUrl}/search?${apiQuery}`);
}

function searchServer(req, res, next) {
  const { page, q, sort, order, fieldQuery, filters } = getReqParams(req.query);

  search(
    q,
    page,
    sort,
    order,
    fieldQuery,
    filters,
    (apiFilters, data, pageQuery) => {
      const selectedFilters = {
        materialType: [],
        language: [],
        dateAfter: '',
        dateBefore: '',
      };

      if (!_isEmpty(filters)) {
        _mapObject(filters, (value, key) => {
          let filterObj;
          if (key === 'dateAfter' || key === 'dateBefore') {
            selectedFilters[key] = value;
          } else if (_isArray(value) && value.length) {
            if (!selectedFilters[key]) {
              selectedFilters[key] = [];
            }
            _forEach(value, filterValue => {
              filterObj = _findWhere(apiFilters.itemListElement, { field: key });
              const foundFilter =
                _isEmpty(filterObj) ? {} : _findWhere(filterObj.values, { value: filterValue });

              if (foundFilter && !_findWhere(selectedFilters[key], { id: foundFilter.value })) {
                selectedFilters[key].push({
                  selected: true,
                  value: foundFilter.value,
                  label: foundFilter.label || foundFilter.value,
                  count: foundFilter.count,
                });
              }
            });
          } else if (typeof value === 'string') {
            filterObj = _findWhere(apiFilters.itemListElement, { field: key });
            const foundFilter = _isEmpty(filterObj) ? {} : _findWhere(filterObj.values, { value });

            if (foundFilter && !_findWhere(selectedFilters[key], { id: foundFilter.value })) {
              selectedFilters[key] = [{
                selected: true,
                value: foundFilter.value,
                label: foundFilter.label || foundFilter.value,
                count: foundFilter.count,
              }];
            }
          }
        });
      }

      res.locals.data.Store = {
        searchResults: data,
        selectedFilters,
        searchKeywords: q,
        filters: apiFilters,
        page: pageQuery,
        sortBy: sort ? `${sort}_${order}` : 'relevance',
        field: fieldQuery,
        error: {},
      };

      next();
    },
    (error) => {
      logger.error('Error retrieving search data in searchServer', error);
      res.locals.data.Store = {
        searchResults: {},
        selectedFilters: {
          materialType: [],
          language: [],
          dateAfter: '',
          dateBefore: '',
        },
        searchKeywords: '',
        filters: {},
        page: '1',
        sortBy: 'relevance',
        field: 'all',
        error,
      };

      next();
    }
  );
}

export default {
  searchServerPost,
  searchServer,
  searchAjax,
  search,
};
