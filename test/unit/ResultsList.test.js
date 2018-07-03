/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import sinon from 'sinon';

import ResultsList from '../../src/app/components/Results/ResultsList';

const mock = new MockAdapter(axios);

const results = [{}, {}, {}];
const singleBibNoTitleDisplay = {
  result: {
    '@id': 'res:b17692265',
    extent: ['xii, 267 p. : ill. '],
    note: ['Includes bibliographical references (p. 244-258) and index.'],
    createdYear: 2007,
    title: ['Hamlet without Hamlet', 'Hamlet without Hamlet /'],
    creatorLiteral: ['De Grazia, Margreta.'],
    createdString: ['2007'],
    items: [],
  },
};
const singleBibNoTitleDisplayOrCreator = {
  result: {
    '@id': 'res:b17692265',
    extent: ['xii, 267 p. : ill. '],
    note: ['Includes bibliographical references (p. 244-258) and index.'],
    createdYear: 2007,
    title: ['Hamlet without Hamlet', 'Hamlet without Hamlet /'],
    createdString: ['2007'],
    items: [],
  },
};
const emptyBib = { result: {} };
const onlyStartYearBib = {
  result: {
    dateStartYear: 2007,
  },
};
const startEndYearBib = {
  result: {
    dateStartYear: 1999,
    dateEndYear: 2007,
  },
};
const startYear999Bib = {
  result: {
    dateStartYear: 999,
    dateEndYear: 2007,
  },
};
const endYear9999Bib = {
  result: {
    dateStartYear: 1999,
    dateEndYear: 9999,
  },
};
const resultsBibs = [
  {
    result: {
      '@id': 'res:b17692265',
      extent: ['xii, 267 p. : ill. '],
      note: ['Includes bibliographical references (p. 244-258) and index.'],
      createdYear: 2007,
      title: ['Hamlet without Hamlet', 'Hamlet without Hamlet /'],
      creatorLiteral: ['De Grazia, Margreta.'],
      createdString: ['2007'],
      idOwi: ['urn:owi:58292525'],
      dateStartYear: 2007,
      suppressed: false,
      identifier: [
        'urn:bnum:17692265',
        'urn:oclc:255835683',
        'urn:lcc:PR2807',
        'urn:lccCoarse:PR2199-3195',
      ],
      materialType: [
        {
          '@id': 'resourcetypes:txt',
          prefLabel: 'Text',
        },
      ],
      titleDisplay: ['Hamlet without Hamlet / Margreta De Grazia.'],
      uri: 'b17692265',
      numItems: 2,
      numAvailable: 0,
      uris: [
        'b17692265',
        'b17692265-i21106088',
        'b17692265-i21106086',
      ],
      placeOfPublication: ['Cambridge, UK ; New York :'],
      publicationStatement: ['Cambridge, UK ; New York : Cambridge University Press,'],
      issuance: [
        {
          '@id': 'urn:biblevel:m',
          prefLabel: 'monograph/item',
        },
      ],
      publisherLiteral: ['Cambridge University Press,'],
      items: [
        {
          '@id': 'res:i21106088',
          uri: 'i21106088',
          identifier: ['urn:SierraNypl:21106088'],
          idNyplSourceId: {
            '@type': 'SierraNypl',
            '@value': 21106088,
          },
        },
        {
          '@id': 'res:i21106086',
          uri: 'i21106086',
          identifier: ['urn:SierraNypl:21106086'],
          idNyplSourceId: {
            '@type': 'SierraNypl',
            '@value': 21106086,
          },
        },
      ],
    },
  },
  {
    result: {
      '@id': 'res:b17678038',
      extent: ['195 p. : chiefly ill. ;'],
      note: ['Includes bibliographical references (p. 244-258) and index.'],
      createdYear: 2007,
      title: ['Hamlet', 'Hamlet /'],
      creatorLiteral: ['Vieceli, Emma.', 'Shakespeare, William, 1564-1616.'],
      createdString: ['2007'],
      idOwi: ['urn:owi:1910969040'],
      dateStartYear: 2007,
      suppressed: false,
      identifier: [
        'urn:bnum:17678038',
        'urn:oclc:690493652',
        'urn:lcc:PN6737.A66',
        'urn:lccCoarse:PN6700-6790',
      ],
      materialType: [
        {
          '@id': 'resourcetypes:txt',
          prefLabel: 'Text',
        },
      ],
      titleDisplay: ['Hamlet without Hamlet / Margreta De Grazia.'],
      uri: 'b17678038',
      numItems: 2,
      numAvailable: 0,
      uris: [
        'b17692265',
        'b17692265-i21106088',
        'b17692265-i21106086',
      ],
      placeOfPublication: ['New York :'],
      publicationStatement: ['New York :'],
      issuance: [
        {
          '@id': 'urn:biblevel:m',
          prefLabel: 'monograph/item',
        },
      ],
      publisherLiteral: ['Cambridge University Press,'],
      items: [
        {
          '@id': 'res:i21106088',
          uri: 'i21106088',
          identifier: ['urn:SierraNypl:21106088'],
          idNyplSourceId: {
            '@type': 'SierraNypl',
            '@value': 21106088,
          },
        },
      ],
    },
  },
];

