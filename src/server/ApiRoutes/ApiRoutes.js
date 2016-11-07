import express from 'express';
import axios from 'axios';

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

function getFacets() {
  return axios.get('http://discovery-api.nypltech.org/api/v1/resources/aggregations');
}


function Search(query, cb, errorcb) {
  const apiCall = axios.get(`http://discovery-api.nypltech.org/api/v1/resources?q=${query}`);

  axios
    .all([getFacets(), apiCall])
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
  const q = req.query.q || 'harry potter';

  Search(
    q,
    (facets, searchResults) => res.json({ facets, searchResults }),
    (error) => res.json(error)
  );
}

function ServerSearch(req, res, next) {
  let q = req.query.q || 'harry potter';
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
      res.locals.data = {
        Store: {
          searchResults: data,
          searchKeywords,
          facets,
        },
      };
      next();
    },
    (error) => {
      res.locals.data = {
        Store: {
          searchResults: {},
          searchKeywords: '',
          facets: {},
        },
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
  const q = req.params.id || 'harry potter';

  RetrieveItem(
    q,
    (data) => {
      res.locals.data = {
        Store: {
          item: data,
          searchKeywords: '',
        },
      };
      next();
    },
    (error) => {
      res.locals.data = {
        Store: {
          item: {},
          searchKeywords: '',
        },
      };
      next();
    }
  );
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
      res.locals.data = {
        Store: {
          item: data,
          searchKeywords: '',
        },
      };
      next();
    },
    (error) => {
      res.locals.data = {
        Store: {
          item: {},
          searchKeywords: '',
        },
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
