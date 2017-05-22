import express from 'express';
import axios from 'axios';

import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  forEach as _forEach,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import itemSearch from './itemSearch.js';

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
  return axios.get(`${apiBase}/discovery/resources/aggregations?q=${query}`);
}

function search(query, page, sortBy, order, field, filters = '', cb, errorcb) {
  let sortQuery = '';
  let fieldQuery = '';

  if (sortBy !== '') {
    sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
  }

  if (field !== '' && field !== 'all') {
    fieldQuery = `&search_scope=${field}`
  }

  const apiQuery = `?q=${query}&per_page=50&page=${page}${sortQuery}${fieldQuery}${filters}`;
  const queryString = `${apiBase}/discovery/resources${apiQuery}`;
  const apiCall = axios.get(queryString);
console.log(queryString)
  axios
    .all([getAggregations(query), apiCall])
    .then(axios.spread((facets, response) => {
      cb(facets.data, response.data, page)
    }))
    .catch(error => {
      console.error(`Search error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function AjaxSearch(req, res) {
  const {
    q = '',
    pageQuery = '1',
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
    pageQuery,
    sortBy,
    order,
    field,
    filterString,
    (facets, searchResults, page) => res.json({ facets, searchResults, page }),
    (error) => res.json(error)
  );
}

function ServerSearch(req, res, next) {
  const pageQuery = req.query.page || '1';
  const q = req.query.q || '';
  const sortBy = req.query.sort || '';
  const order = req.query.sort_direction || '';
  const fieldQuery = req.query.search_scope || '';
  let spaceIndex = '';

  // Slightly hacky right now but need to get all keywords in case
  // it's more than one word.
  if (q.indexOf(':') !== -1) {
    spaceIndex = (q.substring(0, q.indexOf(':'))).lastIndexOf(' ');
  } else {
    // spaceIndex = q.indexOf(' ') !== -1 ? q.length : q.indexOf(' ');
    spaceIndex = q.length;
  }

  const searchKeywords = q.substring(0, spaceIndex);

  search(
    q,
    pageQuery,
    sortBy,
    order,
    fieldQuery,
    '',
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

      // Easier to break if facet values have a # instead of an empty space. There might
      // be a better solution for this...
      const urlFacets = q.substring(spaceIndex + 1);

      if (urlFacets) {
        const facetStrArray = q.substring(spaceIndex + 1).replace(/\" /, '"#').split('#');

        facetStrArray.forEach(str => {
          if (!str) return;

          // Each string appears like so: 'contributor:"United States. War Department."'
          // Can't simply split by ':' because some strings are: 'owner:"orgs:1000"'
          const field = str.split(':"')[0];
          const value = str.split(':"')[1].replace('"', '');
          const searchValue = field === 'date' ? parseInt(value, 10) : value;

          // Now find the facet from the URL from the returned facets in the API.
          const facetObj = _findWhere(facets.itemListElement, { field });
          const facet = _findWhere(facetObj.values, { value: searchValue });

          selectedFacets[field] = {
            id: facet.value,
            value: facet.label || facet.value,
          };
        });
      }

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
