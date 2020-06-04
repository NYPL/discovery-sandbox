import nyplApiClient from '../routes/nyplApiClient';
import {
  createResearchNowQuery,
} from '../../app/utils/utils';
import appConfig from '../../app/data/appConfig';

const appEnvironment = process.env.APP_ENV || 'production';

const nyplApiClientCall = query => nyplApiClient({ apiBaseUrl: appConfig.api.drbb[appEnvironment] })
  .then(client => client.get(`/research-now/v3/search-api?${query}`, { cache: false }))
  .catch(console.error);

const searchAjax = (req, res) => {
  const queryString = createResearchNowQuery(req.query);
  return nyplApiClientCall(queryString)
    .then(resp => res.json({
      works: resp.works,
      totalWorks: resp.totalWorks,
    }));
};

export default {
  searchAjax,
};
