import nyplApiClient from '../routes/nyplApiClient';
import {
  createResearchNowQuery,
} from '../../app/utils/utils';

const nyplApiClientCall = query => nyplApiClient({ isDrbb: true })
  .then(client => client.get(`${query}`, { cache: false }))
  .catch(console.error);

const searchAjax = (req, res) => {
  const queryString = createResearchNowQuery(req.query);
  const researchNowQuery = `?${queryString}`;
  return nyplApiClientCall(researchNowQuery)
    .then((resp) => {
      return res.json({
        works: resp.works,
        totalWorks: resp.totalWorks,
      });
    });
};

export default {
  searchAjax,
};
