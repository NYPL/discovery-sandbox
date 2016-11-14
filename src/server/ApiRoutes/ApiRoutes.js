import express from 'express';
import axios from 'axios';

import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
} from 'underscore';

import appConfig from '../../../appConfig.js';
import modelEbsco from '../../app/utils/model.js';
// import ebscoFn from '../../../ebscoConfig.js';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';
const ebsco = {
  UserId: process.env.USER ? process.env.USER : '',
  Password: process.env.PASSWORD ? process.env.PASSWORD : '',
  profile: process.env.PROFILE ? process.env.PROFILE : '',
  Guest: process.env.GUEST ? process.env.GUEST : '',
  Org: process.env.ORG ? process.env.ORG : '',
};

let sessionToken = '';
let authenticationToken = '';

function getCredentials() {
  axios
    .post('https://eds-api.ebscohost.com/authservice/rest/uidauth', {
      UserId: ebsco.UserId,
      Password: ebsco.Password,
      profile: ebsco.profile,
    })
    .then(response => {
      getSessionToken(response.data.AuthToken);
    })
    .catch(error => {
      console.log(error);
    });
}

function getSessionToken(authToken) {
  const instance = axios.create({
    // timeout: response.data.AuthTimeout,
    headers: { 'x-authenticationToken': authToken },
  });

  authenticationToken = authToken;

  instance
    .post('http://eds-api.ebscohost.com/edsapi/rest/createsession', {
      Profile: ebsco.profile,
      Guest: ebsco.Guest,
      Org: ebsco.Org,
    })
    .then(r => {
      console.log(r.data);

      sessionToken = r.data.SessionToken;
    })
    .catch(e => {
      console.log(e);
      getCredentials();
    });
}

// getCredentials();

function MainApp(req, res, next) {
  next();
}

function EbscoSearch(query, cb, errorcb) {
  const instance = axios.create({
    headers: {
      'x-sessionToken': sessionToken,
      'x-authenticationToken': authenticationToken,
    },
  });

  instance
    .post(`http://eds-api.ebscohost.com/edsapi/rest/Search`, {
      "SearchCriteria": {
        "Queries": [ {"Term": query} ],
        "SearchMode": "smart",
        "IncludeFacets": "y",
        "Sort": "relevance",
        "AutoSuggest": "y",
      },
      "RetrievalCriteria": {
        "View": "brief",
        "ResultsPerPage": 10,
        "PageNumber": 1,
        "Highlight": "y"
      },
      "Actions":null
    })
    .then(response => cb(modelEbsco.build(response.data)))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      getSessionToken(authenticationToken);

      errorcb(error);
    }); /* end axios call */
}

function getFacets(query) {
  return axios.get(`http://discovery-api.nypltech.org/api/v1/resources/aggregations?q=${query}`);
}


function Search(query, cb, errorcb) {
  const apiCall = axios.get(`http://discovery-api.nypltech.org/api/v1/resources?q=${query}`);

  axios
    .all([getFacets(query), apiCall])
    .then(axios.spread((facets, response) => {
      // console.log(facets);
      // console.log(response);
      cb(facets.data, response.data)
    }))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      errorcb(error);
    }); /* end axios call */
}

function AjaxSearch(req, res, next) {
  const q = req.query.q || '';

  Search(
    q,
    (facets, searchResults) => res.json({ facets, searchResults }),
    (error) => res.json(error)
  );
}

function ServerSearch(req, res, next) {
  let q = req.query.q || '';
  let spaceIndex = '';

  // Slightly hacky right now but need to get all keywords in case
  // it's more than one word.
  if (q.indexOf(':') !== -1) {
    spaceIndex = (q.substring(0, q.indexOf(':'))).lastIndexOf(' ')
  } else {
    spaceIndex = q.indexOf(' ') === -1 ? q.length : q.indexOf(' ');
  }

  const searchKeywords = q.substring(0, spaceIndex);

  Search(
    q,
    (facets, data) => {
      let selectedFacets = {};

      // Populate the object with empty facet values
      if (!_isEmpty(facets) && facets.itemListElement.length) {
        facets.itemListElement.map(facet => {
          selectedFacets[facet.field] = {
            id: '',
            value: '',
          };
        });
      }

      // Easier to break if facet values have a # instead of an empty space. There might
      // be a better solution for this...
      let urlFacets = q.substring(spaceIndex + 1);

      if (urlFacets) {
        let facetStrArray = q.substring(spaceIndex + 1).replace(/\" /, '"#').split('#');

        facetStrArray.forEach(str => {
          // Each string appears like so: 'contributor:"United States. War Department."'
          // Can't simply split by ':' because some strings are: 'owner:"orgs:1000"'
          const field = str.split(':"')[0];
          const value = str.split(':"')[1].replace('"', '');

          // Now find the facet from the URL from the returned facets in the API.
          const facetObj = _findWhere(facets.itemListElement, { field });
          const facet = _findWhere(facetObj.values, { value });

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
      };

      next();
    },
    (error) => {
      res.locals.data.Store = {
        searchResults: {},
        selectedFacets: {},
        searchKeywords: '',
        facets: {},
      };

      next();
    }
  );
}

function RetrieveEbscoItem(dbid, an, cb, errorcb) {
  const instance = axios.create({
    headers: {
      'x-sessionToken': sessionToken,
      'x-authenticationToken': authenticationToken,
    },
  });

  instance
    .post(`http://eds-api.ebscohost.com/edsapi/rest/retrieve`, {
      DbId: dbid,
      An: an,
    })
    .then(response => cb(modelEbsco.buildItem(response.data)))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      getSessionToken(authenticationToken);

      errorcb(error);
    }); /* end axios call */
}

function RetrieveItem(q, cb, errorcb) {
  axios
    .get(`http://discovery-api.nypltech.org/api/v1/resources/${q}`)
    .then(response => cb(response.data))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      errorcb(error);
    }); /* end axios call */
}

function ServerItemSearch(req, res, next) {
  // const dbid = req.query.dbid || '';
  // const an = req.query.an || '';
  // const query = req.query.q || 'harry potter';
  // RetrieveEbscoItem(dbid, an, ...);
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
      res.locals.data.Store = {
        item: {},
        searchKeywords: '',
      };
      next();
    }
  );
}

function AjaxItemSearch(req, res, next) {
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

function RequireUser(req, res){
  if (!req.tokenResponse || !req.tokenResponse.isTokenValid || !req.tokenResponse.accessToken || !req.tokenResponse.decodedPatron || !req.tokenResponse.decodedPatron.sub) {
    // redirect to login
    const fullUrl = encodeURIComponent(req.protocol + '://' + req.get('host') + req.originalUrl);
    res.redirect(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    return false;
  }
  return true;
}

function NewHoldRequest(req, res, next){
  const loggedIn = RequireUser(req, res);
  if (!loggedIn) return false;

  // Retrieve item
  RetrieveItem(
    req.params.id ,
    (data) => {
      console.log('Item data', data)
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
  if (itemId.indexOf("-") >= 0) {
    const parts = itemId.split("-");
    itemId = parts[parts.length-1];
  }
  itemId = itemId.replace(/\D/g,'');
  const pickupLocation = req.body.pickupLocation;

  const data = {
    patron: patronId,
    recordType: "i",
    record: itemId,
    nyplSource: "nypl-sierra",
    pickupLocation: pickupLocation,
    // neededBy: "2013-03-20",
    numberOfCopies: 1
  }
  console.log('Making hold request', data, accessToken);

  axios
    .post(patronHoldsApi, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
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
