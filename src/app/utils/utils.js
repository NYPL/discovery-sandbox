import { gaUtils } from 'dgx-react-ga';
import axios from 'axios';
import {
  createHistory,
  useQueries,
  createMemoryHistory,
} from 'history';
import {
  mapObject as _mapObject,
  findWhere as _findWhere,
  forEach as _forEach,
  isEmpty as _isEmpty,
  isArray as _isArray,
  extend as _extend,
  chain as _chain,
  flatten as _flatten,
} from 'underscore';

import appConfig from '../../../appConfig.js';

/**
 * ajaxCall
 * Utility function to make ajax requests.
 * @param {string} endpoint The endpoint to call.
 * @param {function} cb The callback function.
 * @param {function} errorcb The error callback function.
 */
const ajaxCall = (
  endpoint,
  cb = () => {},
  errorcb = (error) => console.error('Error making ajaxCall', error)
) => {
  if (!endpoint) return null;

  return axios
    .get(endpoint)
    .then(cb)
    .catch(errorcb);
};

/**
 * getDefaultFacets
 * Get the default facets needed from the API.
 * @return {object}
 */
const getDefaultFacets = () => _extend({}, appConfig.defaultFacets);

/**
 * createAppHistory
 * Create a history in the browser or server that coincides with react-router.
 */
const createAppHistory = () => {
  if (typeof(window) !== 'undefined') {
    return useQueries(createHistory)();
  }

  return useQueries(createMemoryHistory)();
};

/**
 * ajaxCall
 * Utility function to make ajax requests.
 * @param {string} endpoint The endpoint to call.
 * @param {function} cb The callback function.
 * @param {function} errorcb The error callback function.
 */
function destructureFilters(filters, apiFacet) {
  const selectedFacets = {};
  const facetArray = apiFacet && apiFacet.itemListElement && apiFacet.itemListElement.length ?
    apiFacet.itemListElement : [];

  _forEach(filters, (value, key) => {
    const id = key.substring(8, key.length - 1);

    if (id === 'dateAfter' || id === 'dateBefore') {
      selectedFacets[id] = {
        id: value,
        value: id === 'dateAfter' ? `after ${value}` : `before ${value}`,
      };
    } else if (_isArray(value) && value.length) {
      if (!selectedFacets[id]) {
        selectedFacets[id] = [];
      }
      _forEach(value, facetValue => {
        const facetObjFromAPI = _findWhere(facetArray, { id });
        if (facetObjFromAPI && facetObjFromAPI.values && facetObjFromAPI.values.length) {
          const facet = _findWhere(facetObjFromAPI.values, { value: facetValue });
          if (facet) {
            selectedFacets[id].push({
              id: facet.value,
              value: facet.label || facet.value,
            });
          }
        }
      });
    } else if (typeof value === 'string') {
      const facetObjFromAPI = _findWhere(facetArray, { id });
      if (facetObjFromAPI && facetObjFromAPI.values && facetObjFromAPI.values.length) {
        const facet = _findWhere(facetObjFromAPI.values, { value });
        if (facet) {
          selectedFacets[id] = [{
            id: facet.value,
            value: facet.label || facet.value,
          }];
        }
      }
    }
  });

  return selectedFacets;
}

/**
 * getSortQuery
 * Get the sort type and order and pass it in URL query form.
 * @param {string} sortBy URL parameter with sort type and order.
 */
const getSortQuery = (sortBy = '') => {
  const reset = sortBy === 'relevance';
  let sortQuery = '';

  if (sortBy && !reset) {
    const [sort, order] = sortBy.split('_');
    sortQuery = `&sort=${sort}&sort_direction=${order}`;
  }

  return sortQuery;
};

/**
 * getFacetFilterParam
 * Get the search params from the filter values.
 * @param {object} filters Key/value pair of filter and the selected value.
 */
