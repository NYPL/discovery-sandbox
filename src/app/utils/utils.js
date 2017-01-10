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
  findIndex as _findIndex,
  forEach as _forEach,
} from 'underscore';

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
 * createAppHistory
 * Destructure the search keywords from the facet string. The function then returns the full
 * search keywords along with an object of the selected facets with their API values. In the
 * following example, the owner id of "orgs:1000" returns the human readable label of
 * "Stephen A. Schwarzman Building" from the API.
 * Queries can be in the following format:
 *   'alexander hamilton owner:"orgs:1000"'
 *   'locofocos'
 *   'war subject:"World War, 1914-1918." date:"2000"'
 * @param {string} query The full search query.
 * @param {object} apiFacets The facets from the API.
 */
const destructureQuery = (query, apiFacets) => {
  const colonIndex = query.indexOf(':') !== -1 ? query.indexOf(':') : '';
  const facetStartingIndex = colonIndex ? query.lastIndexOf(' ', colonIndex) : '';
  let q = query;
  let facetsString = '';

  if (facetStartingIndex) {
    q = query.substring(0, facetStartingIndex);
    facetsString = query.substring(facetStartingIndex);
  }

  // console.log(q, facetsString);
  const selectedFacets = {};
  const facetArray = facetsString ? facetsString.split('" ') : [];
  _forEach(facetArray, str => {
    if (str.charAt(str.length - 1) !== '"') str += '"';

    const facet = str.indexOf(':"') !== -1 ? str.trim().split(':"') : str.trim().split(':');
    const field = facet[0];
    const value = facet[1].substring(0, facet[1].length - 1);
    // Find the index where the field exists in the list of facets from the API
    const index = _findIndex(apiFacets.itemListElement, { field });
    // If the index exists, try to find the facet value from the API
    if (apiFacets.itemListElement[index]) {
      const findFacet = _findWhere(apiFacets.itemListElement[index].values, { value });

      selectedFacets[field] = {
        id: findFacet ? findFacet.value : value,
        value: findFacet ? (findFacet.label || findFacet.value) : value,
      };
    } else {
      selectedFacets[field] = {
        id: value,
        value,
      };
    }
  });

  return {
    q,
    selectedFacets,
  };
};

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

export {
  collapse,
  trackDiscovery,
  ajaxCall,
  getSortQuery,
  getFacetParams,
  createAppHistory,
  destructureQuery,
};
