import nyplApiClient from '../routes/nyplApiClient';
import { createResearchNowQuery } from '../../app/utils/researchNowUtils';
import logger from '../../../logger';

const nyplApiClientCall = query => nyplApiClient({ apiName: 'drbb' })
  .then(client => client.post('/research-now/v3/search-api', JSON.stringify(query)))
  .catch(console.error);

const searchAjax = (req, res) => {
  const query = createResearchNowQuery(req.query);
  return nyplApiClientCall(query)
    .then((resp) => {
      const data = JSON.parse(resp).data;
      if (!data || !data.works) {
        logger.error(resp);
        return res.json(data);
      }
      return res.json({
        works: data.works,
        totalWorks: data.totalWorks,
      });
    })
    .catch(console.error);
};

export default {
  searchAjax,
};
