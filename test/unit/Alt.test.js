/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import alt from '../../src/app/alt.js';
import actions from '../../src/app/actions/Actions.js';
import store from '../../src/app/stores/Store.js';

/*
 * getDispatcherArguments
 * Results of Actions are stored in an array so they must be obtained sequentially.
 * @param {object} dispatcherSpy Sinon spy for the Alt dispatcher object.
 * @param {number} num The offset of the action called.
 * @returns {object} object with the name and data of that the Action was called with.
 */
const getDispatcherArguments = (dispatcherSpy, num) => dispatcherSpy.args[num][0];

const searchResult = {
  '@context': 'http://api.data.nypl.org/api/v1/context_all.jsonld',
  '@type': 'itemList',
  itemListElement: [],
  totalResults: 124,
};
const bib = {
  '@id': 'res:b20647806',
  '@type': ['nypl:Item', 'nypl:Resource'],
  contributor: [],
  created: ['2013'],
  items: [],
  // ...
};
const updatedFacets = {
  owner: { id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' },
  date: { id: '', value: '' },
  subject: { id: 'Children\'s art El Salvador.', value: 'Children\'s art El Salvador.' },
  materialType: { id: '', value: '' },
  issuance: { id: '', value: '' },
  publisher: { id: '', value: '' },
  location: { id: '', value: '' },
  language: { id: '', value: '' },
  mediaType: { id: '', value: '' },
};
const selectedFacet = {
  owner: { id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' },
  date: { id: '', value: '' },
  subject: { id: '', value: '' },
  materialType: { id: '', value: '' },
  issuance: { id: '', value: '' },
  publisher: { id: '', value: '' },
  location: { id: '', value: '' },
  language: { id: '', value: '' },
  mediaType: { id: '', value: '' },
};

describe('Alt', () => {
  describe('Actions', () => {
    let dispatcherSpy;

    before(() => {
      dispatcherSpy = sinon.spy(alt.dispatcher, 'dispatch');
    });

    after(() => {
      alt.dispatcher.dispatch.restore();
    });

    it('should pass data to updateSearchResults Action', () => {
      const action = actions.UPDATE_SEARCH_RESULTS;

      // Trigger the action with data.
      actions.updateSearchResults(searchResult);

      // Get the payload passed to the dispatcher.
      // Note, the offset must match the order that the action was called.
      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 0);

      // Test that the correct name of the action was called with the expected data.
      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(searchResult);
    });

    it('should pass data to updateSearchKeywords Action', () => {
      const action = actions.UPDATE_SEARCH_KEYWORDS;

      actions.updateSearchKeywords('locofocos');

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 1);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql('locofocos');
    });

    it('should pass data to updateBib Action', () => {
      const action = actions.UPDATE_BIB;

      actions.updateBib(bib);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 2);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(bib);
    });

    it('should pass data to updateFacets Action', () => {
      const action = actions.UPDATE_FACETS;

      actions.updateFacets(updatedFacets);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 3);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(updatedFacets);
    });

    it('should pass data to updateSelectedFacets Action', () => {
      const action = actions.UPDATE_SELECTED_FACETS;

      actions.updateSelectedFacets(selectedFacet);

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 4);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql(selectedFacet);
    });

    it('should pass data to updatePatronData Action', () => {
      const action = actions.UPDATE_PATRON_DATA;

      actions.updatePatronData('locofocos');

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 5);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql('locofocos');
    });

    it('should pass data to removeFacet Action', () => {
      const action = actions.REMOVE_FACET;

      actions.removeFacet('owner');

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 6);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql('owner');
    });

    it('should pass data to updatePage Action', () => {
      const action = actions.UPDATE_PAGE;

      actions.updatePage('3');

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 7);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql('3');
    });

    it('should pass data to updateSortBy Action', () => {
      const action = actions.UPDATE_SORT_BY;

      actions.updateSortBy('title_asc');

      const dispatcherArgs = getDispatcherArguments(dispatcherSpy, 8);

      expect(dispatcherArgs.action).to.equal(action);
      expect(dispatcherArgs.data).to.eql('title_asc');
    });
  });

  describe('Store', () => {
    it('should pass data to updateSearchResults Action', () => {
      // The "old" data values are actually from the values above
      // since the actions were already invoked.
      const oldSearchResults = store.getState().searchResults;
      const action = actions.UPDATE_SEARCH_RESULTS;
      const data = {};

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSearchResults = store.getState().searchResults;

      // Since the action was already fired in a previous test, and we're using the same
      // instance, these tests are to verify that data updated and not caring so much
      // about what the actual data was.
      expect(oldSearchResults).to.eql(searchResult);
      expect(newSearchResults).to.eql({});
    });

    it('should pass data to updateSearchKeywords Action', () => {
      const oldSearchKeywords = store.getState().searchKeywords;
      const action = actions.UPDATE_SEARCH_KEYWORDS;
      const data = 'war';

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSearchKeywords = store.getState().searchKeywords;

      expect(oldSearchKeywords).to.eql('locofocos');
      expect(newSearchKeywords).to.eql('war');
    });

    it('should pass data to updateBib Action', () => {
      const oldBib = store.getState().bib;
      const action = actions.UPDATE_BIB;
      const data = {};

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newBib = store.getState().bib;

      expect(oldBib).to.eql(bib);
      expect(newBib).to.eql({});
    });

    it('should pass data to updateFacets Action', () => {
      const oldFacets = store.getState().facets;
      const action = actions.UPDATE_FACETS;
      const data = {};

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newFacets = store.getState().facets;

      expect(oldFacets).to.eql(updatedFacets);
      expect(newFacets).to.eql({});
    });

    it('should pass data to updateSelectedFacets Action', () => {
      const oldSelectedFacets = store.getState().selectedFacets;
      const action = actions.UPDATE_SELECTED_FACETS;
      const data = {};

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSelectedFacets = store.getState().selectedFacets;

      expect(oldSelectedFacets).to.eql(selectedFacet);
      expect(newSelectedFacets).to.eql({});
    });

    // This one is a bit weird. Must go back and verify results.
    it('should pass data to removeFacet Action', () => {
      const oldSelectedFacets = store.getState().selectedFacets;
      const action = actions.REMOVE_FACET;
      const data = 'owner';

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSelectedFacets = store.getState().selectedFacets;

      expect(oldSelectedFacets).to.eql({ owner: { id: '', value: '' } });
      expect(newSelectedFacets).to.eql({ owner: { id: '', value: '' } });
    });

    it('should pass data to updatePage Action', () => {
      const oldPage = store.getState().page;
      const action = actions.UPDATE_PAGE;
      const data = '1';

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newPage = store.getState().page;

      expect(oldPage).to.eql('3');
      expect(newPage).to.eql('1');
    });

    it('should pass data to updateSortBy Action', () => {
      const oldSortBy = store.getState().sortBy;
      const action = actions.UPDATE_SORT_BY;
      const data = 'date_asc';

      // Dispatching new data.
      alt.dispatcher.dispatch({ action, data });
      const newSortBy = store.getState().sortBy;

      expect(oldSortBy).to.eql('title_asc');
      expect(newSortBy).to.eql('date_asc');
    });
  });
});
