/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
// import { mount } from 'enzyme';
// Import the component that is going to be tested
import User from './../../src/server/ApiRoutes/User.js';

const necessaryValues = [
  'req.tokenResponse',
  'req.tokenResponse.isTokenValid',
  'req.tokenResponse.accessToken',
  'req.tokenResponse.decodedPatron',
  'req.tokenResponse.decodedPatron.sub'
];

const mockTokenResponse = {
  isTokenValid: true,
  accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvd3d3Lm55cGwub3JnIiwic3ViIjoiNjY3NzI3MyIsImF1ZCI6ImFwcF9teWFjY291bnQiLCJpYXQiOjE0OTgxNjI4MzMsImV4cCI6MTQ5ODE2NjQzMywiYXV0aF90aW1lIjoxNDk4MTYyODMzLCJzY29wZSI6Im9wZW5pZCBvZmZsaW5lX2FjY2VzcyBwYXRyb246cmVhZCJ9.ay8XM1ASsb346pOlBmZuZHTi5fewQe3-XRqIg9rxCw8T8iGftQJWYLzLImhIMVhAMlQ6YTu3pIb7Kv5Drkq_nnvSz85B2-bwuZh75PcLj7oT_7J4STHQYc1haDOcHTdoWhE8qMJs49CvcgCsBq_1_mqCD4e1mrkE9binHd3AfFbUogYK8GyqgCSxLjH_GkhwGZL_YewQQ32sJWlPJIpREKvCDxPMsHm16WzjD9YXXFZzrU-9NjOimewFuZFEKpk56j3T-94GBrz4bubr1o3wzPYEgAZJjQQf9aHIZm1zRpx3av1dm80kTJTgDCZv6HFZM2uZsntkSejDelmut_H1Jg',
  decodedPatron: {
    iss: 'https://www.nypl.org',
    sub: '6677666',
    aud: 'app_myaccount',
    iat: 1498162833,
    exp: 1498166433,
    auth_time: 1498162833,
    scope: 'openid offline_access patron:read'
  },
  errorCode: null,
};

describe('If requireUser does not receive valid value from "req.tokenResponse"', () => {});
describe('If requireUser does not receive valid value from "req.tokenResponse.isTokenValid"', () => {});
describe('If requireUser does not receive valid value from "req.tokenResponse.accessToken"', () => {});
describe('If requireUser does not receive valid value from "req.tokenResponse.decodedPatron"', () => {});

describe('If requireUser does not receive valid value from "req.tokenResponse.decodedPatron.sub"', () => {
  it('should return false', () => {

  });
});

describe('If requireUser does not receive all valid values from "req"', () => {
  it('should return true', () => {

  });
});

// describe('HoldRequest', () => {
//   describe('After being rendered, <HoldRequest>', () => {
//     let component;
//     let requireUser;

//     before(() => {
//       requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');
//       component = mount(<HoldRequest />);
//     });

//     after(() => {
//       requireUser.restore();
//       component.unmount();
//     });

//     it('should check if the patron is logged in.', () => {
//       expect(requireUser.calledOnce).to.equal(true);
//     });
//   });

//   describe('If the patron is not logged in, <HoldRequest>', () => {
//     let component;
//     let requireUser;

//     before(() => {
//       requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');
//       component = mount(<HoldRequest />);
//     });

//     after(() => {
//       requireUser.restore();
//       component.unmount();
//     });

//     it('should redirect the patron to OAuth log in page.', () => {
//       expect(requireUser.returnValues[0]).to.equal(false);
//     });

//     it('should display log in error message.', () => {
//       expect(component.find('.loggedInInstruction').text()).to.equal(
//         'Something went wrong during retrieving your patron data.'
//       );
//     });
//   });

//   describe('If the patron is logged in but the App doesn\'t get valid data, <HoldRequest>', () => {
//     let component;
//     let requireUser;

//     before(() => {
//       Actions.updatePatronData({
//         id: '6677200',
//         names: ['Leonard, Mike'],
//         barcodes: ['162402680435300'],
//       });
//       requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');
//       component = mount(<HoldRequest />);
//     });

//     after(() => {
//       requireUser.restore();
//       component.unmount();
//     });

//     it('should pass the patron data check in requireUser().', () => {
//       expect(requireUser.returnValues[0]).to.equal(true);
//     });

//     it('should deliver the patron\'s name on the page', () => {
//       expect(component.find('.loggedInInstruction').find('strong').text())
//         .to.equal('Leonard, Mike');
//     });

//     it('should display the layout of error page.', () => {
//       expect(component.find('.item').find('h2').text())
//         .to.equal('Something wrong with your request');
//     });

//     it('should not deliver request button with the respective URL on the page', () => {
//       expect(component.find('.place-hold-form').find('button')).to.have.length(0);
//     });
//   });

//   describe('If the patron is logged in and the App receives valid data, <HoldRequest>', () => {
//     it('should display the layout of hold request.', () => {

//     });

//     it('should deliver the patron\'s name on the page', () => {

//     });

//     it('should deliver request button with the respective URL on the page', () => {

//     });
//   });
// });
