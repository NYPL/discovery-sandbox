import {
  getReqParams,
} from '../../app/utils/utils';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';

const nyplApiClientCall = query => nyplApiClient()
  .then((client) => {
    return client.get(`/discovery/resources${query}`, { cache: false });
  })
  .catch(console.error);

function fetchBibs(page, perPage, sortBy, order, subjectLiteral, cb, errorcb) {
  const bibResultsQuery = `?filters[subjectLiteral]=${encodeURIComponent(subjectLiteral)}&sort=${sortBy}&sort_direction=${order}&page=${page}&per_page=${perPage}`;

  return nyplApiClientCall(bibResultsQuery)
    .then((response) => {
      console.log("response", response);
      const results = response;
      cb(results, page);
    })
    .catch((error) => {
      logger.error('Error making ajax SubjectHeading bibs call in fetchBibs function', error);
      errorcb(error);
    });
}

const bibsAjax = (req, res) => {
  const { subjectLiteral } = req.params;
  const { page, perPage, sort, order } = getReqParams(req.query);

  fetchBibs(
    page,
    perPage,
    sort,
    order,
    subjectLiteral,
    data => res.json(data),
    error => res.json(error),
  );
};

export default {
  bibsAjax,
};
