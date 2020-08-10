import PropTypes from 'prop-types';
import appConfig from '../data/appConfig';


export const initialSelectedFiltersState = {
  materialType: [],
  language: [],
  subjectLiteral: [],
  dateAfter: {},
  dateBefore: {},
};

const initialState = {
  searchResults: {},
  bib: {},
  searchKeywords: '',
  filters: {},
  page: '1',
  sortBy: 'relevance',
  loading: false,
  field: 'all',
  error: {},
  form: {},
  deliveryLocations: [],
  isEddRequestable: false,
  subjectHeading: null,
  drbbResults: {},
  patron: {
    id: '',
    names: [],
    barcodes: [],
    emails: [],
    loggedIn: false,
  },
  appConfig,
};

export default initialState;
