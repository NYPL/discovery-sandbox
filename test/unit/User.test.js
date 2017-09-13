/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
// Import the component that is going to be tested
import User from './../../src/server/ApiRoutes/User.js';

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
const renderMockReq = (data) => (
  {
    get: (n) => n,
    protocol: 'http',
    originalUrl: '/hold/request/b11995345-i14211097',
    patronTokenResponse: data,
  }
);
const mockRes = { redirect: () => {} };

describe('If requireUser does not receive valid value from "req.patronTokenResponse"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
    mockPatronTokenResponse = {};
  });

  after(() => {
    mockPatronTokenResponse = {
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
    requireUser.restore();
  });

  it('should return false', () => {
    requireUser(renderMockReq(mockPatronTokenResponse), mockRes);

    expect(requireUser.returnValues[0]).to.equal(false);
  });
});

describe('If requireUser does not receive valid value from "req.patronTokenResponse.isTokenValid"',
  () => {
    let requireUser;

    before(() => {
      requireUser = sinon.spy(User, 'requireUser');
      mockPatronTokenResponse.isTokenValid = false;
    });

    after(() => {
      mockPatronTokenResponse.isTokenValid = true;
      requireUser.restore();
    });

    it('should return false', () => {
      requireUser(renderMockReq(mockPatronTokenResponse), mockRes);

      expect(requireUser.returnValues[0]).to.equal(false);
    });
  }
);

describe('If requireUser does not receive valid value from "req.patronTokenResponse.decodedPatron"',
  () => {
    let requireUser;

    before(() => {
      requireUser = sinon.spy(User, 'requireUser');
      mockPatronTokenResponse.decodedPatron = undefined;
    });

    after(() => {
      mockPatronTokenResponse.decodedPatron = {
        decodedPatron:
        {
          iss: 'https://www.nypl.org',
          sub: '6677666',
          aud: 'app_myaccount',
          iat: 1498162833,
          exp: 1498166433,
          auth_time: 1498162833,
          scope: 'openid offline_access patron:read',
        },
      };
      requireUser.restore();
    });

    it('should return false', () => {
      requireUser(renderMockReq(mockPatronTokenResponse), mockRes);

      expect(requireUser.returnValues[0]).to.equal(false);
    });
  }
);

describe('If requireUser does not receive valid value from "req.patronTokenResponse.' +
  'decodedPatron.sub"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
    mockPatronTokenResponse.decodedPatron.sub = undefined;
  });

  after(() => {
    mockPatronTokenResponse.decodedPatron.sub = '6677666';
    requireUser.restore();
  });

  it('should return false', () => {
    requireUser(renderMockReq(mockPatronTokenResponse), mockRes);

    expect(requireUser.returnValues[0]).to.equal(false);
  });
});

describe('If requireUser receives all valid values from "req"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
  });

  after(() => {
    requireUser.restore();
  });

  it('should return true', () => {
    requireUser({ patronTokenResponse: mockPatronTokenResponse }, mockRes);

    expect(requireUser.returnValues[0]).to.equal(true);
  });
});
