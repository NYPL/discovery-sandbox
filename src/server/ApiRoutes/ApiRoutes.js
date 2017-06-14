import express from 'express';
import axios from 'axios';

import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  mapObject as _mapObject,
  isArray as _isArray,
  forEach as _forEach,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import itemSearch from './itemSearch.js';
import {
  getReqParams,
  basicQuery,
} from '../../app/utils/utils.js';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];
const createAPIQuery = basicQuery({
  searchKeywords: '',
  sortBy: '',
  field: '',
  selectedFacets: {},
});
const axiosApiCall = (query) => axios.get(`${apiBase}/discovery/resources${query}`);

function MainApp(req, res, next) {
  res.locals.data.Store = {
    searchResults: {},
    selectedFacets: {},
    searchKeywords: '',
    facets: {},
    page: '1',
    sortBy: 'relevance',
    field: 'all',
    error: {},
  };

  next();
}

function search(searchKeywords, page, sortBy, order, field, filters, cb, errorcb) {
  const apiQuery = createAPIQuery({
    searchKeywords,
    sortBy: sortBy ? `${sortBy}_${order}` : '',
    selectedFacets: filters,
    field,
    page,
  });

  const aggregationQuery = `/aggregations?${apiQuery}`;
  const queryString = `?${apiQuery}&per_page=50`;

  axios
    .all([axiosApiCall(aggregationQuery), axiosApiCall(queryString)])
    .then(axios.spread((facets, response) => {
      cb(facets.data, response.data, page);
    }))
    .catch(error => {
      console.error(`Search error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function AjaxSearch(req, res) {
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

function ServerSearch(req, res, next) {
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

router
  .route('/search')
  .get(ServerSearch);

router
  .route('/advanced')
  .get(ServerSearch);

router
  .route('/hold/:id')
  .get(itemSearch.serverItemSearch);

router
  .route('/hold/request/:id')
  .get(itemSearch.newHoldRequest)
  .post(itemSearch.createHoldRequest);

router
  .route('/hold/confirmation/:id')
  .get(itemSearch.serverItemSearch);

router
  .route('/account')
  .get(itemSearch.account);

router
  .route('/item/:id')
  .get(itemSearch.serverItemSearch);

router
  .route('/api')
  .get(AjaxSearch);

router
  .route('/api/retrieve')
  .get(itemSearch.ajaxItemSearch);

router
  .route('/')
  .get(MainApp);

export default router;
