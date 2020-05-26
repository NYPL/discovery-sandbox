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

function fetchBibs(page, perPage, sortBy, order, subjectLiteral, shepApiBibCount, cb, errorcb) {
  const bibResultsQuery = `?filters[subjectLiteral]=${encodeURIComponent(subjectLiteral)}&sort=${sortBy}&sort_direction=${order}&page=${page}&per_page=${perPage}`;

  return nyplApiClientCall(bibResultsQuery)
    .then((response) => {
      const results = response;
      if (page === '1' && parseInt(shepApiBibCount, 10) !== results.totalResults) {
        logger.warning(
          `SHEP/Discovery bib count discrepancy for subject heading ${subjectLiteral}: SHEP API- ${shepApiBibCount}, Discovery API- ${results.totalResults}`);
      }
      cb(results);
    })
    .catch((error) => {
      logger.error('Error making ajax SubjectHeading bibs call in fetchBibs function', error);
      errorcb(error);
    });
}

const bibsAjax = (req, res) => {
  const { subjectLiteral } = req.params;
  const { page, perPage, sort, order } = getReqParams(req.query);
  const shepApiBibCount = req.query.shep_bib_count;

  fetchBibs(
    page,
    perPage,
    sort,
    order,
    subjectLiteral,
    shepApiBibCount,
    data => res.json({ ...data, page }),
    error => res.json(error),
  );
};

export default {
  bibsAjax,
};
