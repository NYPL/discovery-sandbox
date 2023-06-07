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
  ADVANCED_SEARCH: 'Advanced Search',
  SEARCH_RESULTS: 'Search Results',
  BIB_PAGE: 'Bib Page',
  HOLD_REQUEST: 'Hold Request',
  ELECTRONIC_DELIVERY: 'Electronic Delivery',
  HOLD_CONFIRMATION: 'Hold Confirmation',
  SUBJECT_HEADING_SHOW_PAGE: 'Subject Heading Show Page',
  SUBJECT_HEADINGS_INDEX_PAGE: 'Subject Headings Index Page',
  ACCOUNT_ERROR: 'Account Error',
  ACCOUNT_PAGE: 'Account Page',
  REDIRECT_404: 'Redirect 404',
  NOT_FOUND_404: 'Not Found 404',
  HOME: 'Home'
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
