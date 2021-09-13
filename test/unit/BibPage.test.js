/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

// Import Bib helper functions for pre-processing
import { addCheckInItems, addHoldingDefinition } from './../../src/server/ApiRoutes/Bib';

// Import the unwrapped component that is going to be tested
import { BibPage } from './../../src/app/pages/BibPage';
import bibs from '../fixtures/bibs';
import annotatedMarc from '../fixtures/annotatedMarc.json';
import mockBibWithHolding from '../fixtures/mockBibWithHolding.json';
import { makeTestStore } from '../helpers/store';
import { mockRouterContext } from '../helpers/routing';

describe('BibPage', () => {
  const context = mockRouterContext();
  describe('Non-serial bib', () => {
    const testStore = makeTestStore({
      bib: {
        done: true,
        numItems: 0,
      },
    });
    let component;
    before(() => {
      const bib = { ...bibs[0], ...annotatedMarc };
      component = mount(
        <Provider store={testStore}>
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={bib}
            dispatch={() => {}}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />
        </Provider>, { context, childContextTypes: { router: PropTypes.object } });
    });


    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('Heading').at(3).prop('children')).to.equal('Details');
    });

    it('combines details sections', () => {
      expect(component.findWhere(el => el.type() === 'dt' && el.text() === 'Abbreviated Title').length).to.equal(1);
    });

    it('has "View in Legacy Catalog" link', () => {
      const linkToLegacy = component.find('#legacy-catalog-link');
      expect(linkToLegacy.length).to.equal(1);
      expect(linkToLegacy.is('a')).to.equal(true);
      expect(linkToLegacy.prop('href')).to.equal('https://legacyBaseUrl.nypl.org/record=b11417539~S1');
    });
  });

  describe('Serial', () => {
    let itemTable;
    let component;
    before(() => {
      mockBibWithHolding.holdings.forEach(holding => addHoldingDefinition(holding));
      addCheckInItems(mockBibWithHolding);
      const bib = { ...mockBibWithHolding, ...annotatedMarc };
      const testStore = makeTestStore({
        bib: {
          done: true,
          numItems: 0,
        },
      });

      component = mount(
        <Provider store={testStore}>
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={bib}
            dispatch={() => {}}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />
        </Provider>, {
          context,
          childContextTypes: { router: PropTypes.object },
        });
      itemTable = component.find('ItemTable');
    });

    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('Heading').at(4).prop('children')).to.equal('Details');
    });

    it('has holdings section', () => {
      expect(component.find('LibraryHoldings').length).to.equal(1);
    });

    it('has item table with volume column', () => {
      expect(itemTable.find('th').at(0).text()).to.equal('Vol/Date');
    });

    it('gets the format from holdings statement', () => {
      expect(itemTable.find('td').at(1).text()).to.equal('PRINT');
    });

    it('displays any notes in the "Library Holdings" tab', () => {
      expect(component.find('dt').findWhere(n => n.type() === 'dt' && n.text() === 'Notes').length).to.equal(1);
    });
  });

  describe('"Back to search results" link', () => {
    const bib = { ...mockBibWithHolding, ...annotatedMarc };
    it('displays if `resultSelection.bibId` matches ID of bib for page', () => {
      const component = shallow(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => {}}
          resultSelection={{
            fromUrl: 'resultsurl.com',
            bibId: bib['@id'].substring(4),
          }}
        />, { context });
      expect(component.find('Link').first().render().text()).to.equal('Back to search results');
    });

    it('does not display if `resultSelection.bibId` does not match ID of bib for page', () => {
      const component = shallow(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => {}}
          resultSelection={{
            fromUrl: 'resultsurl.com',
            bibId: 'wrongbib',
          }}
        />, { context });

      expect(component.find('Link').length).to.equal(0);
    });
  });
});
