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

function Search(req, res, next) {
  const query = req.query.q || 'harry potter';
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
    .then(response => res.json(response.data))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${apiUrl}`);

      getSessionToken(authenticationToken);

      res.json({
        error,
      });
    }); /* end axios call */
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
      console.log(`Attempted to call : ${apiUrl}`);

      getSessionToken(authenticationToken);

      res.json({
        error,
      });
    }); /* end axios call */
}

router
  .route('/')
  .get(MainApp);

router
  .route('/search/:keyword')
  get(MainApp);

router
  .route('/item')
  .get(Item);

router
  .route('/api')
  .get(Search);

router
  .route('/api/retrieve')
  .get(Retrieve);

export default router;
