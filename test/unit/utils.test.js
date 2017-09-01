/* eslint-env mocha */
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import { useQueries } from 'history';

const mock = new MockAdapter(axios);

import {
  ajaxCall,
  getDefaultFacets,
  createAppHistory,
  destructureFilters,
  getSortQuery,
  getFacetParams,
} from '../../src/app/utils/utils.js';

/**
 * ajaxCall()
 */
describe('ajaxCall', () => {
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

    it('should invoke the callback function', () => {
      const cbSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', cbSpy);

      setTimeout(() => {
        expect(cbSpy.callCount).to.equal(1);
      }, 0);

      cbSpy.reset();
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

    it('should invoke the default error callback function', () => {
      const cbSpy = sinon.spy();
      // const consoleError = sinon.spy(console, 'error');
      ajaxCall('/api?q=locofocos', cbSpy);

      setTimeout(() => {
        expect(cbSpy.callCount).to.equal(0);
        // expect(consoleError.callCount).to.equal(1);
      }, 0);

      cbSpy.reset();
      // consoleError.reset();
    });

    it('should invoke the error callback function', () => {
      const cbSpy = sinon.spy();
      const cbErrorSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', (cbSpy), cbErrorSpy)
        .then(() => {
          expect(cbSpy.callCount).to.equal(0);
          expect(cbErrorSpy.callCount).to.equal(1);
        });

      cbSpy.reset();
      cbErrorSpy.reset();
    });
  });
});

/**
 * getDefaultFacets
 */
describe('getDefaultFacets', () => {
  it('should return an object with a list of facets', () => {
    const defaultFacets = getDefaultFacets();

    expect(defaultFacets).to.eql({
      owner: [],
      contributorLiteral: [],
      materialType: [],
      issuance: [],
      publisher: [],
      language: [],
      mediaType: [],
      subjectLiteral: [],
      creatorLiteral: [],
      dateAfter: {},
      dateBefore: {},
    });
  });
});

/**
 * createAppHistory
 */
describe('createAppHistory', () => {
  // Don't think this is working too well.
  // TODO: find a better way to test this function:
  it('should create a server-side history', () => {
    const useQueriesSpy = sinon.spy(useQueries);

    createAppHistory();
    setTimeout(() => {
      expect(useQueriesSpy.callCount).to.equal(1);
    }, 0);

    useQueriesSpy.reset();
  });
});

/**
 * destructureFilters
 */
describe('destructureFilters', () => {
  describe('Default call', () => {
    it('should return an empty object', () => {
      const filters = destructureFilters();
      expect(filters).to.eql({});
    });
  });

  describe('No facets from the API', () => {
    // it('should return an empty object', () => {
    //   const filters = destructureFilters();
    //   expect(filters).to.eql({});
    // });
  });
});

/**
 * getSortQuery()
 */
describe('getSortQuery', () => {
  describe('No input', () => {
    it('should return an empty string', () => {
      expect(getSortQuery()).to.equal('');
    });
  });

  describe('Sort by Relevance', () => {
    it('should return an empty string if sorting by "revelance"', () => {
      const sortBy = 'relevance';
      expect(getSortQuery(sortBy)).to.equal('');
    });
  });

  describe('Return URL query params', () => {
    it('should sort by title asc', () => {
      const sortBy = 'title_asc';
      expect(getSortQuery(sortBy)).to.equal('&sort=title&sort_direction=asc');
    });

    it('should sort by title desc', () => {
      const sortBy = 'title_desc';
      expect(getSortQuery(sortBy)).to.equal('&sort=title&sort_direction=desc');
    });

    it('should sort by date asc', () => {
      const sortBy = 'date_asc';
      expect(getSortQuery(sortBy)).to.equal('&sort=date&sort_direction=asc');
    });

    it('should sort by date desc', () => {
      const sortBy = 'date_desc';
      expect(getSortQuery(sortBy)).to.equal('&sort=date&sort_direction=desc');
    });
  });
});

/**
 * getFacetParams()
 */
