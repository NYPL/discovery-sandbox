import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  mapObject as _mapObject,
  isArray as _isArray,
  forEach as _forEach,
} from 'underscore';

import appConfig from '../../../appConfig';
import {
  getReqParams,
  basicQuery,
  parseServerSelectedFilters,
} from '../../app/utils/utils';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: '',
  field: '',
  selectedFilters: {},
});

const nyplApiClientCall = query =>
  nyplApiClient()
    .then((client) => {
      // console.log("client: ", client);
      return client.get(`/discovery/resources${query}`, { cache: false })
        .then(resp => {console.log("resp: ", JSON.stringify(resp, null, 4)); return resp})
        .catch(error => console.log("error message: ", error.message));
    })
    .catch((error) => {
      console.log("error message: ", error.message);
    });

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

  // Need to get both results and aggregations before proceeding.
  Promise.all([nyplApiClientCall(resultsQuery), nyplApiClientCall(aggregationQuery)])
    .then((response) => {
      const [results, aggregations] = response;
      cb(aggregations, results, page);
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
    (apiFilters, searchResults, pageQuery) => res.json({
      filters: apiFilters,
      searchResults,
      pageQuery,
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

      // The purpose of the following is to create `selectedFilters` hash that
      // maps property names (e.g materialType, title) to arrays of filters
      // (e.g. [{ value: 'resourcetypes:aud', label: 'Audio' }]), which are
      // used 1) in subsequent searches and 2) to build a human readable
      // description of results (e.g. 'Displaying 1-100 for title "Romeo"').
      // The actual filter in the query string includes only the raw value
      // filtered on (e.g. 'resourcetypes:aud'), so we need to get the label
      // (e.g. 'Audio'). Because all searches accompany an aggregations query
      // with the same clauses, we can lean on the aggregations response to
      // derive a label for any raw filter value.
      // TODO: This should really be centralized as it seems to happen in a few
      // places.
      if (!_isEmpty(filters)) {
        _mapObject(filters, (value, key) => {
          let filterObj;
          if (key === 'dateAfter' || key === 'dateBefore') {
            selectedFilters[key] = value;
          } else if (_isArray(value) && value.length) {
            if (!selectedFilters[key]) {
              selectedFilters[key] = [];
            }
            _forEach(value, (filterValue) => {
              filterObj =
                _findWhere(apiFilters.itemListElement, { field: key });
              const foundFilter =
                _isEmpty(filterObj) ? {} :
                  _findWhere(filterObj.values, { value: filterValue });

              if (foundFilter &&
                  !_findWhere(selectedFilters[key], { id: foundFilter.value })) {
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
            const foundFilter = _isEmpty(filterObj) ? {} :
              _findWhere(filterObj.values, { value });

            if (foundFilter &&
                !_findWhere(selectedFilters[key], { id: foundFilter.value })) {
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
    },
  );
}

export default {
  searchServerPost,
  searchServer,
  searchAjax,
  search,
};