const getFacetFilterParam = (filters) => {
  let strSearch = '';

  if (!_isEmpty(filters)) {
    _mapObject(filters, (val, key) => {
      // Property contains an array of its selected filter values:
      if (val.length && _isArray(val)) {
        _forEach(val, (filter, index) => {
          if (filter.value && filter.value !== '') {
            // At this time, materialType filter requires _packed for filtering (but not as data).
            // Other filters do not.
            strSearch += `&filters[${key}][${index}]=${encodeURIComponent(filter.value)}`;
          } else if (typeof filter === 'string') {
            strSearch += `&filters[${key}][${index}]=${encodeURIComponent(filter)}`;
          }
        });
      } else if (val.value && val.value !== '') {
        strSearch += `&filters[${key}]=${encodeURIComponent(val.value)}`;
      } else if (typeof val === 'string') {
        strSearch += `&filters[${key}]=${encodeURIComponent(val)}`;
      }
    });
  }

  return strSearch;
};

/**
 * getFieldParam
 * Get the search param from the field selected.
 * @param {string} field Value of field to query against.
 */
const getFieldParam = (field = '') => {
  if (!field || field.trim() === 'all') {
    return '';
  }
  return `&search_scope=${field}`;
};

/**
 * Tracks Google Analytics (GA) events. `.trackEvent` returns a function with
 * 'Discovery' set as the GA Category. `trackDiscovery` will then log the defined
 * actions and labels under the 'Discovery' category.
 * @param {string} action The GA action.
 * @param {string} label The GA label.
 */
const trackDiscovery = gaUtils.trackEvent('Discovery');

/**
 * basicQuery
 * A curry function that will take in the application's props and return a function that will
 * overwrite whatever values it needs to overwrite to create the needed API query.
 * @example
 * const apiQueryFunc = basicQuery(this.props);
 * const apiQuery = apiQueryFunc();
 * // apiQuery === 'q='
 * const apiQuery2 = apiQueryFunc({ page: 3 });
 * // apiQuery2 === 'q=&page=3'
 * const apiQuery3 = apiQueryFunc({ page: 3, q: 'hamlet' });
 * // apiQuery3 === 'q=hamlet&page=3'
 * @param {object} props The application props.
 */
const basicQuery = (props = {}) => {
  return ({
    sortBy,
    field,
    selectedFacets,
    searchKeywords,
    page,
  }) => {
    const sortQuery = getSortQuery(sortBy || props.sortBy);
    const fieldQuery = getFieldParam(field || props.field);
    const filterQuery = getFacetFilterParam(selectedFacets || props.selectedFacets);
    // `searchKeywords` can be an empty string, so check if it's undefined instead.
    const query = searchKeywords !== undefined ? searchKeywords : props.searchKeywords;
    const searchKeywordsQuery = query ? encodeURIComponent(query) : '';
    let pageQuery = props.page && props.page !== '1' ? `&page=${props.page}` : '';
    pageQuery = page && page !== '1' ? `&page=${page}` : pageQuery;
    pageQuery = page === '1' ? '' : pageQuery;

    return `q=${searchKeywordsQuery}${filterQuery}${sortQuery}${fieldQuery}${pageQuery}`;
  };
};

/**
 * getReqParams
 * Read the query param from the request object from Express and returns its value or
 * default values for each. It also returns a string representation of all the selected
 * facets in the url from the `filter` query.
 * @param {object} query The request query object from Express.
 */
function getReqParams(query = {}) {
  const page = query.page || '1';
  const q = query.q || '';
  const sort = query.sort || '';
  const order = query.sort_direction || '';
  const sortQuery = query.sort_scope || '';
  const fieldQuery = query.search_scope || '';
  const filters = query.filters || {};

  return { page, q, sort, order, sortQuery, fieldQuery, filters };
}