describe('ResultsList', () => {
  describe('Default rendering', () => {
    it('should return null if no results were passed', () => {
      const component = shallow(<ResultsList />);
      expect(component.type()).to.equal(null);
    });
  });

  describe('Basic rendering checks', () => {
    let component;

    before(() => {
      component = shallow(<ResultsList results={results} />);
    });

    it('should have a ul wrapper', () => {
      expect(component.first().type()).to.equal('ul');
      expect(component.find('.nypl-results-list').length).to.equal(1);
    });

    it('should not have an initial isLoading state', () => {
      expect(component.find('.hide-results-list').length).to.equal(0);
    });

    it('should not render any li because the objects are empty', () => {
      expect(component.find('li').length).to.equal(0);
    });
  });

  describe('Rendering with two bibs', () => {
    let component;

    before(() => {
      component = mount(<ResultsList results={resultsBibs} />);
    });

    it('should render two bib li items', () => {
      expect(component.find('.nypl-results-item').length).to.equal(2);
    });

    it('should render two "h3"s with the title of the bib', () => {
      expect(component.find('h3').length).to.equal(2);
      expect(component.find('h3').find('Link').length).to.equal(2);

      expect(component.find('h3').at(0).find('Link').render()
        .text())
        .to.equal(resultsBibs[0].result.titleDisplay[0]);
      expect(component.find('h3').at(1).find('Link').render()
        .text())
        .to.equal(resultsBibs[0].result.titleDisplay[0]);
    });

    it('should render 10 `li`s since each bib displays 4 li for their info', () => {
      expect(component.find('li').length).to.equal(10);
    });

    // Only renders the table if the bib has only ONE item:
    it('should have one table', () => {
      expect(component.find('table').length).to.equal(1);
    });
  });

  describe('Rendering with one bib and two items', () => {
    const bib = resultsBibs[0];
    let component;

    before(() => {
      component = mount(<ResultsList results={[bib]} />);
    });

    it('should render one main li', () => {
      expect(component.find('li').find('.nypl-results-item').length).to.equal(1);
    });

    it('should have five lis for the bib\'s description', () => {
      expect(component.find('.nypl-results-item-description').find('li').length).to.equal(4);
    });

    it('should have a media description', () => {
      const materialType = component.find('.nypl-results-media');
      expect(materialType.length).to.equal(1);
      expect(materialType.text()).to.equal('Text');
    });

    it('should have a publication statement description', () => {
      const place = component.find('.nypl-results-publication');
      expect(place.length).to.equal(1);
      expect(place.text()).to.equal('Cambridge, UK ; New York : Cambridge University Press,');
    });

    it('should have a year published description', () => {
      const yearPublished = component.find('.nypl-results-date');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('2007');
    });

    it('should have a total items description', () => {
      const yearPublished = component.find('.nypl-results-info');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('2 items');
    });

    it('should not have a table', () => {
      expect(component.find('table').length).to.equal(0);
    });
  });

  describe('Rendering with one bib and one item', () => {
    const bib = resultsBibs[1];
    let component;

    before(() => {
      component = mount(<ResultsList results={[bib]} />);
    });

    it('should have a total items description', () => {
      const yearPublished = component.find('.nypl-results-info');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('1 item');
    });

    it('should have one table', () => {
      expect(component.find('table').length).to.equal(1);
    });
  });

  describe('Mocking ajax call for the bib', () => {
    describe('Good response', () => {
      const updateIsLoadingState = () => {};
      let component;

      before(() => {
        component = mount(
          <ResultsList results={resultsBibs} updateIsLoadingState={updateIsLoadingState} />,
          { context: { router: { createHref: () => {}, push: () => {}, replace: () => {} } } },
        );
        mock
          .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
          .reply(200, { searchResults: [] });
      });

      after(() => {
        mock.reset();
      });

      it('should make an ajax request', () => {
        const ajaxCallSpy = sinon.spy(axios, 'get');

        component.find('.title').first().simulate('click');

        expect(ajaxCallSpy.callCount).to.equal(1);
        ajaxCallSpy.restore();
      });
    });
  });

  describe('Bad response', () => {
    const updateIsLoadingState = () => {};
    let component;

    before(() => {
      component = mount(
        <ResultsList results={resultsBibs} updateIsLoadingState={updateIsLoadingState} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
      mock
        .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
        .reply(404, { error: 'Some error' });
    });

    after(() => {
      mock.reset();
    });

    it('should make an ajax request', () => {
      const ajaxCallSpy = sinon.spy(axios, 'get');

      component.find('.title').first().simulate('click');

      expect(ajaxCallSpy.callCount).to.equal(1);
      ajaxCallSpy.restore();
    });
  });

  describe('Misc functions', () => {
    describe('getBibTitle', () => {
      it('should display titleDisplay', () => {
        const component = mount(<ResultsList results={resultsBibs} />);
        const getBibTitle = component.instance().getBibTitle(resultsBibs[0].result);

        expect(getBibTitle).to.equal('Hamlet without Hamlet / Margreta De Grazia.');
      });

      it('should display `title` with `creatorLiteral` if there\'s no `titleDisplay`', () => {
        const component = mount(<ResultsList results={[singleBibNoTitleDisplay]} />);
        const getBibTitle = component.instance().getBibTitle(singleBibNoTitleDisplay.result);

        // The result combines `title` with `creatorLiteral`:
        expect(getBibTitle).to.equal('Hamlet without Hamlet / De Grazia, Margreta.');
      });

      it('should display just `title` if there\'s no `titleDisplay` or `creatorLiteral`', () => {
        const component = mount(<ResultsList results={[singleBibNoTitleDisplayOrCreator]} />);
        const getBibTitle =
          component.instance().getBibTitle(singleBibNoTitleDisplayOrCreator.result);

        expect(getBibTitle).to.equal('Hamlet without Hamlet');
      });

      it('should return an empty string', () => {
        const component = mount(<ResultsList results={[emptyBib]} />);
        const getBibTitle = component.instance().getBibTitle(emptyBib.result);

        expect(getBibTitle).to.equal('');
      });
    });

    describe('getYearDisplay', () => {
      it('should return null with no bib', () => {
        const component = mount(<ResultsList results={[emptyBib]} />);
        const getYearDisplay = component.instance().getYearDisplay(emptyBib.result);

        expect(getYearDisplay).to.equal(null);
      });

      it('should return null with a bib but no dates', () => {
        const component = mount(<ResultsList results={singleBibNoTitleDisplay} />);
        const getYearDisplay = component.instance().getYearDisplay(singleBibNoTitleDisplay.result);

        expect(getYearDisplay).to.equal(null);
      });

      it('should return just the start date', () => {
        const component = mount(<ResultsList results={onlyStartYearBib} />);
        const getYearDisplay = component.instance().getYearDisplay(onlyStartYearBib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children).to.equal(2007);
      });

      it('should return the start and end date', () => {
        const component = mount(<ResultsList results={startEndYearBib} />);
        const getYearDisplay = component.instance().getYearDisplay(startEndYearBib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('1999-2007');
      });

      it('should return the start unknown and end date', () => {
        const component = mount(<ResultsList results={startYear999Bib} />);
        const getYearDisplay = component.instance().getYearDisplay(startYear999Bib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('unknown-2007');
      });

      it('should return the start date and end present', () => {
        const component = mount(<ResultsList results={endYear9999Bib} />);
        const getYearDisplay = component.instance().getYearDisplay(endYear9999Bib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('1999-present');
      });
    });
  });

  describe('ResultsList functions', () => {
    const updateIsLoadingState = () => {};
    let component;
    let getBibRecordSpy;
    let axiosSpy;

    before(() => {
      getBibRecordSpy = sinon.spy(ResultsList.prototype, 'getBibRecord');
      component = mount(
        <ResultsList results={resultsBibs} updateIsLoadingState={updateIsLoadingState} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
      mock
        .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
        .reply(404, { error: 'Some error' });
    });

    after(() => {
      mock.reset();
      getBibRecordSpy.restore();
      component.unmount();
      axiosSpy.restore();
    });

    it('should call getBibRecord function when the title is clicked', () => {
      axiosSpy = sinon.spy(axios, 'get');
      component.find('h3').at(0).find('Link').simulate('click');

      expect(axiosSpy.callCount).to.equal(1);
      expect(getBibRecordSpy.calledOnce).to.equal(true);
    });
  });
});
