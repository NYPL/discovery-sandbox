/* eslint-env mocha */
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import sinon from 'sinon';
import { expect } from 'chai';
import dataLoaderUtil from '@dataLoaderUtil';
import Actions from '@Actions';
import Bib from '@Bib';
import Search from '../../src/server/ApiRoutes/Search';
import Hold from '@Hold';
import routeMethods from '../../src/server/ApiRoutes/RouteMethods';

describe('dataLoaderUtil', () => {
  describe('server side call', () => {
    describe('non-matching path', () => {
      let axiosSpy;
      let actionsSpy;
      let sandbox;
      let mockRouteMethods;
      let mockReq = [];
      before(() => {
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        mockRouteMethods = {
          bib: sandbox.spy(),
          search: sandbox.spy(),
          hold: sandbox.spy(),
        };
        actionsSpy = [];
        Object.keys(Actions).forEach((key) => {
          if (typeof Actions[key] === 'function') {
            actionsSpy.push(sandbox.spy(Actions, key));
          }
        });
        const location = {
          pathname: '',
          search: '',
        };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
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
        actionsSpy.forEach((spy) => {
          expect(spy.getCalls()).to.have.lengthOf(0);
        });
      });
    });
    describe('bib path', () => {
      let mockRouteMethods;
      let bibCalls = [];
      let bibResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
      let mockReq;
      before(() => {
        bibResponse = [];
        mockRouteMethods = {
          bib: (req, res) => {
            bibCalls.push(req);
            return res.json(bibResponse);
          },
        };
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        actionsSpy = {};
        Object.keys(Actions).forEach((key) => {
          if (typeof Actions[key] === 'function') {
            actionsSpy[key] = sandbox.spy(Actions, key);
          }
        });
        const location = {
          pathname: '/research/collections/shared-collection-catalog/bib/b000000',
          search: '',
        };
        mockReq = { query: {} };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call bibSearch with request as argument', () => {
        expect(bibCalls.length).to.equal(1);
        expect(bibCalls[0]).to.equal(mockReq);
        expect(routeMethods.bib).to.equal(Bib.bibSearch);
      });
      it('should update bibs in the Store', () => {
        expect(actionsSpy.updateBib.getCalls()).to.have.lengthOf(1);
        expect(actionsSpy.updateBib.getCalls()[0].args).to.have.lengthOf(1);
        expect(actionsSpy.updateBib.getCalls()[0].args[0]).to.equal(bibResponse);
      });
      it('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      it('should not update any other field in the Store', () => {
        Object.keys(actionsSpy).forEach((key) => {
          if (key !== 'updateBib' && key !== 'updateLoadingStatus') {
            expect(actionsSpy[key].getCalls()).to.have.lengthOf(0);
          }
        });
      });
    });
    describe('search path', () => {
      let mockRouteMethods;
      let searchCalls = [];
      let searchResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
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
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        actionsSpy = {};
        Object.keys(Actions).forEach((key) => {
          if (typeof Actions[key] === 'function') {
            actionsSpy[key] = sandbox.spy(Actions, key);
          }
        });
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
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call searchAjax with req as argument', () => {
        expect(searchCalls.length).to.equal(1);
        expect(searchCalls[0]).to.equal(mockReq);
        expect(routeMethods.search).to.equal(Search.searchAjax);
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
      it('should update sort by', () => {
        expect(actionsSpy.updateSortBy.calledOnce).to.equal(true);
        expect(actionsSpy.updateSortBy.firstCall.args).to.have.lengthOf(1);
        expect(actionsSpy.updateSortBy.firstCall.args[0]).to.equal('sort_sort_direction');
      });
      it('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      it('should not update any other fields in the Store', () => {
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
      let mockRouteMethods;
      const holdRequestCalls = [];
      let holdRequestResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
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
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        actionsSpy = {};
        Object.keys(Actions).forEach((key) => {
          if (typeof Actions[key] === 'function') {
            actionsSpy[key] = sandbox.spy(Actions, key);
          }
        });
        location = {
          pathname: '/research/collections/shared-collection-catalog/hold/request/',
        };
        dataLoaderUtil.loadDataForRoutes(location, mockReq, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call newHoldRequest with req as argument', () => {
        expect(holdRequestCalls.length).to.equal(1);
        expect(holdRequestCalls[0]).to.equal(mockReq);
        expect(routeMethods.holdRequest).to.equal(Hold.newHoldRequest);
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
      it('should not call updateLoadingStatus or the last call should be false', () => {
        expect(
          actionsSpy.updateLoadingStatus.notCalled
          || (
            actionsSpy.updateLoadingStatus.lastCall.args.length === 1 &&
            actionsSpy.updateLoadingStatus.lastCall.args[0] === false
          ),
        ).to.equal(true);
      });
      it('should not update any other fields', () => {
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
    describe('non-matching path', () => {
      let axiosSpy;
      let actionsSpy;
      let sandbox;
      before(() => {
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios, 'get');
        actionsSpy = [];
        Object.keys(Actions).forEach((key) => {
          if (typeof Actions[key] === 'function') {
            actionsSpy.push(sandbox.spy(Actions, key));
          }
        });
        const location = {
          pathname: '',
          search: '',
        };
        dataLoaderUtil.loadDataForRoutes(location);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call any function', () => {
        expect(axiosSpy.getCalls()).to.have.lengthOf(0);
        actionsSpy.forEach((spy) => {
          expect(spy.getCalls()).to.have.lengthOf(0);
        });
      });
    });
    describe('bib path', () => {
      describe('successful call', () => {
        let axiosSpy;
        let mock;
        let bibResponse;
        let actionsSpy;
        let sandbox;
        before(() => {
          bibResponse = [];
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(200, bibResponse);
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          actionsSpy = {};
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
          const location = {
            pathname: '/research/collections/shared-collection-catalog/bib/b000000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          sandbox.restore();
        });
        it('should make api call to /api/bib with correct parameters', () => {
          expect(axiosSpy.calledOnce).to.equal(true);
          expect(axiosSpy.firstCall.args).to.have.lengthOf(1);
          expect(axiosSpy.firstCall.args[0]).to.equal('/research/collections/shared-collection-catalog/api/bib?bibId=b000000');
        });
        it('should update bibs in the Store', () => {
          expect(actionsSpy.updateBib.calledOnce).to.equal(true);
          expect(actionsSpy.updateBib.firstCall.args).to.have.lengthOf(1);
          expect(actionsSpy.updateBib.firstCall.args[0]).to.equal(bibResponse);
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
        let axiosSpy;
        let mock;
        let bibResponse;
        let actionsSpy;
        let sandbox;
        let consoleSpy;
        before(() => {
          bibResponse = [];
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(500, bibResponse);
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          actionsSpy = {};
          consoleSpy = sandbox.spy(console, 'error');
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
          const location = {
            pathname: '/research/collections/shared-collection-catalog/bib/b000000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          sandbox.restore();
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
    describe('search path', () => {
      describe('successful call', () => {
        let axiosSpy;
        let mock;
        let searchResponse;
        let actionsSpy;
        let sandbox;
        let consoleSpy;
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
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(200, searchResponse);
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          actionsSpy = {};
          consoleSpy = sandbox.spy(console, 'error');
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
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
        after(() => {
          sandbox.restore();
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
        let axiosSpy;
        let mock;
        let actionsSpy;
        let sandbox;
        let consoleSpy;
        let location;
        before(() => {
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(500, {});
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          actionsSpy = {};
          consoleSpy = sandbox.spy(console, 'error');
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
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
        after(() => {
          sandbox.restore();
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
        let axiosSpy;
        let mock;
        let holdRequestResponse;
        let actionsSpy;
        let sandbox;
        let location;
        before(() => {
          holdRequestResponse = {
            bib: [],
            deliveryLocations: [],
            isEddRequestable: [],
          };
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(200, holdRequestResponse);
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          actionsSpy = {};
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
          location = {
            pathname: '/research/collections/shared-collection-catalog/hold/request/b1000-i1000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          sandbox.restore();
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
        let axiosSpy;
        let mock;
        let holdRequestResponse;
        let actionsSpy;
        let sandbox;
        let location;
        let consoleSpy;
        before(() => {
          holdRequestResponse = {
            bib: [],
            deliveryLocations: [],
            isEddRequestable: [],
          };
          mock = new MockAdapter(axios);
          mock
            .onGet(/.*/)
            .reply(500, holdRequestResponse);
          sandbox = sinon.createSandbox();
          axiosSpy = sandbox.spy(axios, 'get');
          consoleSpy = sandbox.spy(console, 'error');
          actionsSpy = {};
          Object.keys(Actions).forEach((key) => {
            if (typeof Actions[key] === 'function') {
              actionsSpy[key] = sandbox.spy(Actions, key);
            }
          });
          location = {
            pathname: '/research/collections/shared-collection-catalog/hold/request/b1000-i1000',
            search: '',
          };
          dataLoaderUtil.loadDataForRoutes(location);
        });
        after(() => {
          sandbox.restore();
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
  });
});
