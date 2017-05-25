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
  errorcb = (error) => console.log(error)
) => {
  if (!endpoint) return null;

  return axios
    .get(endpoint)
    .then(cb)
    .catch(errorcb);
};

const getDefaultFacets = () => appConfig.defaultFacets;

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
    } else {
      const facetObjFromAPI = _findWhere(facetArray, { id });
      if (facetObjFromAPI && facetObjFromAPI.values && facetObjFromAPI.values.length) {
        const facet = _findWhere(facetObjFromAPI.values, { value });
        if (facet) {
          selectedFacets[id] = {
            id: facet.value,
            value: facet.label || facet.value,
          };
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
const getSortQuery = (sortBy) => {
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
 * Get the search params from the facet values.
 * @param {object} facets Key/value pair of facet and the selected value.
 */
const getFacetFilterParam = (facets) => {
  let strSearch = '';

  if (!_isEmpty(facets)) {
    _mapObject(facets, (val, key) => {
      if (val.value && val.value !== '') {
        strSearch += `&filters[${key}]=${val.id}`;
      } else if (typeof val === 'string') {
        strSearch += `&filters[${key}]=${val}`;
      }
    });
  }

  return strSearch;
};

/**
 * getFacetParams
 * Get the search params from the facet values.
 * @param {object} facets Key/value pair of facet and the selected value.
 */
const getFacetParams = (facets, field, value) => {
  let strSearch = '';

  if (facets) {
    _mapObject(facets, (val, key) => {
      if (field) {
        // Specific to the FacetSidebar component.
        // You can select and unselect a facet.
        if (value) {
          if (val.value !== '' && field !== key) {
            strSearch += ` ${key}:"${val.id}"`;
          } else if (field === key && value !== `${field}_any`) {
            strSearch += ` ${field}:"${value}"`;
          }

        // Specific logic for the Hits component.
        // If a field is selected selected then it is skipped over.
        } else if (val.value !== '' && field !== key) {
          strSearch += ` ${key}:"${val.id}"`;
        }

      // For all other use cases.
      } else if (val.value !== '') {
        strSearch += ` ${key}:"${val.id}"`;
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
const getFieldParam = (field) => {
  if (!field || field.trim() === 'all') {
    return '';
  }
  return `&search_scope=${field}`;
};

function collapse(results) {
  const owiLookup = {};
  if (!results || !results.searchResults || !results.searchResults.itemListElement) return results
  // make the lookup by owi
  results.searchResults.itemListElement.forEach((r) => {
    if (r.result && r.result.idOwi && r.result.idOwi[0]) {
      if (!owiLookup[r.result.idOwi[0]]) owiLookup[r.result.idOwi[0]] = []
      owiLookup[r.result.idOwi[0]].push(r)
    }
  })

  let newItemListElement = [];
  let completedOwis = [];
  results.searchResults.itemListElement.forEach((r) => {
    if (r.result && r.result.idOwi && r.result.idOwi[0] && owiLookup[r.result.idOwi[0]].length > 1) {
      // if we did a result w/ one of the OWIs we did it for all of them
      if (completedOwis.indexOf(r.result.idOwi[0]) > -1) return
      completedOwis.push(r.result.idOwi[0])

      // there are more than one/none owi matching in this results set, pick the best one and collapse the rest
      // pick one that has a physcial local copy
      let parent = null;
      owiLookup[r.result.idOwi[0]].forEach((i) => {
        if (parent) return
        if (i.result && i.result.items) {
          i.result.items.forEach((ii) => {
            if (ii.location && ii.location[0] && ii.location[0][0]) {
              if (ii.location[0][0]['@id'].search(/loc:ma/) > -1) {
                parent = i
              }
            }
          })
        }
      })
      // pick the first physcial one at recap if no local ver
      if (!parent) {
        owiLookup[r.result.idOwi[0]].forEach((i) => {
          if (parent) return
          if (i.result && i.result.items) {
            i.result.items.forEach((ii) => {
              if (ii.location && ii.location[0] && ii.location[0][0]) {
                if (ii.location[0][0]['@id'].search(/loc:rc/) > -1) {
                  parent = i
                }
              }
            })
          }
        })
      }
      // just select the first one
      if (!parent) {
        owiLookup[r.result.idOwi[0]].forEach((i) => {
          if (parent) return
          if (i.result && i.result.items) {
            i.result.items.forEach((ii) => {
              if (ii.location && ii.location[0] && ii.location[0][0]) {
                parent = i
              }
            })
          }
        })
      }

      if (parent) {
        parent.collapsedBibs = []

        owiLookup[r.result.idOwi[0]].forEach((i) => {
          if (parent.result['@id'] !== i.result['@id']) {
            parent.collapsedBibs.push(i)
          }
        })
        newItemListElement.push(parent)
      } else {
        // something went wrong, just add them all in
        owiLookup[r.result.idOwi[0]].forEach((i) => {
          newItemListElement.push(i)
        })
      }
    } else {
      newItemListElement.push(r)
    }
  })

  results.searchResults.itemListElement = newItemListElement
  return results
}

/**
 * Tracks Google Analytics (GA) events. `.trackEvent` returns a function with
 * 'Discovery' set as the GA Category. `trackDiscovery` will then log the defined
 * actions and labels under the 'Discovery' category.
 * @param {string} action The GA action.
 * @param {string} label The GA label.
 */
const trackDiscovery = gaUtils.trackEvent('Discovery');

const basicQuery = (props) => {
  return ({
    sortBy,
    field,
    selectedFacets,
    searchKeywords,
    page,
  }) => {
    const sortQuery = getSortQuery(sortBy || props.sortBy);
    const fieldQuery = field || getFieldParam(props.field);
    const filterQuery = selectedFacets || getFacetFilterParam(props.selectedFacets);
    const query = searchKeywords || props.searchKeywords;
    const pageQuery = page && page !== '1' ? `&page=${page}` : '';

    return `q=${query}${filterQuery}${sortQuery}${fieldQuery}${pageQuery}`;
  };
};

export {
  collapse,
  trackDiscovery,
  ajaxCall,
  getSortQuery,
  getFacetParams,
  createAppHistory,
  getFieldParam,
  getFacetFilterParam,
  destructureFilters,
  getDefaultFacets,
  basicQuery,
};
