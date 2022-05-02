/* eslint-env mocha */
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import sinon from "sinon";
import { expect } from "chai";
import dataLoaderUtil from "@dataLoaderUtil";
import appConfig from "@appConfig";

describe("dataLoaderUtil", () => {
  let sandbox;
  let axiosSpy;
  const { routes } = dataLoaderUtil;
  let mockDispatch;
  let mock;
  let consoleStub;

  after(() => {
    sandbox.restore();
  });

  describe("non matching path", () => {
    before(() => {
      sandbox = sinon.createSandbox();
      axiosSpy = sandbox.spy(axios, "get");
      mockDispatch = (x) => x;
      const mockLocation = {
        pathname: `${appConfig.baseUrl}/nonmatching`,
      };
      dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
    });

    it("should do nothing for non-matching path", () => {
      expect(axiosSpy.notCalled).to.equal(true);
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe("search path", () => {
    const mockSearchArgs = [];
    const mockSearchAction = (data) => {
      mockSearchArgs.push(data);
      return "mockSearchAction response";
    };
    const realSearchAction = routes.search.action;
    const mockResponse = { data: "some search data" };
    describe("successful request", () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/search`,
          search: "?q=mockSearch",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.search.action = mockSearchAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.search.action = realSearchAction;
        sandbox.restore();
      });
      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/search?q=mockSearch`
        );
      });
      it("should call dispatch with the search action and the response", () => {
        // 4 calls: loading true, search action, updateLastLoaded, loading false
        expect(mockDispatch.getCalls()).to.have.lengthOf(4);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal(
          "mockSearchAction response"
        );
        expect(mockSearchArgs).to.have.lengthOf(1);
        expect(mockSearchArgs[0]).to.deep.equal(mockResponse);
      });
    });

    describe("unsuccessful request", () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/search`,
          search: "?q=mockSearch",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.search.action = mockSearchAction;
        consoleStub = sandbox.stub(console, "error");
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.search.action = realSearchAction;
        sandbox.restore();
      });

      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/search?q=mockSearch`
        );
      });

      it("should console error", () => {
        expect(consoleStub.calledOnce);
      });
    });
  });

  describe("bib path", () => {
    const mockBibArgs = [];
    const mockBibAction = (data) => {
      mockBibArgs.push(data);
      return "mockBibAction response";
    };
    const realBibAction = routes.bib.action;
    const mockResponse = {};
    describe("successful request", () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/bib/1`,
          search: "",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.bib.action = mockBibAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.bib.action = realBibAction;
        sandbox.restore();
      });
      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/bib/1`
        );
      });
      it("should call dispatch with the search action and the response", () => {
        // 4 calls: loading true, search action, updateLastLoaded, loading false
        expect(mockDispatch.getCalls()).to.have.lengthOf(4);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal(
          "mockBibAction response"
        );
        expect(mockBibArgs).to.have.lengthOf(1);
        expect(mockBibArgs[0]).to.deep.equal(mockResponse);
      });
    });

    describe("unsuccessful request", () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/bib/1`,
          search: "",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.bib.action = mockBibAction;
        consoleStub = sandbox.stub(console, "error");
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.bib.action = realBibAction;
        sandbox.restore();
      });

      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/bib/1`
        );
      });

      it("should console error", () => {
        expect(consoleStub.calledOnce);
      });
    });
  });

  describe("holdRequest path", () => {
    const mockHoldRequestArgs = [];
    const mockHoldRequestAction = (data) => {
      mockHoldRequestArgs.push(data);
      return "mockHoldRequestAction response";
    };
    const realHoldRequestAction = routes.holdRequest.action;
    const mockResponse = {};
    describe("successful request", () => {
      before(() => {
        mock = new MockAdapter(axios);

        mock.onGet(/.*/).reply(200, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/hold/request/1`,
          search: "",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.holdRequest.action = mockHoldRequestAction;
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.holdRequest.action = realHoldRequestAction;
        sandbox.restore();
      });
      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/hold/request/1`
        );
      });
      it("should call dispatch with the search action and the response", () => {
        // 4 calls: loading true, search action, updateLastLoaded, loading false
        expect(mockDispatch.getCalls()).to.have.lengthOf(4);
        expect(mockDispatch.secondCall.args).to.have.lengthOf(1);
        expect(mockDispatch.secondCall.args[0]).to.equal(
          "mockHoldRequestAction response"
        );
        expect(mockHoldRequestArgs).to.have.lengthOf(1);
        expect(mockHoldRequestArgs[0]).to.deep.equal(mockResponse);
      });
    });

    describe("unsuccessful request", () => {
      before(() => {
        mock = new MockAdapter(axios);
        mock.onGet(/.*/).reply(400, mockResponse);
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, "get");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/hold/request/1`,
          search: "",
        };
        mockDispatch = sandbox.spy((x) => x);
        routes.holdRequest.action = mockHoldRequestAction;
        consoleStub = sandbox.stub(console, "error");
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });
      after(() => {
        routes.holdRequest.action = realHoldRequestAction;
        sandbox.restore();
      });

      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/hold/request/1`
        );
      });

      it("should console error", () => {
        expect(consoleStub.calledOnce);
      });
    });
  });

  describe("account path", () => {
    let mockAccountPageArgs = [];
    const mockAccountPageAction = (data) => {
      mockAccountPageArgs.push(data);
      return "mockAccountPageAction response";
    };
    const realAccountAction = routes.account.action;
    before(() => {
      mock = new MockAdapter(axios);
      mock
        .onGet(`${process.env.BASE_URL}/api/account`)
        .reply(200, "<div>html for account page default view</div>");
      mock
        .onGet(`${process.env.BASE_URL}/api/account/items`)
        .reply(200, "<div>html for account page items view</div>");
      mock.onGet(`${process.env.BASE_URL}/api/account/settings`).reply(200, "");
      routes.account.action = mockAccountPageAction;
    });

    after(() => {
      routes.bib.action = realAccountAction;
    });

    describe("successful request", () => {
      describe("default", () => {
        before(() => {
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, "get");
          const mockLocation = {
            pathname: `${appConfig.baseUrl}/account`,
            search: "",
          };
          mockDispatch = sandbox.spy((x) => x);
          dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
        });
        after(() => {
          sandbox.restore();
          mockAccountPageArgs = [];
        });
        it("should make an ajax call to the correct url", () => {
          expect(axiosSpy.getCalls()).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal(
            `${appConfig.baseUrl}/api/account`
          );
        });

        it("should call dispatch with the account action and the response", () => {
          // We expect `dataLoaderUtil.loadDataForRoutes` to have triggered 5 calls:
          //  1. { type: 'RESET_STATE', payload: null }
          //  2. { type: 'UPDATE_LOADING_STATUS', payload: true }
          //  3. "mockAccountPageAction response"
          //  4. { type: 'UPDATE_LAST_LOADED', payload: '/research/collections/shared-collection-catalog/account' }
          //  5. { type: 'UPDATE_LOADING_STATUS', payload: false }
          expect(mockDispatch.getCalls()).to.have.lengthOf(5);
          expect(mockDispatch.thirdCall.args).to.have.lengthOf(1);
          expect(mockDispatch.thirdCall.args[0]).to.equal(
            "mockAccountPageAction response"
          );
          expect(mockAccountPageArgs).to.have.lengthOf(1);
          expect(mockAccountPageArgs[0]).to.equal(
            "<div>html for account page default view</div>"
          );
        });
      });

      describe("items", () => {
        before(() => {
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, "get");
          const mockLocation = {
            pathname: `${appConfig.baseUrl}/account/items`,
            search: "",
          };
          mockDispatch = sandbox.spy((x) => x);
          dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
        });
        after(() => {
          sandbox.restore();
          mockAccountPageArgs = [];
        });
        it("should make an ajax call to the correct url", () => {
          expect(axiosSpy.getCalls()).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal(
            `${appConfig.baseUrl}/api/account/items`
          );
        });

        it("should call dispatch with the account action and the response", () => {
          // 4 calls: loading true, account page action, updateLastLoaded, loading false
          expect(mockDispatch.getCalls()).to.have.lengthOf(5);
          expect(mockDispatch.thirdCall.args).to.have.lengthOf(1);
          expect(mockDispatch.thirdCall.args[0]).to.equal(
            "mockAccountPageAction response"
          );
          expect(mockAccountPageArgs).to.have.lengthOf(1);
          expect(mockAccountPageArgs[0]).to.equal(
            "<div>html for account page items view</div>"
          );
        });
      });

      describe("settings", () => {
        before(() => {
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, "get");
          const mockLocation = {
            pathname: `${appConfig.baseUrl}/account/settings`,
            search: "",
          };
          mockDispatch = sandbox.spy((x) => x);
          dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
        });
        after(() => {
          sandbox.restore();
        });
        it("should make an ajax call to the correct url", () => {
          expect(axiosSpy.getCalls()).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal(
            `${appConfig.baseUrl}/api/account/settings`
          );
        });

        it("should call dispatch with the account action and the response", () => {
          // 4 calls: loading true, account page action, updateLastLoaded, loading false
          expect(mockDispatch.getCalls()).to.have.lengthOf(5);
          expect(mockDispatch.thirdCall.args).to.have.lengthOf(1);
          expect(mockDispatch.thirdCall.args[0]).to.equal(
            "mockAccountPageAction response"
          );
          expect(mockAccountPageArgs).to.have.lengthOf(1);
          expect(mockAccountPageArgs[0]).to.equal("");
        });
      });
    });

    describe("unsuccessful request", () => {
      before(() => {
        axiosSpy = sandbox.spy(axios, "get");
        mock.onGet(`${process.env.BASE_URL}/api/account`).reply(400, {});
        consoleStub = sandbox.stub(console, "error");
        const mockLocation = {
          pathname: `${appConfig.baseUrl}/account/random`,
          search: "",
        };
        dataLoaderUtil.loadDataForRoutes(mockLocation, mockDispatch);
      });

      it("should make an ajax call to the correct url", () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
        expect(axiosSpy.firstCall.args[0]).to.equal(
          `${appConfig.baseUrl}/api/account/random`
        );
      });

      it("should console error", () => {
        expect(consoleStub.calledOnce);
      });
    });
  });
});
