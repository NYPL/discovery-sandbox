/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import NyplApiClient from '@nypl/nypl-data-api-client';

import Account from './../../src/server/ApiRoutes/Account';
import User from './../../src/server/ApiRoutes/User';
import appConfig from './../../src/app/data/appConfig';
import patron from '../fixtures/patron';

const validMockPatronTokenResponse = {
  isTokenValid: true,
  decodedPatron: {
    iss: 'https://www.nypl.org',
    sub: '6677666',
    aud: 'app_myaccount',
    iat: 1498162833,
    exp: 1498166433,
    auth_time: 1498162833,
    scope: 'openid offline_access patron:read',
  },
  errorCode: null,
};

const renderMockReq = (
  content,
  mockPatronTokenResponse = validMockPatronTokenResponse,
  patronObj = {},
) => ({
  params: { content },
  get: n => n,
  patronTokenResponse: mockPatronTokenResponse,
  headers: {
    cookie: '',
  },
  store: {
    getState: () => ({
      patron: patronObj,
    }),
  },
});

const mockRes = {
  json: resp => ({ resp }),
};
const mockResolve = resp => resp;

describe('`fetchAccountPage`', () => {
  let requireUser;
  let axiosGet;
  let mock;
  let redirectedTo = '';

  before(() => {
    requireUser = sinon.stub(User, 'requireUser').callsFake(req => ({ redirect: !req.patronTokenResponse.isTokenValid }));
    axiosGet = sinon.spy(axios, 'get');
    mock = new MockAdapter(axios);
    mock
      .onGet(`${appConfig.legacyBaseUrl}/dp/patroninfo*eng~Sdefault/6677666/holds`)
      .reply(200, '<div>some html</div>');
    mock
      .onGet(`${appConfig.legacyBaseUrl}/dp/patroninfo*eng~Sdefault/6677666/items`)
      .reply(200, '<div>some html</div>');
  });

  after(() => {
    requireUser.restore();
    axiosGet.restore();
    mock.restore();
  });

  beforeEach(() => {
    axiosGet.reset();
    redirectedTo = '';

    mockRes.redirect = (url) => {
      redirectedTo = url;
    };
  });

  describe('patron not logged in', () => {
    it('should not make axios request', () => {
      Account.fetchAccountPage(renderMockReq('items', { isTokenValid: false }), mockRes, mockResolve);
      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('does not receive valid value from "req.params.content"', () => {
    it('should redirect', () => {
      Account.fetchAccountPage(renderMockReq('blahblah', validMockPatronTokenResponse, patron), mockRes, mockResolve);

      expect(redirectedTo).to.equal('/research/collections/shared-collection-catalog/account');
    });

    it('should not make axios request', () => {
      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('"settings" content', () => {
    const sinonSandbox = sinon.createSandbox();

    beforeEach(() => {
      sinonSandbox.stub(NyplApiClient.prototype, 'get').callsFake((path) => {
        return Promise.resolve(JSON.parse(require('fs').readFileSync('./test/fixtures/locations-service-mm.json', 'utf8')))
      });

      sinonSandbox.spy(Account, 'getHomeLibrary');
    });

    afterEach(() => {
      sinonSandbox.restore();
    });

    it('should not make axios request', () => {
      Account.fetchAccountPage(renderMockReq('settings', validMockPatronTokenResponse, patron), mockRes, mockResolve);
      expect(axiosGet.notCalled).to.equal(true);
    });

    it('should call getHomeLibrary', () => (
      Account.fetchAccountPage(
        renderMockReq('settings', validMockPatronTokenResponse, patron), mockRes, (result) => {
          expect(result).to.be.a('object');
          expect(result.patron).to.be.a('object');
          expect(result.patron.homeLibraryName).to.eq('Mid-Manhattan');
        })
    ));
  });

  describe('content to get from Webpac', () => {
    it('should make axios request', () => {
      Account.fetchAccountPage(renderMockReq('holds'), mockRes, mockResolve);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.webpacBaseUrl}/dp/patroninfo*eng~Sdefault/6677666/holds`);
    });
  });

  describe('"/account", with no `content` param', () => {
    it('should fetch the "items" page', () => {
      Account.fetchAccountPage(renderMockReq(), mockRes, mockResolve);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.webpacBaseUrl}/dp/patroninfo*eng~Sdefault/6677666/items`);
    });
  });
});