describe('getFacetParams', () => {
  describe('No input', () => {
    it('should return an empty string', () => {
      expect(getFacetParams()).to.equal('');
    });

    it('should return an empty string with no selected facets', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: '', value: '' },
        location: { id: '', value: '' },
        materialType: { id: '', value: '' },
        mediaType: { id: '', value: '' },
        owner: { id: '', value: '' },
        publisher: { id: '', value: '' },
        subject: { id: '', value: '' },
      };
      expect(getFacetParams(facets)).to.equal('');
    });
  });

  describe('Only facets object input', () => {
    it('should return a key:value string from two facets', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: '', value: '' },
        location: { id: '', value: '' },
        materialType: { id: 'resourcetypes:aud', value: 'Audio' },
        mediaType: { id: '', value: '' },
        owner: { id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' },
        publisher: { id: '', value: '' },
        subject: { id: '', value: '' },
      };
      expect(getFacetParams(facets))
        .to.equal(' materialType:"resourcetypes:aud" owner:"orgs:1000"');
    });

    it('should return a key:value string from three facets', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: 'lang:ger', value: 'German' },
        location: { id: '', value: '' },
        materialType: { id: '', value: '' },
        mediaType: { id: '', value: '' },
        owner: { id: '', value: '' },
        publisher: { id: '[Berlin] : Walter de Gruyter', value: '[Berlin] : Walter de Gruyter' },
        subject: { id: 'Electronic journals.', value: 'Electronic journals.' },
      };
      expect(getFacetParams(facets))
        .to.equal(' language:"lang:ger" publisher:"[Berlin] : Walter de Gruyter" ' +
          'subject:"Electronic journals."');
    });
  });

  // When a specific field is passed, it is skipped over.
  // This functionality is used when removing a facet from the interface.
  describe('With a field to skip over', () => {
    it('should return a key:value string with two facets, not selecting language', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: 'lang:ger', value: 'German' },
        location: { id: '', value: '' },
        materialType: { id: '', value: '' },
        mediaType: { id: '', value: '' },
        owner: { id: '', value: '' },
        publisher: { id: '[Berlin] : Walter de Gruyter', value: '[Berlin] : Walter de Gruyter' },
        subject: { id: 'Electronic journals.', value: 'Electronic journals.' },
      };
      const field = 'language';

      expect(getFacetParams(facets, field))
        .to.equal(' publisher:"[Berlin] : Walter de Gruyter" subject:"Electronic journals."');
    });

    it('should return a key:value string with one facet, not selecting materialType', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: '', value: '' },
        location: { id: '', value: '' },
        materialType: { id: 'resourcetypes:aud', value: 'Audio' },
        mediaType: { id: '', value: '' },
        owner: { id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' },
        publisher: { id: '', value: '' },
        subject: { id: '', value: '' },
      };
      const field = 'materialType';

      expect(getFacetParams(facets, field))
        .to.equal(' owner:"orgs:1000"');
    });
  });

  // Used in the FacetSidebar component when selecting a new facet
  describe('With a value as the third argument', () => {
    it('should return a key:value string the new value selected', () => {
      const facets = {
        date: { id: '', value: '' },
        issuance: { id: '', value: '' },
        language: { id: '', value: '' },
        location: { id: '', value: '' },
        materialType: { id: '', value: '' },
        mediaType: { id: '', value: '' },
        owner: { id: '', value: '' },
        publisher: { id: '', value: '' },
        subject: { id: '', value: '' },
      };
      const field = 'publisher';
      const value = '[Berlin] : Walter de Gruyter';

      expect(getFacetParams(facets, field, value))
        .to.equal(' publisher:"[Berlin] : Walter de Gruyter"');
    });

    it('should return a key:value string the new value selected, two already selected', () => {
      const facets = {
        date: { id: '1990', value: '1990' },
        issuance: { id: '', value: '' },
        language: { id: '', value: '' },
        location: { id: 'loc:sc', value: 'Schomburg Center' },
        materialType: { id: '', value: '' },
        mediaType: { id: '', value: '' },
        owner: { id: '', value: '' },
        publisher: { id: '', value: '' },
        subject: { id: '', value: '' },
      };
      const field = 'language';
      const value = 'lang:fre';

      expect(getFacetParams(facets, field, value))
        .to.equal(' date:"1990" language:"lang:fre" location:"loc:sc"');
    });
  });
});
