/* eslint-env mocha */
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';

const mock = new MockAdapter(axios);

import { ajaxCall } from '../../src/app/utils/utils.js';

describe('ajaxCall()', () => {
  describe('No input', () => {
    it('should return null if no enpoint is passed', () => {
      expect(ajaxCall()).to.equal(null);
    });
  });

  describe('Good call', () => {
    before(() => {
      mock
        .onGet('/api?q=locofocos')
        .reply(200, { searchResults: [] });
    });

    after(() => {
      mock.reset();
    });

    it('should call the "get" function from axios with an endpoint', () => {
      const ajaxCallGetSpy = sinon.spy(axios, 'get');
      ajaxCall('/api?q=locofocos');

      expect(ajaxCallGetSpy.callCount).to.equal(1);

      ajaxCallGetSpy.restore();
    });

    // Todo: This doesn't test correctly.
    it('should invoke the callback function', () => {
      const cbSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', cbSpy);

      // expect(cbSpy.callCount).to.equal(1);
    });
  });

  describe('Bad call', () => {
    before(() => {
      mock
        .onGet('/api?q=locofocos')
        .reply(400, { searchResults: [] });
    });

    after(() => {
      mock.reset();
    });

    it('should invoke the error callback function', () => {
      const cbSpy = sinon.spy();
      const cbErrorSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', (response) => cbSpy, (error) => cbErrorSpy);

      expect(cbSpy.callCount).to.equal(0);
      expect(cbErrorSpy.callCount).to.equal(1);
    });
  });
});
