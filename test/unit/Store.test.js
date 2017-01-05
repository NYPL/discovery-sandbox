/* eslint-env mocha */
import { expect } from 'chai';

import sinon from 'sinon';
import alt from '../../src/app/alt.js';
import actions from '../../src/app/actions/Actions.js';
import store from '../../src/app/stores/Store.js';


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

describe('Store', () => {
  before(() => {
  });

  after(() => {
  });

  it('should pass data to updateSearchResults Action', () => {
    const oldSearchResults = store.getState().searchResults;
    const action = actions.UPDATE_SEARCH_RESULTS;
    const data = searchResult;

    alt.dispatcher.dispatch({ action, data });
    const newSearchResults = store.getState().searchResults;

    expect(oldSearchResults).to.eql({});
    expect(newSearchResults).to.eql(searchResult);
  });
});
