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

const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: '',
  field: '',
  selectedFacets: {},
});
const nyplApiClientCall = (query) => nyplApiClient.get(`/discovery/resources${query}`);

function search(searchKeywords, page, sortBy, order, field, filters, cb, errorcb) {
  const apiQuery = createAPIQuery({
    searchKeywords: encodeURIComponent(searchKeywords),
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFacets: filters,
    field,
    page,
  });

  // const aggregationQuery = `/aggregations?${apiQuery}`;
  const queryString = `?${apiQuery}&per_page=50`;

  // Also need to make an async call to with aggregationQuery eventually...
  // It use to be with axios.all to concurrently get both endpoints.
  nyplApiClientCall(queryString)
    .then((response) => {
      cb({}, response, page);
    })
    .catch(error => {
      console.error(`Search error: ${JSON.stringify(error, null, 2)}`);
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
    (facets, searchResults, pageQuery) => res.json({ facets, searchResults, pageQuery }),
    (error) => res.json(error)
  );
}

function searchServerPost(req, res) {
  const { fieldQuery, q, filters, sortQuery } = getReqParams(req.body);
  const { dateAfter, dateBefore } = req.body;
  // The filters from req.body may be an array of selected filters, or just an object
  // with one selected filter.
  const reqFilters = _isArray(filters) ? filters : [filters];
  const selectedFacets = parseServerSelectedFilters(reqFilters, dateAfter, dateBefore);
  let searchKeywords = q;
  let field = fieldQuery;
  let sortBy = sortQuery;

  if (req.query.q) {
    searchKeywords = req.query.q;
  }
  if (req.query.search_scope) {
    field = req.query.search_scope;
  }
  if (req.query.sort && req.query.sort_direction) {
    sortBy = `${req.query.sort}_${req.query.sort_direction}`;
  }

  const apiQuery = createAPIQuery({
    searchKeywords: encodeURIComponent(searchKeywords),
    selectedFacets,
    field,
    sortBy,
  });

  res.redirect(`${appConfig.baseUrl}/search?${apiQuery}`);
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
    (facets, data, pageQuery) => {
      const selectedFacets = {};

      if (!_isEmpty(filters)) {
        _mapObject(filters, (value, key) => {
          let facetObj;
          if (key === 'dateAfter' || key === 'dateBefore') {
            // Since only one date can be selected per date facet.
            selectedFacets[key] = {
              id: value,
              value: key === 'dateAfter' ? `after ${value}` : `before ${value}`,
            };
          } else if (_isArray(value) && value.length) {
            if (!selectedFacets[key]) {
              selectedFacets[key] = [];
            }
            _forEach(value, facetValue => {
              facetObj = _findWhere(facets.itemListElement, { field: key });
              const foundFacet =
                _isEmpty(facetObj) ? {} : _findWhere(facetObj.values, { value: facetValue });

              if (foundFacet && !_findWhere(selectedFacets[key], { id: foundFacet.value })) {
                selectedFacets[key].push({
                  id: foundFacet.value,
                  value: foundFacet.label || foundFacet.value,
                });
              }
            });
          } else if (typeof value === 'string') {
            facetObj = _findWhere(facets.itemListElement, { field: key });
            const foundFacet =
              _isEmpty(facetObj) ? {} : _findWhere(facetObj.values, { value });

            if (foundFacet && !_findWhere(selectedFacets[key], { id: foundFacet.value })) {
              selectedFacets[key] = [{
                id: foundFacet.value,
                value: foundFacet.label || foundFacet.value,
              }];
            }
          }
        });
      }

      res.locals.data.Store = {
        searchResults: data,
        selectedFacets,
        searchKeywords: q,
        facets,
        page: pageQuery,
        sortBy: sort ? `${sort}_${order}` : 'relevance',
        field: fieldQuery,
        error: {},
      };

      next();
    },
    (error) => {
      console.log('search error', error);
      res.locals.data.Store = {
        searchResults: {},
        selectedFacets: {},
        searchKeywords: '',
        facets: {},
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
