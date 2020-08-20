/* eslint-env mocha */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { expect } from 'chai';
import dataLoaderUtil from '@dataLoaderUtil';
import {
  updateBibPage,
  updateSearchResultsPage,
  updateHoldRequestPage,
  updateLoadingStatus,
  updatePage,
} from '@Actions';
import Bib from '@Bib';
import Search from '../../src/server/ApiRoutes/Search';
import Hold from '@Hold';
import routeMethods from '../../src/server/ApiRoutes/RouteMethods';
import store from '@Store';

describe('dataLoaderUtil', () => {
  let sandbox;
  let axiosSpy;
  const actionsSpy = {};
  const actions = {
    updateBibPage,
    updateSearchResultsPage,
    updateHoldRequestPage,
    updateLoadingStatus,
  };
  let mockRouteMethods;
  before(() => {
    sandbox = sinon.createSandbox();
    axiosSpy = sandbox.spy(axios, 'get');
    Object.keys(actions).forEach((key) => {
      if (typeof actions[key] === 'function') {
        actionsSpy[key] = sandbox.spy(actions, key);
      }
    });
    mockRouteMethods = {
      bib: sandbox.spy(),
      search: sandbox.spy(),
      hold: sandbox.spy(),
    };
  });
  afterEach(() => {
    sandbox.reset();
  });
  after(() => {
    sandbox.restore();
  });
  describe('server side call', () => {
    describe('non-matching path', () => {
      const mockReq = [];
      let location;
      before(() => {
        location = {
          pathname: '',
          search: '',
        };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });

      it('should not call any function', () => {
        const {
          bib,
          search,
          hold,
        } = mockRouteMethods;
        expect(axiosSpy.getCalls()).to.have.lengthOf(0);
        expect(bib.getCalls()).to.have.lengthOf(0);
        expect(search.getCalls()).to.have.lengthOf(0);
        expect(hold.getCalls()).to.have.lengthOf(0);
        Object.keys(actionsSpy).forEach((key) => {
          expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
        });
      });
    });
    describe('bib path', () => {
      const bibCalls = [];
      let bibResponse;
      let mockReq;
      let location;
      let mockRes;
      before(() => {
        bibResponse = [];
        mockRouteMethods = {
          bib: (req, res) => {
            bibCalls.push(req);
            return res.json(bibResponse);
          },
        };
        location = {
          pathname: '/research/collections/shared-collection-catalog/bib/b000000',
          search: '',
        };
        mockReq = { query: {} };
        mockRes = {};
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods, mockRes);
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call bibSearch with request as argument', () => {
        expect(bibCalls.length).to.equal(1);
        expect(bibCalls[0]).to.equal(mockReq);
        expect(routeMethods.bib).to.equal(Bib.bibSearch);
      });
      xit('should call the updateBibPage action', () => {
        expect(actionsSpy.updateBibPage.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updateBib.getCalls()[0].args).to.have.lengthOf(1);
        expect(actionsSpy.updateBib.getCalls()[0].args[0]).to.equal(bibResponse);
      });
      xit('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      xit('should not update any other field in the Store', () => {
        Object.keys(actionsSpy).forEach((key) => {
          if (key !== 'updateBib' && key !== 'updateLoadingStatus') {
            expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
          }
        });
      });
    });
    describe('search path', () => {
      const searchCalls = [];
      let searchResponse;
      let location;
      let mockReq;
      before(() => {
        mockReq = [];
        searchResponse = {
          searchResults: [],
          filters: {
            itemListElement: [
              {
                '@type': 'nypl:Aggregation',
                '@id': 'res:language',
                id: 'language',
                field: 'language',
                values: [{ value: 'lang:lat', count: 12, label: 'Latin' }],
              },
            ],
          },
        };
        mockRouteMethods = {
          search: (req, res) => {
            searchCalls.push(req);
            return res.json(searchResponse);
          },
        };
        location = {
          pathname: '/research/collections/shared-collection-catalog/search?q=dogs&filters[language][0]=lang%3Alat&sort=undefined&sort_direction=undefined&page=1',
          query: {
            0: 'q',
            1: 'dogs',
            page: [],
            q: [],
            sort_direction: 'sort_direction',
            sort: 'sort',
            'filters[language][0]': 'lang%3Alat',
          },
          search: '',
        };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call search with req as argument', () => {
        expect(searchCalls.length).to.equal(1);
        expect(searchCalls[0]).to.equal(mockReq);
        expect(routeMethods.search).to.equal(Search.search);
      });
      xit('should call updateSearchResultsPage action', () => {
        expect(actionsSpy.updateSearchResultsPage.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updateSearchResultsPage.getCalls()[0].args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updateSearchResultsPage
            .getCalls()[0].args[0],
        ).to.equal(searchResponse.searchResults);
      });
      xit('should update page in the Store', () => {
        expect(actionsSpy.updatePage.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updatePage.getCalls()[0].args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updatePage
            .getCalls()[0].args[0],
        ).to.equal(location.query.page);
      });
      xit('should update search keywords in the Store', () => {
        expect(actionsSpy.updateSearchKeywords.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updateSearchKeywords.getCalls()[0].args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updateSearchKeywords
            .getCalls()[0].args[0],
        ).to.equal(location.query.q);
      });
      xit('should update filters in the Store', () => {
        expect(actionsSpy.updateFilters.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updateFilters.getCalls()[0].args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updateFilters
            .getCalls()[0].args[0],
        ).to.equal(searchResponse.filters);
      });
      xit('should update selected filters in the Store', () => {
        expect(actionsSpy.updateSelectedFilters.calledOnce).to.equal(true);
        expect(JSON.stringify(actionsSpy.updateSelectedFilters.firstCall.args[0])).to.equal(JSON.stringify({ language: [{ value: 'lang:lat', label: 'Latin' }] }));
      });
      xit('should update sort by', () => {
        expect(actionsSpy.updateSortBy.calledOnce).to.equal(true);
        expect(actionsSpy.updateSortBy.firstCall.args).to.have.lengthOf(1);
        expect(actionsSpy.updateSortBy.firstCall.args[0]).to.equal('sort_sort_direction');
      });
      xit('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      xit('should not update any other fields in the Store', () => {
        Object.keys(actionsSpy).forEach((key) => {
          if (![
            'updateLoadingStatus',
            'updatePage',
            'updateSearchKeywords',
            'updateFilters',
            'updateSearchResults',
            'updateSelectedFilters',
            'updateSortBy',
          ]
            .includes(key)) {
            expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
          }
        });
      });
    });
    describe('holdRequest path', () => {
      const holdRequestCalls = [];
      let holdRequestResponse;
      let location;
      let mockReq;
      before(() => {
        mockReq = { params: {} };
        holdRequestResponse = {
          bib: [],
          deliveryLocations: [],
          isEddRequestable: [],
        };
        mockRouteMethods = {
          holdRequest: (req, res) => {
            holdRequestCalls.push(req);
            return res.json(holdRequestResponse);
          },
        };
        location = {
          pathname: '/research/collections/shared-collection-catalog/hold/request/',
        };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call newHoldRequest with req as argument', () => {
        expect(holdRequestCalls.length).to.equal(1);
        expect(holdRequestCalls[0]).to.equal(mockReq);
        expect(routeMethods.holdRequest).to.equal(Hold.newHoldRequest);
      });
      xit('should update bib in the Store', () => {
        expect(actionsSpy.updateBib.calledOnce).to.equal(true);
        expect(actionsSpy.updateBib.firstCall.args).to.have.lengthOf(1);
        expect(actionsSpy.updateBib.firstCall.args[0]).to.equal(holdRequestResponse.bib);
      });
      xit('should update delivery locations in the Store', () => {
        expect(actionsSpy.updateDeliveryLocations.calledOnce).to.equal(true);
        expect(actionsSpy.updateDeliveryLocations.firstCall.args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updateDeliveryLocations
            .firstCall.args[0],
        ).to.equal(holdRequestResponse.deliveryLocations);
      });
      xit('should update isEddRequestable in the Store', () => {
        expect(actionsSpy.updateIsEddRequestable.calledOnce).to.equal(true);
        expect(actionsSpy.updateIsEddRequestable.firstCall.args).to.have.lengthOf(1);
        expect(
          actionsSpy
            .updateIsEddRequestable
            .firstCall.args[0],
        ).to.equal(holdRequestResponse.isEddRequestable);
      });
      xit('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      xit('should not update any other fields', () => {
        Object.keys(actionsSpy).forEach((key) => {
          if (![
            'updateLoadingStatus',
            'updateIsEddRequestable',
            'updateBib',
            'updateDeliveryLocations',
          ]
            .includes(key)) {
            expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
          }
        });
      });
    });
  });
  describe('client side call', () => {
    let mock;
    let consoleSpy;
    let dispatchStub;
    before(() => {
      mock = new MockAdapter(axios);
      consoleSpy = sandbox.spy(console, 'error');
      dispatchStub = sinon.stub(store, 'dispatch');
    });
    afterEach(() => {
      mock.reset();
      consoleSpy.reset();
      dispatchStub.reset();
    });
    describe('non-matching path', () => {
      let location;
      before(() => {
        location = {
          pathname: '',
          search: '',
        };
        dataLoaderUtil.loadDataForRoutes(location);
      });
      it('should not call any function', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(0);
        Object.keys(actionsSpy).forEach((key) => {
          const spy = actionsSpy[key];
          expect(spy.getCalls()).to.have.lengthOf(0);
        });
      });
    });
    describe('bib path', () => {
      describe('successful call', () => {
        let bibResponse;
        let location;
        before(() => {
          bibResponse = [];
          mock
            .onGet(/.*/)
            .reply(200, bibResponse);
          location = {
            pathname: '/research/collections/shared-collection-catalog/bib/b000000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        it('should make api call to /api/bib with correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api/bib?bibId=b000000');
        });
        it('should call dispatch', () => {
          console.log(dispatchStub);
          expect(dispatchStub.calledOnce).to.equal(true);
          expect(actionsSpy.updateBibPage.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateBibPage.firstCall.args[0]).to.equal(bibResponse);
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates to the Store', () => {
          expect(actionsSpy.updateLoadingStatus.calledTwice).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (![
              'updateLoadingStatus',
              'updateBib',
            ]
              .includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
      describe('unsuccessful call', () => {
        let bibResponse;
        let location;
        before(() => {
          bibResponse = [];
          mock
            .onGet(/.*/)
            .reply(500, bibResponse);
          location = {
            pathname: '/research/collections/shared-collection-catalog/bib/b000000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        it('should make api call to /api/bib with correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api/bib?bibId=b000000');
        });
        it('should log an error', () => {
          expect(consoleSpy.calledOnce).to.equal(true);
          expect(consoleSpy.firstCall.args).to.have.lengthOf(2);
          expect(consoleSpy.firstCall.args[0]).to.equal('Error attempting to make an ajax request to fetch a bib record from ResultsList');
          expect(typeof consoleSpy.firstCall.args[1]).to.equal('object');
          expect(!!consoleSpy.firstCall.args[1].message).to.equal(true);
          expect(consoleSpy.firstCall.args[1].message).to.equal('Request failed with status code 500');
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates', () => {
          expect(actionsSpy.updateLoadingStatus.calledTwice).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (!['updateLoadingStatus'].includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
    });
    describe('search path', () => {
      describe('successful call', () => {
        let searchResponse;
        let location;
        before(() => {
          searchResponse = {
            searchResults: [],
            filters: {
              itemListElement: [
                {
                  '@type': 'nypl:Aggregation',
                  '@id': 'res:language',
                  id: 'language',
                  field: 'language',
                  values: [{ value: 'lang:lat', count: 12, label: 'Latin' }],
                },
              ],
            },
          };
          mock
            .onGet(/.*/)
            .reply(200, searchResponse);
          location = {
            pathname: '/research/collections/shared-collection-catalog/search?q=dogs&filters[language][0]=lang%3Alat&sort=undefined&sort_direction=undefined&page=1',
            query: {
              0: 'q',
              1: 'dogs',
              page: [],
              q: [],
              sort_direction: 'sort_direction',
              sort: 'sort',
              'filters[language][0]': 'lang%3Alat',
            },
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        it('should make api call to /api with the correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api?q=dogs&filters[language][0]=lang%3Alat&sort=undefined&sort_direction=undefined&page=1');
        });
        it('should update searchResults in the Store', () => {
          expect(actionsSpy.updateSearchResults.getCalls()).to.have.lengthOf(1);
          expect(actionsSpy.updateSearchResults.getCalls()[0].args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updateSearchResults
              .getCalls()[0].args[0],
          ).to.equal(searchResponse.searchResults);
        });
        it('should update page in the Store', () => {
          expect(actionsSpy.updatePage.getCalls()).to.have.lengthOf(1);
          expect(actionsSpy.updatePage.getCalls()[0].args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updatePage
              .getCalls()[0].args[0],
          ).to.equal(location.query.page);
        });
        it('should update search keywords in the Store', () => {
          expect(actionsSpy.updateSearchKeywords.getCalls()).to.have.lengthOf(1);
          expect(actionsSpy.updateSearchKeywords.getCalls()[0].args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updateSearchKeywords
              .getCalls()[0].args[0],
          ).to.equal(location.query.q);
        });
        it('should update filters in the Store', () => {
          expect(actionsSpy.updateFilters.getCalls()).to.have.lengthOf(1);
          expect(actionsSpy.updateFilters.getCalls()[0].args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updateFilters
              .getCalls()[0].args[0],
          ).to.equal(searchResponse.filters);
        });
        it('should update selected filters in the Store', () => {
          expect(actionsSpy.updateSelectedFilters.calledOnce).to.equal(true);
          expect(JSON.stringify(actionsSpy.updateSelectedFilters.firstCall.args[0])).to.equal(JSON.stringify({ language: [{ value: 'lang:lat', label: 'Latin' }] }));
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates to the Store', () => {
          expect(actionsSpy.updateLoadingStatus.calledTwice).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (![
              'updateLoadingStatus',
              'updatePage',
              'updateSearchKeywords',
              'updateFilters',
              'updateSearchResults',
              'updateSelectedFilters',
              'updateSortBy',
            ]
              .includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
      describe('unsuccessful call', () => {
        let location;
        before(() => {
          mock
            .onGet(/.*/)
            .reply(500, {});
          location = {
            pathname: '/research/collections/shared-collection-catalog/search?q=dogs&filters[language][0]=lang%3Alat&sort=undefined&sort_direction=undefined&page=1',
            query: {
              0: 'q',
              1: 'dogs',
              page: [],
              q: [],
              sort_direction: 'sort_direction',
              sort: 'sort',
              'filters[language][0]': 'lang%3Alat',
            },
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        it('should make api call to /api with correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api?q=dogs&filters[language][0]=lang%3Alat&sort=undefined&sort_direction=undefined&page=1');
        });
        it('should log an error', () => {
          expect(consoleSpy.calledOnce).to.equal(true);
          expect(consoleSpy.firstCall.args).to.have.lengthOf(2);
          expect(consoleSpy.firstCall.args[0]).to.equal('Error attempting to make an ajax request to search');
          expect(typeof consoleSpy.firstCall.args[1]).to.equal('object');
          expect(!!consoleSpy.firstCall.args[1].message).to.equal(true);
          expect(consoleSpy.firstCall.args[1].message).to.equal('Request failed with status code 500');
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates', () => {
          expect(actionsSpy.updateLoadingStatus.calledTwice).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (![
              'updateLoadingStatus',
            ]
              .includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
    });
    describe('holdRequest path', () => {
      describe('successful call', () => {
        let holdRequestResponse;
        let location;
        before(() => {
          global.savedWindow = global.window;
          global.window = { location: { href: ' fakefakefake' } };
          holdRequestResponse = {
            bib: [],
            deliveryLocations: [],
            isEddRequestable: [],
          };
          mock
            .onGet(/.*/)
            .reply(200, holdRequestResponse);
          location = {
            pathname: '/research/collections/shared-collection-catalog/hold/request/b1000-i1000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          global.window = global.savedWindow;
        });
        it('should make api call to /api/hold/request with the correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api/hold/request/b1000-i1000');
        });
        it('should update bib in the Store', () => {
          expect(actionsSpy.updateBib.calledOnce).to.equal(true);
          expect(actionsSpy.updateBib.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateBib.firstCall.args[0]).to.equal(holdRequestResponse.bib);
        });
        it('should update delivery locations in the Store', () => {
          expect(actionsSpy.updateDeliveryLocations.calledOnce).to.equal(true);
          expect(actionsSpy.updateDeliveryLocations.firstCall.args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updateDeliveryLocations
              .firstCall.args[0],
          ).to.equal(holdRequestResponse.deliveryLocations);
        });
        it('should update isEddRequestable in the Store', () => {
          expect(actionsSpy.updateIsEddRequestable.calledOnce).to.equal(true);
          expect(actionsSpy.updateIsEddRequestable.firstCall.args).to.have.lengthOf(1);
          expect(
            actionsSpy
              .updateIsEddRequestable
              .firstCall.args[0],
          ).to.equal(holdRequestResponse.isEddRequestable);
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates', () => {
          expect(actionsSpy.updateLoadingStatus.calledTwice).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (![
              'updateLoadingStatus',
              'updateDeliveryLocations',
              'updateIsEddRequestable',
              'updateBib',
            ]
              .includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
      describe('unsuccessful call', () => {
        let holdRequestResponse;
        let location;
        before(() => {
          global.savedWindow = global.window;
          global.window = { location: { href: ' fakefakefake' } };
          holdRequestResponse = {
            bib: [],
            deliveryLocations: [],
            isEddRequestable: [],
          };
          mock
            .onGet(/.*/)
            .reply(500, holdRequestResponse);
          location = {
            pathname: '/research/collections/shared-collection-catalog/hold/request/b1000-i1000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          global.window = global.savedWindow;
        });
        it('should make api call to /api/hold/request with the correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api/hold/request/b1000-i1000');
        });
        it('should log an error', () => {
          expect(consoleSpy.calledOnce).to.equal(true);
          expect(consoleSpy.firstCall.args).to.have.lengthOf(2);
          expect(consoleSpy.firstCall.args[0]).to.equal('Error attempting to make ajax request for hold request');
          expect(typeof consoleSpy.firstCall.args[1]).to.equal('object');
          expect(!!consoleSpy.firstCall.args[1].message).to.equal(true);
          expect(consoleSpy.firstCall.args[1].message).to.equal('Request failed with status code 500');
        });
        it('should turn on LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.firstCall.args[0]).to.equal(true);
        });
        it('should turn off LoadingLayer', () => {
          expect(actionsSpy.updateLoadingStatus.secondCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateLoadingStatus.secondCall.args[0]).to.equal(false);
        });
        it('should make no other updates', () => {
          expect(actionsSpy.updateLoadingStatus.called).to.equal(true);
          Object.keys(actionsSpy).forEach((key) => {
            if (![
              'updateLoadingStatus',
            ]
              .includes(key)) {
              expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
            }
          });
        });
      });
    });
  });
});
