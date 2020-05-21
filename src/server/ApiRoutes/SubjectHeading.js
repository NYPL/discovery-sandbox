import axios from 'axios';

import Bib from './Bib';
import { search } from './Search';
import logger from '../../../logger';
import appConfig from '../../app/data/appConfig';
import {
  getReqParams,
  basicQuery,
  // parseServerSelectedFilters,
} from '../../app/utils/utils';

const bibsServer = (req, res, next) => {
  const { page, sort, order, filters } = getReqParams(req.query);

  search(
    page,
    sort,
    order,
    filters,
    (apiFilters, data, pageQuery) => {
      const selectedFilters = {
        subjectLiteral: [],
      };

      if (!_isEmpty(filters)) {
        _mapObject(filters, (value, key) => {
          let filterObj;
          if (key === 'subjectLiteral') {
            const subjectLiteralValues = _isArray(value) ? value : [value];
            subjectLiteralValues.forEach((subjectLiteralValue) => {
              selectedFilters[key].push({
                selected: true,
                value: subjectLiteralValue,
                label: subjectLiteralValue,
              });
            });
          }
        });
      }

      res.locals.data.ShepStore = {
        bibResults: data,
        subjectLiteral: selectedFilters.subjectLiteral,
        page: pageQuery,
        sortBy: sort ? `${sort}_${order}` : 'date_desc',
        error: {},
      };

      next();
    },
    (error) => {
      logger.error('Error retrieving search data in searchServer', error);
      res.locals.data.ShepStore = {
        searchResults: {},
        subjectLiteral: '',
        page: '1',
        sortBy: 'date_desc',
        error,
      };

      next();
    },
  );
};

const convertShepBibsToDiscoveryBibs = response =>
  Promise.all(
    response.data.bibs.map((bib) => {
      // Determine relevant id prefix
      const institutionCode = {
        'recap-pul': 'pb',
        'recap-cul': 'cb',
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
        bibs,
        next_url: nextUrl,
      },
    };
  });

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
    url: `${appConfig.shepApi}${path}`,
    params: queryParams,
  }).then((response) => {
    if (/\/bibs$/.test(path)) {
      return convertShepBibsToDiscoveryBibs(response);
    }

    return response;
  });
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
  bibsServer,
};
