// breakpoints ordered by `maxValue` ascending
const breakpoints = [
  {
    maxValue: 320,
    media: 'mobile',
  },
  {
    maxValue: 600,
    media: 'tabletPortrait',
  },
  {
    maxValue: 960,
    media: 'tablet',
  },
];

const bibPageItemsListLimit = 20;
const searchResultItemsListLimit = 3;
const itemBatchSize = 20;

const noticePreferenceMapping = {
  'z': 'Email',
  'p': 'Telephone',
  '-': 'None',
};

const CLOSED_LOCATION_REGEX = /\(CLOSED\)|STAFF ONLY|SCHWARZMAN|Performing Arts|^[^a-z]+$/;

// String used to namespace Research Catalog events in Adobe Analytics
const ADOBE_ANALYTICS_SITE_SECTION = 'Research Catalog';

const ADOBE_ANALYTICS_PAGE_NAMES = {
  HOME: 'home',
  ADVANCED_SEARCH: 'advanced-search',
  SEARCH_RESULTS: 'search-results',
  BIB: 'bib',
  SHEP: 'shep',
  ACCOUNT: 'account',
  REQUEST_HOLD: 'request|hold',
  REQUEST_EDD: 'request|edd',
  ACCOUNT_ERROR: 'error|account',
  REDIRECT: 'error|redirect',
  NOT_FOUND_404: 'error|404',
};

export {
  breakpoints,
  bibPageItemsListLimit,
  searchResultItemsListLimit,
  noticePreferenceMapping,
  CLOSED_LOCATION_REGEX,
  itemBatchSize,
  ADOBE_ANALYTICS_SITE_SECTION,
  ADOBE_ANALYTICS_PAGE_NAMES
};
