import NyplApiClient from '@nypl/nypl-data-api-client';
import aws from 'aws-sdk';

import config from '../../../app/data/appConfig';
import logger from '../../../../logger';

const appEnvironment = process.env.APP_ENV || 'production';
const kmsEnvironment = process.env.KMS_ENV || 'encrypted';
const platformApiBase = config.api[appEnvironment];
let decryptKMS;
let kms;

if (kmsEnvironment === 'encrypted') {
  kms = new aws.KMS({
    region: 'us-east-1',
  });

  decryptKMS = (key) => {
    const params = {
      CiphertextBlob: new Buffer(key, 'base64'),
    };

    return new Promise((resolve, reject) => {
      kms.decrypt(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Plaintext.toString());
        }
      });
    });
  };
}

const clientId = process.env.clientId || process.env.PLATFORM_API_CLIENT_ID;
const clientSecret = process.env.clientSecret || process.env.PLATFORM_API_CLIENT_SECRET;

const keys = [clientId, clientSecret];
const CACHE = {};

function nyplApiClient(options = {}) {
  const { apiBaseUrl } = options;
  if (CACHE.nyplApiClient && !apiBaseUrl) {
    return Promise.resolve(CACHE.nyplApiClient);
  } else if (apiBaseUrl && CACHE[apiBaseUrl]) {
    return Promise.resolve(CACHE[apiBaseUrl]);
  }

  const baseUrl = apiBaseUrl || platformApiBase;

  if (kmsEnvironment === 'encrypted') {
    return new Promise((resolve, reject) => {
      Promise.all(keys.map(decryptKMS))
        .then(([decryptedClientId, decryptedClientSecret]) => {
          const nyplApiClient = new NyplApiClient({
            base_url: baseUrl,
            oauth_key: decryptedClientId,
            oauth_secret: decryptedClientSecret,
            oauth_url: config.tokenUrl,
          });

          CACHE.clientId = decryptedClientId;
          CACHE.clientSecret = decryptedClientSecret;
          if (apiBaseUrl) CACHE[apiBaseUrl] = nyplApiClient;
          else CACHE.nyplApiClient = nyplApiClient;

          resolve(nyplApiClient);
        })
        .catch((error) => {
          logger.error('ERROR trying to decrypt using KMS.', error);
          reject('ERROR trying to decrypt using KMS.', error);
        });
    });
  }

  const nyplApiClient = new NyplApiClient({
    base_url: baseUrl,
    oauth_key: clientId,
    oauth_secret: clientSecret,
    oauth_url: config.tokenUrl,
  });

  CACHE.clientId = clientId;
  CACHE.clientSecret = clientSecret;
  if (apiBaseUrl) CACHE[apiBaseUrl] = nyplApiClient;
  else CACHE.nyplApiClient = nyplApiClient;

  return Promise.resolve(nyplApiClient);
}

export default nyplApiClient;
