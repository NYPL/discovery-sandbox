import NyplApiClient from '@nypl/nypl-data-api-client';
import aws from 'aws-sdk';

import config from '../../../app/data/appConfig';
import logger from '../../../../logger';

const appEnvironment = process.env.APP_ENV || 'production';
const kmsEnvironment = process.env.KMS_ENV || 'encrypted';
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
const CACHE = { clients: [] };

function nyplApiClient(options = { apiName: 'discovery' }) {
  const { apiName } = options;
  if (CACHE.clients[apiName]) {
    return Promise.resolve(CACHE.clients[apiName]);
  }

  const baseUrl = config.api[apiName][appEnvironment];

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

          CACHE.clientId = clientId;
          CACHE.clientSecret = clientSecret;
          CACHE.clients[apiName] = nyplApiClient;

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
  CACHE.clients[apiName] = nyplApiClient;

  return Promise.resolve(nyplApiClient);
}

export default nyplApiClient;
