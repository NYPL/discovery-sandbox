import express from 'express';
import axios from 'axios';

import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  forEach as _forEach,
} from 'underscore';

import appConfig from '../../../appConfig.js';

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

function getFacets(query) {
  return axios.get(`${apiBase}/discovery/resources/aggregations?q=${query}`);
}

function Search(query, page, sortBy, order, field, cb, errorcb) {
  let sortQuery = '';
  let fieldQuery = '';

  if (sortBy !== '') {
    sortQuery = `&sort=${sortBy}&sort_direction=${order}`;
  }

  if (field !== '' && field !== 'all') {
    fieldQuery = `&search_scope=${field}`
  }

  const apiQuery = `?q=${query}&per_page=50&page=${page}${sortQuery}${fieldQuery}`;
  const queryString = `${apiBase}/discovery/resources${apiQuery}`;
  const apiCall = axios.get(queryString);

  console.log(queryString);

  axios
    .all([getFacets(query), apiCall])
    .then(axios.spread((facets, response) => {
      // console.log(facets);
      // console.log(response);
      cb(facets.data, response.data, page)
    }))
    .catch(error => {
      console.error(`Search error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function AjaxSearch(req, res) {
  const q = req.query.q || '';
  const pageQuery = req.query.page || '1';
  const sortBy = req.query.sort || '';
  const order = req.query.sort_direction || '';
  const field = req.query.search_scope || '';

  Search(
    q,
    pageQuery,
    sortBy,
    order,
    field,
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

  Search(
    q,
    pageQuery,
    sortBy,
    order,
    fieldQuery,
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

function RetrieveItem(q, cb, errorcb) {
  axios
    .get(`${apiBase}/discovery/resources/${q}`)
    .then(response => cb(response.data))
    .catch(error => {
      console.error(`RetrieveItem error: ${JSON.stringify(error, null, 2)}`);

      errorcb(error);
    }); /* end axios call */
}

function ServerItemSearch(req, res, next) {
  const q = req.params.id || 'harry potter';

  RetrieveItem(
    q,
    (data) => {
      res.locals.data.Store = {
        item: data,
        searchKeywords: '',
      };
      next();
    },
    (error) => {
      console.log(error);
      res.locals.data.Store = {
        item: {},
        searchKeywords: '',
      };
      next();
    }
  );
}

function AjaxItemSearch(req, res) {
  const q = req.query.q || '';

  RetrieveItem(
    q,
    (data) => res.json(data),
    (error) => res.json(error)
  );
}

function Account(req, res, next) {
  next();
}

function Hold(req, res, next) {
  next();
}

function RequireUser(req, res) {
  if (!req.tokenResponse || !req.tokenResponse.isTokenValid ||
    !req.tokenResponse.accessToken || !req.tokenResponse.decodedPatron ||
    !req.tokenResponse.decodedPatron.sub) {
    // redirect to login
    const fullUrl = encodeURIComponent(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

function NewHoldRequest(req, res, next) {
  const loggedIn = RequireUser(req, res);
  if (!loggedIn) return false;

  // Retrieve item
  RetrieveItem(
    req.params.id,
    (data) => {
      // console.log('Item data', data)
      res.locals.data.Store = {
        item: data,
        searchKeywords: '',
      };
      next();
    },
    (error) => {
      res.locals.data.Store = {
        item: {},
        searchKeywords: '',
      };
      next();
    }
  );
}

function CreateHoldRequest(req, res) {
  // console.log('Hold request', req);

  // Ensure user is logged in
  const loggedIn = RequireUser(req);
  if (!loggedIn) return false;

  // retrieve access token and patron info
  const accessToken = req.tokenResponse.accessToken;
  const patronId = req.tokenResponse.decodedPatron.sub;
  const patronHoldsApi = `${appConfig.api.development}/hold-requests`;

  // get item id and pickup location
  let itemId = req.params.id;
  let nyplSource = 'nypl-sierra';

  if (itemId.indexOf('-') >= 0) {
    const parts = itemId.split('-');
    itemId = parts[parts.length - 1];

    if (itemId.substring(0, 2) === 'pi') {
      nyplSource = 'recap-PUL';
    } else if (itemId.substring(0, 2) === 'ci') {
      nyplSource = 'recap-CUL';
    }
  }
  itemId = itemId.replace(/\D/g, '');
  const pickupLocation = req.body.pickupLocation;

  const data = {
    patron: patronId,
    recordType: 'i',
    record: itemId,
    nyplSource,
    pickupLocation,
    // neededBy: "2013-03-20",
    numberOfCopies: 1,
  };
  console.log('Making hold request', data, accessToken);

  axios
    .post(patronHoldsApi, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      // console.log('Holds API response:', response);
      console.log('Hold Request Id:', response.data.data.id);
      console.log('Job Id:', response.data.data.jobId);
      res.redirect(`/hold/confirmation/${req.params.id}?requestId=${response.data.data.id}`);
    })
    .catch(error => {
      // console.log(error);
      console.log(`Error calling Holds API : ${error.data.message}`);
      res.redirect(`/hold/request/${req.params.id}?errorMessage=${error.data.message}`);
    }); /* end axios call */
}

router
  .route('/search')
  .get(ServerSearch);

router
  .route('/advanced')
  .get(ServerSearch);

router
  .route('/hold/:id')
  .get(ServerItemSearch);

router
  .route('/hold/request/:id')
  .get(NewHoldRequest)
  .post(CreateHoldRequest);

router
  .route('/hold/confirmation/:id')
  .get(ServerItemSearch);

router
  .route('/account')
  .get(Account);

router
  .route('/item/:id')
  .get(ServerItemSearch);

router
  .route('/api')
  .get(AjaxSearch);

router
  .route('/api/retrieve')
  .get(AjaxItemSearch);

router
  .route('/')
  .get(MainApp);

export default router;
