import express from 'express';
import axios from 'axios';

import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  forEach as _forEach,
  mapObject as _mapObject,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import itemSearch from './itemSearch.js';
import { getFacetFilterParam } from '../../app/utils/utils.js';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const apiBase = appConfig.api[appEnvironment];

function MainApp(req, res, next) {
  res.locals.data.Store = {
    searchResults: {},
    selectedFacets: {},
    searchKeywords: '',
    facets: {},
    page: '1',
    sortBy: 'relevance',
    field: 'all',
  };

  next();
}

function getAggregations(query) {
  return axios.get(`${apiBase}/discovery/resources/aggregations${query}`);
}

function search(query, page, sortBy, order, field, filters = '', cb, errorcb) {
  let sortQuery = '';
  let fieldQuery = '';
  let searchQuery = '';

  if (query !== '') {
    searchQuery = `q=${query}`;
  }

  if (sortBy !== '') {
    sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
  }

  if (field !== '' && field !== 'all') {
    fieldQuery = `&search_scope=${field}`;
  }

  const apiQuery = `?${searchQuery}&per_page=50&page=${page}${sortQuery}${fieldQuery}${filters}`;
  const aggregationQuery = `?${searchQuery}${fieldQuery}${filters}`;
  const queryString = `${apiBase}/discovery/resources${apiQuery}`;
  const apiCall = axios.get(queryString);

  axios
    .all([getAggregations(aggregationQuery), apiCall])
    .then(axios.spread((facets, response) => {
      cb(facets.data, response.data, page);
    }))
    .catch(error => {
      console.error(`Search error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function AjaxSearch(req, res) {
  const {
    q = '',
    page = '1',
    sortBy = '',
    order = '',
    field = '',
    filters = '',
  } = req.query;

  let filterString = '';
  _forEach(filters, (value, key) => {
    filterString += `&filters[${key}]=${value}`;
  });

  search(
    q,
    page,
    sortBy,
    order,
    field,
    filterString,
    (facets, searchResults, pageQuery) => res.json({ facets, searchResults, pageQuery }),
    (error) => res.json(error)
  );
}

function ServerSearch(req, res, next) {
  const pageQuery = req.query.page || '1';
  const searchKeywords = req.query.q || '';
  const sortBy = req.query.sort || '';
  const order = req.query.sort_direction || '';
  const fieldQuery = req.query.search_scope || '';
  const filters = req.query.filters || {};
  const filterString = getFacetFilterParam(filters);

  search(
    searchKeywords,
    pageQuery,
    sortBy,
    order,
    fieldQuery,
    filterString,
    (facets, data, page) => {
      const selectedFacets = {};

      // Populate the object with empty facet values
      if (!_isEmpty(facets) && facets.itemListElement.length) {
        _forEach(facets.itemListElement, (facet) => {
          selectedFacets[facet.field] = {
            id: '',
            value: '',
          };
        });
      }

      _mapObject(filters, (value, key) => {
        let facetObj;
        let facet;

        if (key === 'dateAfter' || key === 'dateBefore') {
          facet = {
            id: value,
            value: key === 'dateAfter' ? `after ${value}` : `before ${value}`,
          };
        } else {
          facetObj = _findWhere(facets.itemListElement, { field: key });
          facet = _isEmpty(facetObj) ? {} : _findWhere(facetObj.values, { value });
        }

        selectedFacets[key] = {
          id: facet.value,
          value: facet.label || facet.value,
        };
      });

      res.locals.data.Store = {
        searchResults: data,
        selectedFacets,
        searchKeywords,
        facets,
        page,
        sortBy: sortBy ? `${sortBy}_${order}` : 'relevance',
        field: fieldQuery,
      };

      next();
    },
    (error) => {
      console.log(error);
      res.locals.data.Store = {
        searchResults: {},
        selectedFacets: {},
        searchKeywords: '',
        facets: {},
        page: '1',
        sortBy: 'relevance',
        field: 'all',
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
