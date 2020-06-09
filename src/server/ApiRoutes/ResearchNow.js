import nyplApiClient from '../routes/nyplApiClient';
import { createResearchNowQuery } from '../../app/utils/researchNowUtils';
import appConfig from '../../app/data/appConfig';
import logger from '../../../logger';

const appEnvironment = process.env.APP_ENV || 'production';

const nyplApiClientCall = query => nyplApiClient({ apiBaseUrl: appConfig.api.drbb[appEnvironment] })
  .then(client => client.post('', JSON.stringify(query)))
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
