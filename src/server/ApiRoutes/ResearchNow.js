import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';

// To ease transition from DRB API V3 to V4, temporarily support both versions
// Determine what API semantics to use based on configured endpoint::
import { getResearchNowQueryString } from '../../app/utils/researchNowUtils';
import { createResearchNowQuery as createResearchNowQueryV3, getResearchNowQueryString as getResearchNowQueryStringV3 } from '../../app/utils/researchNowUtils.v3';

/**
 * Given a request, resolves the relevant response from the DRB API
 */
const drbQueryFromRequest = (req) => {
  const query = Object.assign({ per_page: 3 }, req.query);

  let drbQueryString = null;
  let drbCall = null;

  const useDrbV3 = (process.env.DRB_API_BASE_URL || '').includes('/v3/')
  if (useDrbV3) {
    // Create query as an object:
    const drbQuery = createResearchNowQueryV3(query)
    drbCall = nyplApiClient({ apiName: 'drbb' })
      .then(client => client.post('', drbQuery));
    // Create same query as a query string:
    drbQueryString = getResearchNowQueryStringV3(query);
  } else {
    const drbQuery = getResearchNowQueryString(query)
    drbCall = nyplApiClient({ apiName: 'drbb' })
      .then(client => client.get(drbQuery));
    // Remove leading '?'
    drbQueryString = drbQuery.replace(/^\?/, '');
  }

  // Return a promise resolving the DRB API response and the query string used
  return drbCall
    .then((resp) => {
      return {
        response: resp,
        researchNowQueryString: drbQueryString
      }
    });

}

/**
 * Given a request, queries the DRB API and resolves an object representing
 * the essential parts of the response
 */
const search = (req) => {
  return drbQueryFromRequest(req)
    .then((res) => {
      const data = res.response.data;
      if (!data || !data.works) {
        logger.error(res);
        return data;
      }

      return {
        works: data.works,
        totalWorks: data.totalWorks,
        researchNowQueryString: res.researchNowQueryString,
      };
    })
    .catch(console.error);
};

export default {
  search,
};
