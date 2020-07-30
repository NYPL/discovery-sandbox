import nyplApiClient from '../routes/nyplApiClient';

import {
  createResearchNowQuery,
  getResearchNowQueryString,
} from '../../app/utils/researchNowUtils';
import appConfig from '../../app/data/appConfig';
import logger from '../../../logger';

const nyplApiClientCall = query => nyplApiClient({ apiName: 'drbb' })
  .then(client => client.post('', query))
  .catch(console.error);

const search = (req) => {
  const query = createResearchNowQuery(Object.assign({ per_page: 3 }, req.query));
  const researchNowQueryString = getResearchNowQueryString(req.query);
  return nyplApiClientCall(query)
    .then((resp) => {
      const data = resp.data;
      if (!data || !data.works) {
        logger.error(resp);
        return data;
      }

      return {
        works: data.works,
        totalWorks: data.totalWorks,
        researchNowQueryString,
      };
    })
    .catch(console.error);
};

export default {
  search,
};
