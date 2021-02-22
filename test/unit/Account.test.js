/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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

const renderMockReq = (content, mockPatronTokenResponse = validMockPatronTokenResponse) => ({
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
  json: resp => ({ resp }),
};
const mockResolve = resp => resp;

describe('`fetchAccountPage`', () => {
  let requireUser;
  let axiosGet;
  let mock;

  before(() => {
    requireUser = sinon.stub(User, 'requireUser').callsFake(req => ({ redirect: !req.patronTokenResponse.isTokenValid }));
    axiosGet = sinon.spy(axios, 'get');
    mock = new MockAdapter(axios);
    mock
      .onGet(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/holds`)
      .reply(200, '<div>some html</div>');
    mock
      .onGet(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/items`)
      .reply(200, '<div>some html</div>');
    global.store = {
      getState: () => ({
        patron: {},
      }),
    };
  });

  after(() => {
    requireUser.restore();
    axiosGet.restore();
    global.store = undefined;
    mock.restore();
  });

  beforeEach(() => {
    axiosGet.reset();
  });

  describe('patron not logged in', () => {
    it('should not make axios request', () => {
      Account.fetchAccountPage(renderMockReq('items', { isTokenValid: false }), mockRes, mockResolve);
      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('does not receive valid value from "req.params.content"', () => {
    before(() => {
      global.store = {
        getState: () => ({
          patron,
        }),
      };
    });

    it('should redirect', () => {
      Account.fetchAccountPage(renderMockReq('blahblah'), mockRes, mockResolve);

      expect(urlToTest).to.equal('/research/collections/shared-collection-catalog/account');
    });

    it('should not make axios request', () => {
      expect(axiosGet.notCalled).to.equal(true);
    });
  });

  describe('"settings" content', () => {
    let getHomeLibrarySpy;
    before(() => {
      global.store = {
        getState: () => ({
          patron,
        }),
      };
      getHomeLibrarySpy = sinon.spy(Account, 'getHomeLibrary');
    });

    it('should not make axios request', () => {
      Account.fetchAccountPage(renderMockReq('settings'), mockRes, mockResolve);
      expect(axiosGet.notCalled).to.equal(true);
    });
    xit('should call getHomeLibrary', () => {
      // not working :/
      expect(getHomeLibrarySpy.called).to.equal(true);
    })
  });

  describe('content to get from Webpac', () => {
    before(() => {
      global.store = {
        getState: () => ({
          patron,
        }),
      };
    });

    it('should make axios request', () => {
      Account.fetchAccountPage(renderMockReq('holds'), mockRes, mockResolve);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/holds`);
    });
  });

  describe('"/account", with no `content` param', () => {
    before(() => {
      global.store = {
        getState: () => ({
          patron,
        }),
      };
    });

    it('should fetch the "items" page', () => {
      Account.fetchAccountPage(renderMockReq(), mockRes, mockResolve);

      expect(axiosGet.calledOnce).to.equal(true);
      expect(axiosGet.firstCall.args[0]).to.equal(`${appConfig.legacyCatalog}/dp/patroninfo*eng~Sdefault/6677666/items`);
    });
  });
});
