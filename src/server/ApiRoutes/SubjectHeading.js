import axios from 'axios';

import {
  getReqParams,
} from '../../app/utils/utils';
import nyplApiClient from '../routes/nyplApiClient';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import SubjectHeadings from './SubjectHeadings';

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
  const bibsSource = req.query.source;

  const shepApiBibsCall = () => {
    const stringifiedSortParams = `sort=${sort}&sort_direction=${order}`;
    const queryUrl = `/subject_headings/${req.query.shep_uuid}/bibs?${stringifiedSortParams}`;

    return SubjectHeadings.shepApiCall(queryUrl)
      .then((response) => {
        const newResults = response.data.results;
        return res.json({
          newResults,
          next_url: response.data.next_url,
          bibsSource: 'shepApi',
          page,
          totalResults: shepApiBibCount,
        });
      })
      .catch(
        (err) => {
          // eslint-disable-next-line no-console
          console.error('error: ', err);
        },
      );
  };

  const useDiscoveryResults = (discoveryApiBibCount) => {
    if (shepApiBibCount === 0) return true;
    if (discoveryApiBibCount === 0) return false;
    const discrepancy = Math.abs(shepApiBibCount - discoveryApiBibCount);

    return discrepancy < (shepApiBibCount * 0.2);
  };

  const processData = (data) => {
    const { totalResults } = data;
    if (bibsSource === 'discoveryApi' || useDiscoveryResults(totalResults)) {
      return res.json({
        results: data.itemListElement,
        page,
        totalResults,
        bibsSource: 'discoveryApi'
      });
    }

    return shepApiBibsCall();
  };

  fetchBibs(
    page,
    perPage,
    sort,
    order,
    subjectLiteral,
    shepApiBibCount,
    data => processData(data),
    error => res.json(error),
  );
};

export default {
  bibsAjax,
};
