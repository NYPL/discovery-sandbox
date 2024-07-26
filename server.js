import path from 'path';
import express from 'express';
import compress from 'compression';
import DocumentTitle from 'react-document-title';
import { match } from 'react-router';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import webpack from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';

import appConfig from './src/app/data/appConfig';
import webpackConfig from './webpack.config';
import apiRoutes from './src/server/ApiRoutes/ApiRoutes';
import routes from './src/app/routes/routes';

import initializePatronTokenAuth from './src/server/routes/auth';
import { getPatronData } from './src/server/routes/api';
import nyplApiClient from './src/server/routes/nyplApiClient';
import logger from './logger';
import configureStore from './src/app/stores/configureStore';
import initialState from './src/app/stores/InitialState';
import { updateLoadingStatus } from './src/app/actions/Actions';
import initializeReduxReact from './src';
import { nyTimezoneOffsets } from './src/app/utils/nyTimezoneOffsets';

const compiler = webpack(webpackConfig);
const ROOT_PATH = __dirname;
const INDEX_PATH = path.resolve(ROOT_PATH, 'src/client');
const DIST_PATH = path.resolve(ROOT_PATH, 'dist');
const VIEWS_PATH = path.resolve(ROOT_PATH, 'src/views');
const NYPL_HEADER_URL = appConfig.nyplHeaderUrl;
const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const app = express();

app.use(compress());

if (!isProduction) {
  app.use(WebpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  }));
}

// Disables the Server response from
// displaying Express as the server engine
app.disable('x-powered-by');

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', VIEWS_PATH);

app.set('port', process.env.PORT || appConfig.port || 3001);

// Tell express to trust x-forwarded-proto and x-forwarded-host headers when
// origin is local. This means req.hostname and req.protocol will
// return the actual host and proto of the original request when forwarded
// by the trusted proxy (Imperva). This is essential for building a valid login
// redirect_uri
// See https://expressjs.com/en/4x/api.html#trust.proxy.options.table
app.set('trust proxy', 'loopback')

app.use(cookieParser());
// to support JSON-encoded bodies
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set Global publicKey
app.set('nyplPublicKey', appConfig.publicKey);

app.use(`${appConfig.baseUrl}/`, express.static(DIST_PATH));
// For images
app.use('*/src/client', express.static(INDEX_PATH));

app.use('/', (req, res, next) => {
  if (req.path === appConfig.baseUrl || req.path === '/') {
    return res.redirect(`${appConfig.baseUrl}/`);
  }
  // If request made on legacy base url, redirect to current base url:
  if (
    appConfig.redirectFromBaseUrl &&
    appConfig.redirectFromBaseUrl !== appConfig.baseUrl &&
    req.path.indexOf(appConfig.redirectFromBaseUrl) === 0
  ) {
    return res.redirect(
      302,
      req.originalUrl.replace(appConfig.redirectFromBaseUrl, appConfig.baseUrl),
    );
  }
  return next();
});

app.use('/*', (req, res, next) => {
  const initialStore = { ...initialState, lastLoaded: req._parsedUrl.path };
  req.store = configureStore(initialStore);
  next();
});

// Init the nypl data api client.
nyplApiClient();

app.use('/*', initializePatronTokenAuth, getPatronData);
app.use('/', apiRoutes);

// Special debugging route - for investigating LB/proxy issues:
app.get('/research/research-catalog/__request_debug', (req, res) => {
  res.json(
    {
      baseUrl: req.baseUrl,
      'get(host)': req.get('host'),
      headers: req.headers,
      hostname: req.hostname,
      originalUrl: req.originalUrl,
      path: req.path,
      protocol: req.protocol
    }
  )
});

app.get('/*', (req, res) => {
  const appRoutes =
    req.url.indexOf(appConfig.baseUrl) !== -1 ? routes.client : routes.server;
  const store = req.store;

  match(
    { routes: appRoutes, location: req.url },
    (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        store.dispatch(updateLoadingStatus(false));
        const title = DocumentTitle.rewind();

        res.status(res.statusCode || 200).render('index', {
          application: initializeReduxReact(renderProps, store),
          appData: JSON.stringify(store.getState()).replace(/</g, '\\u003c'),
          appTitle: title,
          favicon: appConfig.favIconPath,
          nyplHeaderUrl: NYPL_HEADER_URL,
          path: req.url,
          isProduction,
          baseUrl: appConfig.baseUrl,
          launchEmbedUrl: appConfig.launchEmbedUrl,
          nyOffsets: nyTimezoneOffsets()
        });
      } else {
        res.status(404).redirect(`${appConfig.baseUrl}/`);
      }
    },
  );
});

let server = null;
if (!isTest) {
  server = app.listen(app.get('port'), (error) => {
    if (error) {
      logger.error(error);
    }

    logger.info(
      `App - Express server is listening at localhost: ${app.get('port')}.`,
    );
  });
}

// This function is called when you want the server to die gracefully
// i.e. wait for existing connections
const gracefulShutdown = () => {
  logger.info('Received kill signal, shutting down gracefully.');
  server.close(() => {
    logger.info('Closed out remaining connections.');
    process.exit(0);
  });
  // if after
  setTimeout(() => {
    logger.error(
      'Could not close connections in time, forcefully shutting down',
    );
    process.exit();
  }, 1000);
};
// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);
// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

module.exports = app;
