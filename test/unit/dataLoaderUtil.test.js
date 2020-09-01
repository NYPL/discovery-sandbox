/* eslint-env mocha */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { expect } from 'chai';
import dataLoaderUtil from '@dataLoaderUtil';
import appConfig from '@appConfig';

describe('dataLoaderUtil', () => {
  let sandbox;
  let axiosSpy;
  const { routes } = dataLoaderUtil;
  let mockDispatch;
  let mock;
  let consoleSpy;

  describe('non matching path', () => {
    before(() => {
      sandbox = sinon.createSandbox();
      axiosSpy = sandbox.spy(axios, 'get');
      mockDispatch = x => x;
      const mockLocation = {
        pathname: `${appConfig.baseUrl}/nonmatching`,
      };
      dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
    });

    it('should do nothing for non-matching path', () => {
      expect(axiosSpy.notCalled).to.equal(true);
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe('search path', () => {
    const mockSearchArgs = [];
    const mockSearchAction = (data) => {
      mockSearchArgs.push(data);
      return 'mockSearchAction response';
    };
    const realSearchAction = routes.search.action;
    const mockResponse = {};
    describe('successful request', () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/search`,
          search: '?q=mockSearch',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.search.action = mockSearchAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.search.action = realSearchAction;
        sandbox.restore();
      });
      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/search?q=mockSearch`);
      });
      it('should call dispatch with the search action and the response', () => {
        expect(mockDispatch.getCalls()).to.have.lengthOf(2);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal('mockSearchAction response');
        expect(mockSearchArgs).to.have.lengthOf(1);
        expect(mockSearchArgs[0]).to.equal(mockResponse);
      });
    });

    describe('unsuccessful request', () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/search`,
          search: '?q=mockSearch',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.search.action = mockSearchAction;
        consoleSpy = sandbox.spy(console, 'error');
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.search.action = realSearchAction;
        sandbox.restore();
      });

      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/search?q=mockSearch`);
      });

      it('should console error', () => {
        expect(consoleSpy.calledOnce);
      });
    });
  });

  describe('bib path', () => {
    const mockBibArgs = [];
    const mockBibAction = (data) => {
      mockBibArgs.push(data);
      return 'mockBibAction response';
    };
    const realBibAction = routes.bib.action;
    const mockResponse = {};
    describe('successful request', () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/bib/1`,
          search: '',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.bib.action = mockBibAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.bib.action = realBibAction;
        sandbox.restore();
      });
      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/bib/1`);
      });
      it('should call dispatch with the search action and the response', () => {
        expect(mockDispatch.getCalls()).to.have.lengthOf(2);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal('mockBibAction response');
        expect(mockBibArgs).to.have.lengthOf(1);
        expect(mockBibArgs[0]).to.equal(mockResponse);
      });
    });

    describe('unsuccessful request', () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/bib/1`,
          search: '',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.bib.action = mockBibAction;
        consoleSpy = sandbox.spy(console, 'error');
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.bib.action = realBibAction;
        sandbox.restore();
      });

      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/bib/1`);
      });

      it('should console error', () => {
        expect(consoleSpy.calledOnce);
      });
    });
  });

  describe('holdRequest path', () => {
    const mockHoldRequestArgs = [];
    const mockHoldRequestAction = (data) => {
      mockHoldRequestArgs.push(data);
      return 'mockHoldRequestAction response';
    };
    const realHoldRequestAction = routes.holdRequest.action;
    const mockResponse = {};
    describe('successful request', () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/hold/request/1`,
          search: '',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.holdRequest.action = mockHoldRequestAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.holdRequest.action = realHoldRequestAction;
        sandbox.restore();
      });
      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/hold/request/1`);
      });
      it('should call dispatch with the search action and the response', () => {
        expect(mockDispatch.getCalls()).to.have.lengthOf(2);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal('mockHoldRequestAction response');
        expect(mockHoldRequestArgs).to.have.lengthOf(1);
        expect(mockHoldRequestArgs[0]).to.equal(mockResponse);
      });
    });

    describe('unsuccessful request', () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/hold/request/1`,
          search: '',
        };
        mockDispatch = sandbox.spy(x => x);
        routes.holdRequest.action = mockHoldRequestAction;
        consoleSpy = sandbox.spy(console, 'error');
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.holdRequest.action = realHoldRequestAction;
        sandbox.restore();
      });

      it('should make an ajax call to the correct url', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(`${appConfig.baseUrl}/api/hold/request/1`);
      });

      it('should console error', () => {
        expect(consoleSpy.calledOnce);
      });
    });
  });
});
