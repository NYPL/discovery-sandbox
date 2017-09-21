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
  selectedFacets: {},
});

const nyplApiClientCall = (query) =>
  nyplApiClient().then(client => client.get(`/discovery/resources${query}`, { cache: false }));

function search(searchKeywords, page, sortBy, order, field, filters, cb, errorcb) {
  const apiQuery = createAPIQuery({
    searchKeywords,
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFacets: filters,
    field,
    page,
  });

  console.log(searchKeywords);

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
    selectedFacets,
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
    (facets, data, pageQuery) => {
      const selectedFacets = {
        materialType: [],
        language: [],
        dateAfter: '',
        dateBefore: '',
      };

      if (!_isEmpty(filters)) {
        _mapObject(filters, (value, key) => {
          let facetObj;
          if (key === 'dateAfter' || key === 'dateBefore') {
            selectedFacets[key] = value;
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
                  selected: true,
                  value: foundFacet.value,
                  label: foundFacet.label || foundFacet.value,
                  count: foundFacet.count,
                });
              }
            });
          } else if (typeof value === 'string') {
            facetObj = _findWhere(facets.itemListElement, { field: key });
            const foundFacet = _isEmpty(facetObj) ? {} : _findWhere(facetObj.values, { value });

            if (foundFacet && !_findWhere(selectedFacets[key], { id: foundFacet.value })) {
              selectedFacets[key] = [{
                selected: true,
                value: foundFacet.value,
                label: foundFacet.label || foundFacet.value,
                count: foundFacet.count,
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
      logger.error('Error retrieving search data in searchServer', error);
      res.locals.data.Store = {
        searchResults: {},
        selectedFacets: {
          materialType: [],
          language: [],
          dateAfter: '',
          dateBefore: '',
        },
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
