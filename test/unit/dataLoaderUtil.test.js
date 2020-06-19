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

describe.only('dataLoaderUtil', () => {
  describe('server side call', () => {
    describe('non-matching path', () => {
      let axiosSpy;
      let actionsSpy;
      let sandbox;
      let mockRouteMethods;
      before(() => {
        sandbox = sinon.createSandbox();
        axiosSpy = sandbox.spy(axios);
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
        const req = true;
        dataLoaderUtil.loadDataForRoutes(location, req, mockRouteMethods);
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
      let bibCallCount = 0;
      let bibResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
      before(() => {
        bibResponse = [];
        mockRouteMethods = {
          bib: (req, res) => {
            bibCallCount += 1;
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
        const req = true;
        dataLoaderUtil.loadDataForRoutes(location, req, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call bibSearch', () => {
        expect(bibCallCount).to.equal(1);
        expect(bibCallCount).to.equal(1);
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
      let searchCallCount = 0;
      let searchResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
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
        mockRouteMethods = {
          search: (req, res) => {
            searchCallCount += 1;
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

        const req = true;
        dataLoaderUtil.loadDataForRoutes(location, req, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call searchAjax', () => {
        expect(searchCallCount).to.equal(1);
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
      let holdRequestCallCount = 0;
      let holdRequestResponse;
      let actionsSpy;
      let sandbox;
      let axiosSpy;
      let location;
      before(() => {
        holdRequestResponse = {
          bib: [],
          deliveryLocations: [],
          isEddRequestable: [],
        };
        mockRouteMethods = {
          holdRequest: (req, res) => {
            holdRequestCallCount += 1;
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

        const req = true;
        dataLoaderUtil.loadDataForRoutes(location, req, mockRouteMethods);
      });
      after(() => {
        sandbox.restore();
      });
      it('should not call axios', () => {
        expect(axiosSpy.notCalled).to.equal(true);
      });
      it('should call newHoldRequest', () => {
        expect(holdRequestCallCount).to.equal(1);
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
        axiosSpy = sandbox.spy(axios);
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
        const req = true;
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
        it('should make api call to /api/bib', () => {

        });
        it('should update bibs in the Store', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
      describe('unsuccessful call', () => {
        it('should make api call to /api/bib', () => {

        });
        it('should log an error', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
    });
    describe('search path', () => {
      describe('successful call', () => {
        it('should make api call to /api', () => {

        });
        it('should update searchResults in the Store', () => {

        });
        it('should update page in the Store', () => {

        });
        it('should update search keywords in the Store', () => {

        });
        it('should update filters in the Store', () => {

        });
        it('should update selected filters in the Store', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
      describe('unsuccessful call', () => {
        it('should make api call to /api', () => {

        });
        it('should log an error', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
    });
    describe('holdRequest path', () => {
      describe('successful call', () => {
        it('should make api call to /api/hold/request', () => {

        });
        it('should update bib in the Store', () => {

        });
        it('should update delivery locations in the Store', () => {

        });
        it('should update isEddRequestable in the Store', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
      describe('unsuccessful call', () => {
        it('should make api call to /api/hold/request', () => {

        });
        it('should log an error', () => {

        });
        it('should turn on LoadingLayer', () => {

        });
        it('should turn off LoadingLayer', () => {

        });
      });
    });
  });
});
