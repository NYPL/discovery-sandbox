import express from 'express';
import axios from 'axios';

import appConfig from '../../../appConfig.js';

const router = express.Router();
const appEnvironment = process.env.APP_ENV || 'production';


function fetchApiData(url) {
  return axios.get(url);
}

function MainApp(req, res, next) {
  res.locals.data = {};

  next();
}

router
  .route('/')
  .get(MainApp);

export default router;
