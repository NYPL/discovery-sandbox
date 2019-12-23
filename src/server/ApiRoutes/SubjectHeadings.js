import axios from 'axios';

import Bib from './Bib';
import logger from '../../../logger';
import appConfig from '../../../appConfig';

const convertShepBibsToDiscoveryBibs = (response) => {
  return Promise.all(
    response.data.bibs.map((bib) => {
      // Determine relevant id prefix
      const institutionCode = {
        'recap-pul': 'pb',
        'recap-cul': 'cb',
      }[bib.institution] || 'b';

      const prefixedIdentifier = [institutionCode, bib.bnumber].join('');

      return Bib.nyplApiClientCall(prefixedIdentifier)
        .then((resp) => {
          return resp.status === 404 ? bib : resp;
        })
    })
  ).then((bibs) => {
    // Build "next" pagination URL based on SHEP API next_url..
    // SEP API next_url will be of form:
    //   http://[fqdn]/api/v0.1/subject_headings/[uuid]/bibs?[filter params]
    // We want to translate that into:
    //   /[app base url]/api/subjectHeadings/subject_headings/[uuid]/bibs?[filter params]
    const nextUrl = response.data.next_url
      ? response.data.next_url.replace(/.*?subject_headings\//, `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/`)
      : null

    return {
      data: {
        bibs,
        next_url: nextUrl,
      }
    };
  })
};

/**
 *  This method handles all calls on the SHEP API
 *
 *  @param {string} path The path relative to `process.env.SHEP_API`
 *  @param {object} queryParams An object containing query parameters
 *
 *  @return {Promise<Object>} A promise that resolves the response (or rejects
 *    with an Axios error object - See 
 *    https://www.npmjs.com/package/axios#handling-errors )
 */
const shepApiCall = (path, queryParams) => {
  logger.debug(`Making shep api call: ${appConfig.shepApi}${path}`);

  return axios({
    method: 'GET',
    url: `${appConfig.shepApi}/${path}`,
    params: queryParams,
  }).then((response) => {
    if (/\/bibs$/.test(path)) {
      return convertShepBibsToDiscoveryBibs(response);
    }

    return response;
  });

}

/**
 *  This method proxies arbitrary calls to the SHEP API.
 */
const proxyRequest = (req, res) => {
  const shepApiPath = req.params[0]
  
  shepApiCall(shepApiPath, req.query)
    .then((response) => res.status(response.status || 200).json(response.data))
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
    })
}

export default {
  proxyRequest,
  shepApiCall
}
