import express from 'express';
import axios from 'axios';

import appConfig from '../../../appConfig.js';
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

getCredentials();

function MainApp(req, res, next) {
  next();
}

function Item(req, res, next) {
  next();
}

function Search(query, cb, errorcb) {
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
    .then(response => cb(response.data))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      getSessionToken(authenticationToken);

      errorcb(error);
    }); /* end axios call */
}


function AjaxSearch(req, res, next) {
  const query = req.query.q || 'harry potter';

  Search(
    query,
    (data) => res.json(data),
    (error) => res.json(error)
  );
}

function ServerSearch(req, res, next) {
  const query = req.params.keyword || 'harry potter';

  Search(
    query,
    (data) => {
      res.locals.data = {
        Store: {
          ebscodata: data,
          searchKeywords: query,
        },
      };
      next();
    },
    (error) => {
      res.locals.data = {
        Store: {
          ebscodata: {},
          searchKeywords: '',
        },
      };
      next();
    }
  );

  // const instance = axios.create({
  //   headers: {
  //     'x-sessionToken': sessionToken,
  //     'x-authenticationToken': authenticationToken,
  //   },
  // });

  // instance
  //   .post(`http://eds-api.ebscohost.com/edsapi/rest/Search`, {
  //     "SearchCriteria": {
  //       "Queries": [ {"Term": query} ],
  //       "SearchMode": "smart",
  //       "IncludeFacets": "y",
  //       "Sort": "relevance",
  //       "AutoSuggest": "y",
  //     },
  //     "RetrievalCriteria": {
  //       "View": "brief",
  //       "ResultsPerPage": 10,
  //       "PageNumber": 1,
  //       "Highlight": "y"
  //     },
  //     "Actions":null
  //   })
  //   .then(response => {
  //     res.locals.data = {
  //       Store: {
  //         ebscodata: response.data,
  //         searchKeywords: query,
  //       },
  //     };
  //     next();
  //   })
  //   .catch(error => {
  //     console.log(error);
  //     console.log(`error calling API : ${error}`);

  //     getSessionToken(authenticationToken);

  //     res.locals.data = {
  //       Store: {
  //         ebscodata: {},
  //         searchKeywords: '',
  //       },
  //     };
  //     next();
  //   }); /* end axios call */
}

function Retrieve(req, res, next) {
  const dbid = req.query.dbid || '';
  const an = req.query.an || '';

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
    .then(response => res.json(response.data))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);

      getSessionToken(authenticationToken);

      res.json({
        error,
      });
    }); /* end axios call */
}

router
  .route('/search/:keyword')
  .get(ServerSearch);

router
  .route('/item')
  .get(Item);

router
  .route('/api')
  .get(AjaxSearch);

router
  .route('/api/retrieve')
  .get(Retrieve);

router
  .route('/')
  .get(MainApp);

export default router;
