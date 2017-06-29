/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';
// Import the component that is going to be tested
import User from './../../src/server/ApiRoutes/User.js';

let mockTokenResponse = {
  isTokenValid: true,
  accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lm55cGwub3J' +
    'nIiwic3ViIjoiNjY3NzI3MyIsImF1ZCI6ImFwcF9teWFjY291bnQiLCJpYXQiOjE0OTgxNjI4MzMsImV4cCI6MT' +
    'Q5ODE2NjQzMywiYXV0aF90aW1lIjoxNDk4MTYyODMzLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBwY' +
    'XRyb246cmVhZCJ9.ay8XM1ASsb346pOlBmZuZHTi5fewQe3-XRqIg9rxCw8T8iGftQJWYLzLImhIMVhAMlQ6YTu' +
    '3pIb7Kv5Drkq_nnvSz85B2-bwuZh75PcLj7oT_7J4STHQYc1haDOcHTdoWhE8qMJs49CvcgCsBq_1_mqCD4e1mr' +
    'kE9binHd3AfFbUogYK8GyqgCSxLjH_GkhwGZL_YewQQ32sJWlPJIpREKvCDxPMsHm16WzjD9YXXFZzrU-9NjOim' +
    'ewFuZFEKpk56j3T-94GBrz4bubr1o3wzPYEgAZJjQQf9aHIZm1zRpx3av1dm80kTJTgDCZv6HFZM2uZsntkSejD' +
    'elmut_H1Jg',
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
    tokenResponse: data,
  }
);
const mockRes = { redirect: () => {} };

describe('If requireUser does not receive valid value from "req.tokenResponse"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
    mockTokenResponse = {};
  });

  after(() => {
    mockTokenResponse = {
      isTokenValid: true,
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lm55cGwub3J' +
        'nIiwic3ViIjoiNjY3NzI3MyIsImF1ZCI6ImFwcF9teWFjY291bnQiLCJpYXQiOjE0OTgxNjI4MzMsImV4cCI6MT' +
        'Q5ODE2NjQzMywiYXV0aF90aW1lIjoxNDk4MTYyODMzLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBwY' +
        'XRyb246cmVhZCJ9.ay8XM1ASsb346pOlBmZuZHTi5fewQe3-XRqIg9rxCw8T8iGftQJWYLzLImhIMVhAMlQ6YTu' +
        '3pIb7Kv5Drkq_nnvSz85B2-bwuZh75PcLj7oT_7J4STHQYc1haDOcHTdoWhE8qMJs49CvcgCsBq_1_mqCD4e1mr' +
        'kE9binHd3AfFbUogYK8GyqgCSxLjH_GkhwGZL_YewQQ32sJWlPJIpREKvCDxPMsHm16WzjD9YXXFZzrU-9NjOim' +
        'ewFuZFEKpk56j3T-94GBrz4bubr1o3wzPYEgAZJjQQf9aHIZm1zRpx3av1dm80kTJTgDCZv6HFZM2uZsntkSejD' +
        'elmut_H1Jg',
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
    requireUser(renderMockReq(mockTokenResponse), mockRes);

    expect(requireUser.returnValues[0]).to.equal(false);
  });
});

describe('If requireUser does not receive valid value from "req.tokenResponse.isTokenValid"',
  () => {
    let requireUser;

    before(() => {
      requireUser = sinon.spy(User, 'requireUser');
      mockTokenResponse.isTokenValid = false;
    });

    after(() => {
      mockTokenResponse.isTokenValid = true;
      requireUser.restore();
    });

    it('should return false', () => {
      requireUser(renderMockReq(mockTokenResponse), mockRes);

      expect(requireUser.returnValues[0]).to.equal(false);
    });
  }
);

describe('If requireUser does not receive valid value from "req.tokenResponse.accessToken"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
    mockTokenResponse.accessToken = undefined;
  });

  after(() => {
    mockTokenResponse.accessToken =
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lm55cGwub3J' +
      'nIiwic3ViIjoiNjY3NzI3MyIsImF1ZCI6ImFwcF9teWFjY291bnQiLCJpYXQiOjE0OTgxNjI4MzMsImV4cCI6MT' +
      'Q5ODE2NjQzMywiYXV0aF90aW1lIjoxNDk4MTYyODMzLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBwY' +
      'XRyb246cmVhZCJ9.ay8XM1ASsb346pOlBmZuZHTi5fewQe3-XRqIg9rxCw8T8iGftQJWYLzLImhIMVhAMlQ6YTu' +
      '3pIb7Kv5Drkq_nnvSz85B2-bwuZh75PcLj7oT_7J4STHQYc1haDOcHTdoWhE8qMJs49CvcgCsBq_1_mqCD4e1mr' +
      'kE9binHd3AfFbUogYK8GyqgCSxLjH_GkhwGZL_YewQQ32sJWlPJIpREKvCDxPMsHm16WzjD9YXXFZzrU-9NjOim' +
      'ewFuZFEKpk56j3T-94GBrz4bubr1o3wzPYEgAZJjQQf9aHIZm1zRpx3av1dm80kTJTgDCZv6HFZM2uZsntkSejD' +
      'elmut_H1Jg';
    requireUser.restore();
  });

  it('should return false', () => {
    requireUser(renderMockReq(mockTokenResponse), mockRes);

    expect(requireUser.returnValues[0]).to.equal(false);
  });
});

describe('If requireUser does not receive valid value from "req.tokenResponse.decodedPatron"',
  () => {
    let requireUser;

    before(() => {
      requireUser = sinon.spy(User, 'requireUser');
      mockTokenResponse.decodedPatron = undefined;
    });

    after(() => {
      mockTokenResponse.decodedPatron = {
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
      requireUser(renderMockReq(mockTokenResponse), mockRes);

      expect(requireUser.returnValues[0]).to.equal(false);
    });
  }
);

describe('If requireUser does not receive valid value from "req.tokenResponse.decodedPatron.sub"',
  () => {
    let requireUser;

    before(() => {
      requireUser = sinon.spy(User, 'requireUser');
      mockTokenResponse.decodedPatron.sub = undefined;
    });

    after(() => {
      mockTokenResponse.decodedPatron.sub = '6677666';
      requireUser.restore();
    });

    it('should return false', () => {
      requireUser(renderMockReq(mockTokenResponse), mockRes);

      expect(requireUser.returnValues[0]).to.equal(false);
    });
  }
);

describe('If requireUser receives all valid values from "req"', () => {
  let requireUser;

  before(() => {
    requireUser = sinon.spy(User, 'requireUser');
  });

  after(() => {
    requireUser.restore();
  });

  it('should return true', () => {
    requireUser({ tokenResponse: mockTokenResponse }, mockRes);

    expect(requireUser.returnValues[0]).to.equal(true);
  });
});
