import extractFeatures from '../utils/extractFeatures';
import mapLocations from '../utils/mapLocations';

const appConfig = {
  appTitle: 'NYPL | Discovery',
  appName: 'discovery',
  displayTitle: process.env.DISPLAY_TITLE || 'Shared Collection Catalog',
  baseUrl:
    process.env.BASE_URL || '/research/research-catalog',
  redirectFromBaseUrl: process.env.REDIRECT_FROM_BASE_URL,
  legacyBaseUrl: process.env.LEGACY_BASE_URL,
  favIconPath: 'https://ux-static.nypl.org/images/favicon.ico',
  port: 3001,
  webpackDevServerPort: 3000,
  environment: process.env.APP_ENV || 'production',
  api: {
    discovery: {
      development:
        process.env.PLATFORM_API_BASE_URL ||
        'https://qa-platform.nypl.org/api/v0.1',
      production:
        process.env.PLATFORM_API_BASE_URL ||
        'https://platform.nypl.org/api/v0.1',
    },
    drbb: {
      development:
        process.env.DRB_API_BASE_URL || 'http://drb-api-qa.nypl.org/search/',
      production:
        process.env.DRB_API_BASE_URL ||
        'https://digital-research-books-api.nypl.org/v3/sfr/search',
    },
  },
  circulatingCatalog: process.env.CIRCULATING_CATALOG,
  shepApi: process.env.SHEP_API,
  loginUrl: process.env.LOGIN_URL || 'https://login.nypl.org/auth/login',
  tokenUrl: 'https://isso.nypl.org/',
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA44ilHg/PxcJYsISHMRyo\n' +
    'xsmez178qZpkJVXg7rOMVTLZuf05an7Pl+lX4nw/rqcvGQDXyrimciLgLkWu00xh\n' +
    'm6h6klTeJSNq2DgseF8OMw2olfuBKq1NBQ/vC8U0l5NJu34oSN4/iipgpovqAHHB\n' +
    'GV4zDt0EWSXE5xpnBWi+w1NMAX/muB2QRfRxkkhueDkAmwKvz5MXJPay7FB/WRjf\n' +
    '+7r2EN78x5iQKyCw0tpEZ5hpBX831SEnVULCnpFOcJWMPLdg0Ff6tBmgDxKQBVFI\n' +
    'Q9RrzMLTqxKnVVn2+hVpk4F/8tMsGCdd4s/AJqEQBy5lsq7ji1B63XYqi5fc1SnJ\n' +
    'EQIDAQAB\n' +
    '-----END PUBLIC KEY-----',
  defaultFilters: {
    materialType: [],
    language: [],
    dateAfter: '',
    dateBefore: '',
    subjectLiteral: [],
    creatorLiteral: [],
    contributorLiteral: [],
  },
  closedLocations: mapLocations(process.env.CLOSED_LOCATIONS),
  recapClosedLocations: mapLocations(process.env.RECAP_CLOSED_LOCATIONS),
  nonRecapClosedLocations: mapLocations(process.env.NON_RECAP_CLOSED_LOCATIONS),
  openLocations: process.env.OPEN_LOCATIONS
    ? process.env.OPEN_LOCATIONS.split(',')
    : null,
  holdRequestNotification: process.env.HOLD_REQUEST_NOTIFICATION,
  searchResultsNotification: process.env.SEARCH_RESULTS_NOTIFICATION,
  drbbFrontEnd: {
    development:
      'http://sfr-front-end-development.us-east-1.elasticbeanstalk.com',
    production: 'https://digital-research-books-beta.nypl.org',
  },
  drbbEreader: {
    development: 'https://researchnow-reader.nypl.org',
    production: 'https://digital-research-books-reader.nypl.org',
  },
  features: extractFeatures(process.env.FEATURES),
  generalResearchEmail: process.env.GENERAL_RESEARCH_EMAIL,
  eddAboutUrl: {
    onSiteEdd: 'https://www.nypl.org/research/scan-and-deliver',
    default: 'https://www.nypl.org/help/request-research-materials#EDD',
  },
  sourceEmail: process.env.SOURCE_EMAIL,
  libAnswersEmail: process.env.LIB_ANSWERS_EMAIL,
  itemBatchSize: process.env.ITEM_BATCH_SIZE || 100,
  webpacBaseUrl: process.env.WEBPAC_BASE_URL,
  shepBibsLimit: parseInt(process.env.SHEP_BIBS_LIMIT) || 50,
};

export default appConfig;
