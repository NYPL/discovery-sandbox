/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import nock from 'nock';
import { expect } from 'chai';
import appConfig from '../../src/app/data/appConfig';
import CachedAxios from '../../src/app/utils/CachedAxios';

describe('Cached Axios', () => {
  let callCount = 0;
  let savedBaseUrl;
  const cachedAxios = new CachedAxios();

  before(() => {
    // set up mock api
    savedBaseUrl = appConfig.baseUrl;
    appConfig.baseUrl = 'http://test-server.com';
    nock('http://test-server.com')
      .defaultReplyHeaders({
        'access-control-allow-origin': '*',
        'access-control-allow-credentials': 'true',
      })
      .get(/\/api/)
      .reply(200, () => {
        callCount += 1;
        return 'fake response';
      });
  });

  after(() => {
    appConfig.baseUrl = savedBaseUrl;
  });

  it('should call the api the first time', () => {
    return new Promise((resolve) => {
      cachedAxios.call('http://test-server.com/api');
      setTimeout(() => {
        expect(callCount).to.equal(1);
        resolve();
      }, 100);
    });
  });

  it('should not call the api the second time', () => {
    return new Promise((resolve) => {
      let returnedValue;
      cachedAxios.call('http://test-server.com/api').then((ret) => {
        returnedValue = ret.data;
      });
      setTimeout(() => {
        expect(callCount).to.equal(1);
        expect(returnedValue).to.equal('fake response');
        resolve();
      }, 100);
    });
  });
});
