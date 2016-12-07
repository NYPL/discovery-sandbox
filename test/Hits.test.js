/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import Hits from '../src/app/components/Hits/Hits.jsx';
import Actions from '../src/app/actions/Actions.js';

const facets = {
  single: {
    "owner": { "id" : "orgs:1000","value" : "Stephen A. Schwarzman Building" },
    "date": { "id" : "","value" : "" },
    "subject": { "id" : "","value" : "" },
    "materialType": { "id" : "","value" : "" },
    "issuance": { "id" : "","value" : "" },
    "publisher": { "id" : "","value" : "" },
    "location": { "id" : "","value" : "" },
    "language": { "id" : "","value" : "" },
    "mediaType": { "id" : "","value" : "" },
  },
  two: {
    "owner": { "id" : "orgs:1000","value" : "Stephen A. Schwarzman Building" },
    "date": { "id" : "","value" : "" },
    "subject": { "id" : "Children's art El Salvador.","value" : "Children's art El Salvador." },
    "materialType": { "id" : "","value" : "" },
    "issuance": { "id" : "","value" : "" },
    "publisher": { "id" : "","value" : "" },
    "location": { "id" : "","value" : "" },
    "language": { "id" : "","value" : "" },
    "mediaType": { "id" : "","value" : "" },
  }
};

const searchResults = {
  '@context': 'http://api.data.nypl.org/api/v1/context_all.jsonld',
  '@type': 'itemList',
  itemListElement: [
    {
      '@type': 'searchResult',
      result: {},
    },
    {
      '@type': 'searchResult',
      result: {},
    },
  ],
  totalResults: 2,
};

describe('Hits', () => {
  describe('No results found', () => {
    describe('No search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits />);
      });

      it('should be wrapped in a .results-message class', () => {
        expect(component.find('.results-message')).to.exist;
        expect(component.find('div').first().hasClass('results-message')).to.equal(true);
      });

      it('should output that no results were found', () => {
        expect(component.find('p')).to.exist;
        expect(component.find('p').text()).to.equal('No results found.');
      });
    });

    describe('No result count with search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits query="locofocos" />);
      });

      it('should output that no results were found', () => {
        expect(component.find('p')).to.exist;
        expect(component.find('p').text())
          .to.equal('No results found with keywords "locofocos"[x].');
      });
    });

    describe('No result count with one facet', () => {
      let component;

      before(() => {
        component = shallow(<Hits facets={facets.single} />);
      });

      it('should output that no results were found', () => {
        expect(component.find('p')).to.exist;
        expect(component.find('p').text())
          .to.equal('No results found with owner [Stephen A. Schwarzman Building][x].');
      });
    });
  });

  describe('Locale count', () => {
    let component;

    it('should be wrapped in a .results-message class', () => {
      component = shallow(<Hits hits={40} />);
      expect(component.find('p').text).to.equal('Found 40 results.');
    });

    it('should output that no results were found', () => {
      component = shallow(<Hits hits={4000} />);
      expect(component.find('p').text()).to.equal('Found 4,000 results.');
    });

    it('should output that no results were found', () => {
      component = shallow(<Hits hits={4000000} />);
      expect(component.find('p').text()).to.equal('Found 4,000,000 results.');
    });
  });

  describe('With Facet data:', () => {
    describe('One facet, count number, and search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits query="fire" facets={facets.single} hits={2} />);
      });

      it('should output the search keyword and the selected facet with two results', () => {
        expect(component.find('p').text()).to.equal('Found 2 results with keywords ' +
          '"fire"[x] with owner [Stephen A. Schwarzman Building][x].');
      });
    });

    describe('Two facets, count number, and search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits query="fire" facets={facets.two} hits={2} />);
      });

      it('should output the search keyword and the two selected facets', () => {
        expect(component.find('p').text()).to.equal('Found 2 results with keywords ' +
          '"fire"[x] with owner [Stephen A. Schwarzman Building][x] with subject ' +
          '[Children\'s art El Salvador.][x].');
      });
    });

    describe('Two facets, count number, and no search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits facets={facets.two} hits={2} />);
      });

      it('should output the search keyword and the two selected facets', () => {
        expect(component.find('p').text()).to.equal('Found 2 results with owner [Stephen A. ' +
          'Schwarzman Building][x] with subject [Children\'s art El Salvador.][x].');
      });
    });
  });

  describe('Remove the selected keyword', () => {
    describe('Click on it and return 200 with data', () => {
      const mock = new MockAdapter(axios);
      let component;
      let spyUpdateSearchKeywords;
      let spyUpdateFacets;
      let spyUpdatePage;
      let spyUpdateSearchResults;

      before(() => {
        mock
          .onGet('/api?q=owner:"orgs:1000" ')
          .reply(200, { searchResults });

        component = mount(<Hits query="fire" facets={facets.single} hits={2} />, {
          context: { router: [] },
        });
      });

      after(() => {
        mock.restore();
        spyUpdateSearchKeywords.restore();
      });

      it('should be clicked and Action called', () => {
        spyUpdateSearchKeywords = sinon.spy(Actions, 'updateSearchKeywords');
        spyUpdateFacets = sinon.spy(Actions, 'updateFacets');
        spyUpdatePage = sinon.spy(Actions, 'updatePage');
        spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');

        component.find('.removeKeyword').simulate('click');

        expect(spyUpdateSearchKeywords.calledOnce).to.be.true;
        expect(spyUpdateSearchKeywords.calledWith('')).to.be.true;

        // Need to figure out how to spy on functions called in the `then` promise function.
        // expect(spyUpdateFacets.calledOnce).to.be.true;
        // expect(spyUpdatePage.calledOnce).to.be.true;
        // expect(spyUpdatePage.calledWith('1')).to.be.true;
        // expect(spyUpdatePage.calledOnce).to.be.true;
      });
    });

    // describe('Returning a 404', () => {
    //   const mock = new MockAdapter(axios);
    //   let component;

    //   before(() => {
    //     mock
    //       .onGet('/api?q=owner:"orgs:1000" ')
    //       .reply(404, {});

    //     component = mount(<Hits query="fire" facets={facets.single} hits={2} />, {
    //       context: { router: [] },
    //     });
    //   });

    //   after(() => {
    //     mock.restore();
    //   });

    //   it('should be clicked and Action called', () => {
    //     const spy = sinon.spy();
    //     const consoleSpy = sinon.spy(console, 'log');

    //     component.find('.removeKeyword').simulate('click');
    //     expect(consoleSpy.calledOnce).to.be.true;
    //   });
    // });
  });

  describe('Remove the selected facet', () => {
    describe('Click on it and return 200 with data', () => {
      const mock = new MockAdapter(axios);
      let component;
      let spyRemoveFacet;

      before(() => {
        mock
          .onGet('/api?q=fire ')
          .reply(200, { searchResults });

        component = mount(<Hits query="fire" facets={facets.single} hits={2} />, {
          context: { router: [] },
        });

        spyRemoveFacet = sinon.spy(Actions, 'removeFacet');
      });

      after(() => {
        mock.restore();
        spyRemoveFacet.restore();
      });

      it('should output the search keyword and the selected facet', () => {
        expect(component.find('p').text()).to.equal('Found 2 results with keywords "fire"[x]  ' +
          'with owner [Stephen A. Schwarzman Building][x].');
      });

      it('should be clicked and Action called', () => {
        component.find('.removeFacet').first().simulate('click');

        expect(spyRemoveFacet.calledOnce).to.be.true;
        expect(spyRemoveFacet.calledWith('owner')).to.be.true;
      });
    });
  });
});
