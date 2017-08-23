// /* eslint-env mocha */
// import React from 'react';
// import { expect } from 'chai';
// import { shallow, mount } from 'enzyme';
// import sinon from 'sinon';
// import MockAdapter from 'axios-mock-adapter';
// import axios from 'axios';
//
// import Hits from '../../src/app/components/Hits/Hits.jsx';
// import Actions from '../../src/app/actions/Actions.js';
//
// import { basicQuery } from '../../src/app/utils/utils.js';
//
// const mock = new MockAdapter(axios);
//
// const facets = {
//   single: {
//     owner: [{ id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' }],
//     date: [],
//     subject: [],
//     materialType: [],
//     issuance: [],
//     publisher: [],
//     location: [],
//     language: [],
//     mediaType: [],
//   },
//   two: {
//     owner: [{ id: 'orgs:1000', value: 'Stephen A. Schwarzman Building' }],
//     date: [{ id: '', value: '' }],
//     subject: [{ id: 'Children\'s art El Salvador.', value: 'Children\'s art El Salvador.' }],
//     materialType: [],
//     issuance: [],
//     publisher: [],
//     location: [],
//     language: [],
//     mediaType: [],
//   },
// };
//
// const response = {
//   searchResults: {
//     '@context': 'http://api.data.nypl.org/api/v1/context_all.jsonld',
//     '@type': 'itemList',
//     itemListElement: [
//       {
//         '@type': 'searchResult',
//         result: {},
//       },
//       {
//         '@type': 'searchResult',
//         result: {},
//       },
//     ],
//     totalResults: 2,
//   },
//   facets: {},
// };
//
// describe('Hits', () => {
//   describe('No results found', () => {
//     describe('No search keyword', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits />);
//       });
//
//       it('should be wrapped in a .results-summary class', () => {
//         expect(component.find('.nypl-results-summary')).to.exist;
//         expect(component.find('div').first().hasClass('nypl-results-summary')).to.equal(true);
//       });
//
//       it('should output that no results were found', () => {
//         expect(component.find('p')).to.exist;
//         expect(component.find('p').text()).to.equal('No results found.');
//       });
//     });
//
//     describe('No result count with search keyword', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits searchKeywords="locofocos" />);
//       });
//
//       it('should output that no results were found', () => {
//         expect(component.find('p')).to.exist;
//         expect(component.find('p').text())
//           .to.equal('No results found with keywords locofocostimes iconremove keyword filter locofocos.');
//       });
//     });
//
//     describe('No result count with one facet', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits selectedFacets={facets.single} />);
//       });
//
//       it('should output that no results were found', () => {
//         expect(component.find('p')).to.exist;
//         expect(component.find('p').text())
//           .to.equal('No results found with Owner Stephen A. Schwarzman Buildingtimes iconremove ' +
//             'filter Stephen A. Schwarzman Building.');
//       });
//     });
//   });
//
//   describe('Locale count', () => {
//     let component;
//
//     it('should output that 40 results were found', () => {
//       component = shallow(<Hits hits={40} />);
//       expect(component.find('p').text()).to.equal('40results found');
//     });
//
//     it('should output that 4,000 results were found from input 4000', () => {
//       component = shallow(<Hits hits={4000} />);
//       expect(component.find('p').text()).to.equal('4,000results found');
//     });
//
//     it('should output that 4,000,000 results were found from input 4000000', () => {
//       component = shallow(<Hits hits={4000000} />);
//       expect(component.find('p').text()).to.equal('4,000,000results found');
//     });
//   });
//
//   describe('With Facet data', () => {
//     describe('One facet, count number, and search keyword', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits searchKeywords="fire" selectedFacets={facets.single} hits={2} />);
//       });
//
//       it('should output the search keyword and the selected facet with two results', () => {
//         expect(component.find('p').text()).to.equal('2results found with keywords firetimes ' +
//           'iconremove keyword filter fire with Owner Stephen A. Schwarzman Buildingtimes icon' +
//             'remove filter Stephen A. Schwarzman Building');
//       });
//     });
//
//     describe('Two facets, count number, and search keyword', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits searchKeywords="fire" selectedFacets={facets.two} hits={2} />);
//       });
//
//       it('should output the search keyword and the two selected facets', () => {
//         expect(component.find('p').text()).to.equal('2results found with keywords firetimes icon' +
//           'remove keyword filter fire with Owner Stephen A. Schwarzman Buildingtimes iconremove ' +
//           'filter Stephen A. Schwarzman Building with Subject Children\'s art El Salvador.times ' +
//           'iconremove filter Children\'s art El Salvador.');
//       });
//     });
//
//     describe('Two facets, count number, and no search keyword', () => {
//       let component;
//
//       before(() => {
//         component = shallow(<Hits selectedFacets={facets.two} hits={2} />);
//       });
//
//       it('should output the search keyword and the two selected facets', () => {
//         expect(component.find('p').text()).to.equal('2results found with Owner Stephen A. ' +
//           'Schwarzman Buildingtimes iconremove filter Stephen A. Schwarzman Building with Subject' +
//           ' Children\'s art El Salvador.times iconremove filter Children\'s art El Salvador.');
//       });
//     });
//   });
//
//   describe('Remove the selected keyword', () => {
//     describe('Return 200 with data', () => {
//       let component;
//       let spyUpdateSearchKeywords;
//       let spyUpdateSearchResults;
//       let spyUpdateFacets;
//       let spyUpdatePage;
//       let spyAxios;
//       let createAPIQuery;
//
//       before(() => {
//         spyAxios = sinon.spy(axios, 'get');
//         mock
//           .onGet('/api?q= owner:"orgs:1000"')
//           .reply(200, response);
//
//         spyUpdateSearchKeywords = sinon.spy(Actions, 'updateSearchKeywords');
//         spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
//         spyUpdateFacets = sinon.spy(Actions, 'updateFacets');
//         spyUpdatePage = sinon.spy(Actions, 'updatePage');
//
//         createAPIQuery = basicQuery({
//           searchKeywords: 'fire',
//           sortBy: '',
//           field: '',
//           selectedFacets: facets.single,
//         });
//         component = mount(
//           <Hits
//             searchKeywords="fire"
//             selectedFacets={facets.single}
//             hits={2}
//             createAPIQuery={createAPIQuery}
//           />, {
//             context: { router: [] },
//           });
//       });
//
//       after(() => {
//         axios.get.restore();
//         Actions.updateSearchKeywords.restore();
//         Actions.updateSearchResults.restore();
//         Actions.updateFacets.restore();
//         Actions.updatePage.restore();
//         mock.reset();
//       });
//
//       it('should be clicked and Action called', () => {
//         component.find('.remove-keyword').simulate('click');
//
//         expect(spyAxios.callCount).to.equal(1);
//         expect(spyAxios.calledWithExactly('/api?q=&filters[owner]=orgs:1000')).to.be.true;
//
//         setTimeout(() => {
//           expect(spyUpdateSearchKeywords.callCount).to.equal(1);
//           expect(spyUpdateSearchResults.callCount).to.equal(1);
//           expect(spyUpdateFacets.callCount).to.equal(1);
//           expect(spyUpdatePage.callCount).to.equal(1);
//         }, 0);
//       });
//     });
//
//     describe('Return a 404 and no data', () => {
//       let component;
//       let spyAxios;
//       let spyUpdateSearchKeywords;
//       let spyUpdateSearchResults;
//       let spyUpdateFacets;
//       let spyUpdatePage;
//       let createAPIQuery;
//
//       before(() => {
//         mock
//           .onGet('/api?q= owner:"orgs:1000"')
//           .reply(404, {});
//
//         spyAxios = sinon.spy(axios, 'get');
//         spyUpdateSearchKeywords = sinon.spy(Actions, 'updateSearchKeywords');
//         spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
//         spyUpdateFacets = sinon.spy(Actions, 'updateFacets');
//         spyUpdatePage = sinon.spy(Actions, 'updatePage');
//
//         createAPIQuery = basicQuery({
//           searchKeywords: 'fire',
//           sortBy: '',
//           field: '',
//           selectedFacets: facets.single,
//         });
//         component = mount(
//           <Hits
//             searchKeywords="fire"
//             selectedFacets={facets.single}
//             hits={2}
//             createAPIQuery={createAPIQuery}
//           />, {
//             context: { router: [] },
//           });
//       });
//
//       after(() => {
//         axios.get.restore();
//         Actions.updateSearchKeywords.restore();
//         Actions.updateSearchResults.restore();
//         Actions.updateFacets.restore();
//         Actions.updatePage.restore();
//         mock.reset();
//       });
//
//       it('should be clicked and Action called', () => {
//         component.find('.remove-keyword').simulate('click');
//
//         expect(spyAxios.calledOnce).to.be.true;
//         expect(spyAxios.calledWith('/api?q=&filters[owner]=orgs:1000')).to.be.true;
//
//         setTimeout(() => {
//           expect(spyUpdateSearchKeywords.callCount).to.equal(1);
//
//           expect(spyUpdateSearchResults.callCount).to.equal(0);
//           expect(spyUpdateFacets.callCount).to.equal(0);
//           expect(spyUpdatePage.callCount).to.equal(0);
//         }, 0);
//       });
//     });
//   });
//
//   describe('Remove the selected facet', () => {
//     describe('Click on it and return 200 with data', () => {
//       let component;
//       let spyAxios;
//       let spyRemoveFacet;
//       let spyUpdateSearchResults;
//       let spyUpdateFacets;
//       let spyUpdatePage;
//       let createAPIQuery;
//
//       before(() => {
//         mock
//           .onGet('/api?q=fire')
//           .reply(200, response);
//
//         spyAxios = sinon.spy(axios, 'get');
//         spyRemoveFacet = sinon.spy(Actions, 'removeFacet');
//         spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
//         spyUpdateFacets = sinon.spy(Actions, 'updateFacets');
//         spyUpdatePage = sinon.spy(Actions, 'updatePage');
//
//         createAPIQuery = basicQuery({
//           searchKeywords: 'fire',
//           sortBy: '',
//           field: '',
//           selectedFacets: facets.single,
//         });
//         component = mount(
//           <Hits
//             searchKeywords="fire"
//             selectedFacets={facets.single}
//             hits={2}
//             createAPIQuery={createAPIQuery}
//           />, {
//             context: { router: [] },
//           });
//       });
//
//       after(() => {
//         axios.get.restore();
//         Actions.removeFacet.restore();
//         Actions.updateSearchResults.restore();
//         Actions.updateFacets.restore();
//         Actions.updatePage.restore();
//         mock.reset();
//       });
//
//       it('should output the search keyword and the selected facet', () => {
//         expect(component.find('p').text()).to.equal('2results found with keywords firetimes ' +
//         'iconremove keyword filter fire with Owner Stephen A. Schwarzman Buildingtimes iconremove' +
//         ' filter Stephen A. Schwarzman Building');
//       });
//
//       it('should be clicked and Actions to remove the facet and update called', () => {
//         component.find('.remove-facet').simulate('click');
//
//         expect(spyAxios.calledOnce).to.be.true;
//         // Should be updated:
//         expect(spyAxios.calledWith('/api?q=fire&filters[owner]=orgs:1000')).to.be.true;
//
//         setTimeout(() => {
//           expect(spyRemoveFacet.callCount).to.equal(1);
//
//           expect(spyUpdateSearchResults.callCount).to.equal(1);
//           expect(spyUpdateFacets.callCount).to.equal(1);
//           expect(spyUpdatePage.callCount).to.equal(1);
//         }, 0);
//       });
//     });
//
//     describe('Click on it and return 404', () => {
//       let component;
//       let spyAxios;
//       let spyRemoveFacet;
//       let spyUpdateSearchResults;
//       let spyUpdateFacets;
//       let spyUpdatePage;
//
//       before(() => {
//         mock
//           .onGet('/api?q=fire')
//           .reply(404, {});
//
//         spyAxios = sinon.spy(axios, 'get');
//         spyRemoveFacet = sinon.spy(Actions, 'removeFacet');
//         spyUpdateSearchResults = sinon.spy(Actions, 'updateSearchResults');
//         spyUpdateFacets = sinon.spy(Actions, 'updateFacets');
//         spyUpdatePage = sinon.spy(Actions, 'updatePage');
//
//         component = mount(<Hits searchKeywords="fire" selectedFacets={facets.single} hits={2} />, {
//           context: { router: [] },
//         });
//       });
//
//       after(() => {
//         axios.get.restore();
//         Actions.removeFacet.restore();
//         Actions.updateSearchResults.restore();
//         Actions.updateFacets.restore();
//         Actions.updatePage.restore();
//         mock.reset();
//       });
//
//       it('should output the search keyword and the selected facet', () => {
//         expect(component.find('p').text()).to.equal('2results found with keywords firetimes ' +
//         ' iconremove keyword filter fire with Owner Stephen A. Schwarzman Buildingtimes icon' +
//         'remove filter Stephen A. Schwarzman Building');
//       });
//
//       it('should be clicked and Actions to remove the facet and update called', () => {
//         component.find('.remove-facet').simulate('click');
//
//         expect(spyAxios.calledOnce).to.be.true;
//         expect(spyAxios.calledWith('/api?q=fire')).to.be.true;
//
//         setTimeout(() => {
//           expect(spyRemoveFacet.callCount).to.equal(1);
//
//           expect(spyUpdateSearchResults.callCount).to.equal(0);
//           expect(spyUpdateFacets.callCount).to.equal(0);
//           expect(spyUpdatePage.callCount).to.equal(0);
//         }, 0);
//       });
//     });
//   });
// });
