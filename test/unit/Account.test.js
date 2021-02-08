/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
import axios from 'axios';
// import MockAdapter from 'axios-mock-adapter';

import Account from './../../src/server/ApiRoutes/Account';
import User from './../../src/server/ApiRoutes/User';
import appConfig from './../../src/app/data/appConfig';

let mockPatronTokenResponse = {
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
const renderMockReq = content => ({
  params: { content },
  get: n => n,
  patronTokenResponse: mockPatronTokenResponse,
  headers: {
    cookie: '',
  },
});
let urlToTest = '';
const mockRes = {
  redirect: (url) => {
    urlToTest = url;
  },
  json: (resp) => {resp},
};
const mockResolve = resp => resp;

describe('`fetchAccountPage`', () => {
  let fetchAccountPage;
  let requireUser;
  let axiosGet;

  before(() => {
    fetchAccountPage = sinon.spy(Account, 'fetchAccountPage');
    requireUser = sinon.stub(User, 'requireUser').callsFake(() => ({ redirect: false }));
    axiosGet = sinon.spy(axios, 'get');
  });

  after(() => {
    fetchAccountPage.restore();
    requireUser.restore();
    axiosGet.restore();
  });

  beforeEach(() => {
    axiosGet.reset();
  })

  describe('does not receive valid value from "req.params.content"', () => {
    it('should redirect', () => {
      fetchAccountPage(renderMockReq('blahblah'), mockRes, mockResolve);

      expect(urlToTest).to.equal('/research/collections/shared-collection-catalog/account');
    });

    it('should not make axios request', () => {
      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('"settings" content', () => {
    it('should not make axios request', () => {
      fetchAccountPage(renderMockReq('settings'), mockRes, mockResolve);

      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('content to get from Webpac', () => {
    it('should make axios request', () => {
      fetchAccountPage(renderMockReq('holds'), mockRes, mockResolve);
      console.log('axiosGet', axiosGet.calledOnce);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/holds`);
    });
  });

  describe('"/account", with no `content` param', () => {
    it('should fetch the "items" page', () => {
      fetchAccountPage(renderMockReq(), mockRes, mockResolve);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/items`);
    });
  })
});
