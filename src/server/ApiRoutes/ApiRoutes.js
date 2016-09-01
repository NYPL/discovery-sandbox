import express from 'express';
import axios from 'axios';

import appConfig from '../../../appConfig.js';
import ebsco from '../../../ebscoConfig.js';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';

let sessionToken = '';
let authenticationToken = '';

axios
  .post('https://eds-api.ebscohost.com/authservice/rest/uidauth', {
    UserId: ebsco.UserId,
    Password: ebsco.Password,
    profile: ebsco.profile,
  })
  .then(response => {
    const instance = axios.create({
      // timeout: response.data.AuthTimeout,
      headers: { 'x-authenticationToken': response.data.AuthToken },
    });

    authenticationToken = response.data.AuthToken;

    instance
      .post('http://eds-api.ebscohost.com/edsapi/rest/createsession', {
        Profile: ebsco.profile,
        Guest: ebsco.Guest,
        Org: ebsco.Org,
      })
      .then(r => {
        console.log(r.data);
        console.log(authenticationToken);

        sessionToken = r.data.SessionToken;
      })
      .catch(e => {
        console.log(e);
      });
  })
  .catch(error => {
    console.log('test')
    console.log(error);
  });

function MainApp(req, res, next) {
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
        "IncludeFacets": "n",
        "Sort":"relevance"
      },
      "RetrievalCriteria": {
        "View": "brief",
        "ResultsPerPage": 10,
        "PageNumber": 1,
        "Highlight": "n"
      },
      "Actions":null
    })
    .then(response => res.json(response.data))
    .catch(error => {
      console.log(error);
      console.log(`error calling API : ${error}`);
      console.log(`Attempted to call : ${apiUrl}`);

      res.json({
        error,
      });
    }); /* end axios call */
}

router
  .route('/')
  .get(MainApp);

router
  .route('/api')
  .get(Search);

export default router;
