import axios from 'axios';

import Bib from './Bib';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';

const convertShepBibsToDiscoveryBibs = response =>
  Promise.all(
    response.data.bibs.map((bib) => {
      // Determine relevant id prefix
      const institutionCode = {
        'recap-pul': 'pb',
        'recap-cul': 'cb',
        'recap-hl': 'hb',
      }[bib.institution] || 'b';

      const prefixedIdentifier = [institutionCode, bib.bnumber].join('');

      return Bib.nyplApiClientCall(prefixedIdentifier)
        .then(resp =>
          (resp.status === 404 ? bib : resp),
        );
    }),
  ).then((bibs) => {
    // Build "next" pagination URL based on SHEP API next_url..
    // SHEP API next_url will be of form:
    //   http://[fqdn]/api/v0.1/subject_headings/[uuid]/bibs?[filter params]
    // We want to translate that into:
    //   /[app base url]/api/subjectHeadings/subject_headings/[uuid]/bibs?[filter params]
    const nextUrl = response.data.next_url
      ? response.data.next_url.replace(/.*?subject_headings\//, `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/`)
      : null;

    return {
      data: {
        results: bibs,
        next_url: nextUrl,
      },
    };
  });

/**
 *  This method handles all calls on the SHEP API
 *
 *  @param {string} path The path relative to `appConfig.SHEP_API`
 *  @param {object} queryParams An object containing query parameters
 *
 *  @return {Promise<Object>} A promise that resolves the response (or rejects
 *    with an Axios error object - See
 *    https://www.npmjs.com/package/axios#handling-errors )
 */
const shepApiCall = (path, queryParams) => {
  const source = axios.CancelToken.source()
  const timeout = setTimeout(() => {
    source.cancel()
  }, 5000)
  console.log({path})
  return axios({
    method: 'GET',
    url: `${appConfig.shepApi}${path}`,
    params: queryParams,
    timeout: 4000,
    cancelToken: source.token
  }).then((response) => {
    if (/\/bibs/.test(path)) {
      return convertShepBibsToDiscoveryBibs(response);
    }
    clearTimeout(timeout)
    return response;
  }).catch((e) => {
    if (axios.isCancel(e)) {
      console.log('connection timeout')
    }
  })
};

/**
 *  This method proxies arbitrary calls to the SHEP API.
 */
const proxyRequest = (req, res) => {
  const shepApiPath = req.params[0];

  shepApiCall(shepApiPath, req.query)
    .then(response => res.status(response.status || 200).json(response.data))
    .catch((error) => {
      logger.error(`Handling error: for SHEP API path ${shepApiPath}:`, error);

      const httpStatus = error.status || 500;
      let payload = Object.assign({}, { httpStatus });

      // Make sure error payload is JSON (some errors return html)
      if (error.data && error.headers && /application\/json/i.test(error.headers['content-type'])) {
        payload = Object.assign(payload, error.data);
      }

      res.status(httpStatus)
        .json(payload);
    });
};

export default {
  proxyRequest,
  shepApiCall,
};
