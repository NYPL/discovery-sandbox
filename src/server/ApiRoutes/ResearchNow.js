import nyplApiClient from '../routes/nyplApiClient';
import appConfig from '../../app/data/appConfig';
import logger from '../../../logger';

// To ease transition from DRB API V3 to V4, temporarily support both versions
// Determine what API semantics to use based on configured endpoint::
import { getResearchNowQueryString } from '../../app/utils/researchNowUtils';
import { createResearchNowQuery as createResearchNowQueryV3 } from '../../app/utils/researchNowUtils.v3';

/**
 * Given a request, resolves the relevant response from the DRB API
 */
const drbQueryFromRequest = (req) => {
  const query = Object.assign({ per_page: 3 }, req.query);

  let drbQuery = null
  let drbCall = null

  const useDrbV3 = (process.env.DRB_API_BASE_URL || '').includes('/v3/')
  if (useDrbV3) {
    drbQuery = createResearchNowQueryV3(query)
    drbCall = nyplApiClient({ apiName: 'drbb' })
      .then(client => client.post('', drbQuery))
  } else {
    drbQuery = getResearchNowQueryString(query)
    drbCall = nyplApiClient({ apiName: 'drbb' })
      .then(client => client.get(drbQuery))
  }

  // Return a promise resolving the DRB API response and the query string used
  return drbCall
    .then((resp) => {
      return {
        response: resp,
        researchNowQueryString: drbQuery
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
        logger.error(resp);
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