/*
 * parseServerSelectedFilters(filters)
 * For no-js situations, we need to parse and modify the data structure that is POSTed
 * to the server for filters. The structure is modified to better fit the searching function.
 * The dateAfter and dateBefore are strings which can be added after the data structure is set.
 * Example of data coming in:
 * [ '{"field":"materialType","value":"resourcetypes:txt","count":4298,"label":"Text"}',
 *   '{"field":"owner","value":"orgs:1101","count":580,"label":"General Research Division"}',
 *   '{"field":"language","value":"lang:eng","count":228,"label":"English"}',
 *   '{"field":"language","value":"lang:spa","count":69,"label":"Spanish"}' ]
 *
 * Modified data:
 * { materialType: [ { id: 'resourcetypes:txt', value: 'Text' } ],
 *   owner: [ { id: 'orgs:1101', value: 'General Research Division' } ],
 *   language: [
 *     { id: 'lang:eng', value: 'English' },
 *     { id: 'lang:spa', value: 'Spanish' }
 *   ]
 * }
 * @param {array} filters The selected filters
 * @param {string} dateAfter The filter date to search after.
 * @param {string} dateBefore The filter date to search before.
 * @return {object}
 */
function parseServerSelectedFilters(filters, dateAfter, dateBefore) {
  const selectedFacets = {
    materialType: [],
    language: [],
    dateAfter: {},
    dateBefore: {},
  };

  if (_isArray(filters) && filters.length && !_isEmpty(filters[0])) {
    _chain(filters)
      // Each incoming filter is in JSON string format so it needs to be parsed first.
      .map(filter => JSON.parse(filter))
      // Group selected facets into arrays according to their field.
      .groupBy('field')
      // Created the needed data structure.
      .mapObject((facetArray, key) => {
        if (key) {
          selectedFacets[key] =
            facetArray.map((facet) => ({
              value: facet.value,
              label: facet.label,
              count: facet.count,
              selected: true,
            }));
        }
      });
  }

  if (dateAfter) {
    selectedFacets.dateAfter = { id: dateAfter, value: dateAfter };
  }

  if (dateBefore) {
    selectedFacets.dateBefore = { id: dateBefore, value: dateBefore };
  }

  return selectedFacets;
}

/**
 * getAggregatedElectronicResources(items)
 * Get an aggregated array of electronic items from each item if available.
 * @param {array} items
 * @return {object}
 */
function getAggregatedElectronicResources(items = []) {
  if (!items && !items.length) {
    return [];
  }

  const electronicResources = [];

  _forEach(items, item => {
    if (item.isElectronicResource) {
      electronicResources.push(item.electronicResources);
    }
  });

  return _flatten(electronicResources);
}

/**
 * getUpdatedFilterValues(props)
 * Get an array of filter values based on one filter. If any filters are selected, they'll
 * be `true` in their object property `selected`.
 * @param {object} props
 * @return {array}
 */
const getUpdatedFilterValues = (props) => {
  const {
    filter,
    selectedFilters,
  } = props;
  const filterValues = filter.values && filter.values.length ? filter.values : [];
  // Just want to add the `selected` property here.
  const defaultFilterValues = filterValues.map(value => _extend({ selected: false }, value));
  let updatedFilterValues = defaultFilterValues;

  // If there are selected filters, then we want to update the filter values with those
  // filters already selected. That way, the checkboxes will be checked.
  if (selectedFilters) {
    updatedFilterValues = defaultFilterValues.map(defaultFilterValue => {
      const defaultFilter = defaultFilterValue;
      selectedFilters.forEach(selectedFilter => {
        if (selectedFilter.value === defaultFilter.value) {
          defaultFilter.selected = true;
        }
      });

      return defaultFilter;
    });
  }

  return updatedFilterValues;
};

export {
  trackDiscovery,
  ajaxCall,
  getSortQuery,
  createAppHistory,
  getFieldParam,
  getFacetFilterParam,
  destructureFilters,
  getDefaultFacets,
  basicQuery,
  getReqParams,
  parseServerSelectedFilters,
  getAggregatedElectronicResources,
  getUpdatedFilterValues,
};
