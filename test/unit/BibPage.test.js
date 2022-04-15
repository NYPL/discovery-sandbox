import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import BackToSearchResults from '../../src/app/components/BibPage/BackToSearchResults';
import BibItems from '../../src/app/components/BibPage/components/BibItems';
import DefinitionField from '../../src/app/components/BibPage/components/DefinitionField';
import { isAeonLink } from '../../src/app/utils/utils';
import annotatedMarc from '../fixtures/annotatedMarc.json';
import bibs from '../fixtures/bibs';
import mockBibWithHolding from '../fixtures/mockBibWithHolding.json';
import { mockRouterContext } from '../helpers/routing';
import { makeTestStore } from '../helpers/store';
import { BibPage } from './../../src/app/pages/BibPage';
import {
  addCheckInItems,
  addHoldingDefinition,
} from './../../src/server/ApiRoutes/Bib';

describe('BibPage', () => {
  const context = mockRouterContext();

  describe('Electronic Resources List', () => {
    const testStore = makeTestStore({
      bib: {
        done: true,
        numItems: 0,
      },
    });

    const bib = { ...bibs[2] };
    const page = mount(
      <Provider store={testStore}>
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
        />
      </Provider>,
      { context, childContextTypes: { router: PropTypes.object } },
    );

    it('should have an Aeon link available', () => {
      const node = page.findWhere((node) => {
        const item = node.type() === DefinitionField;
        const field = node.prop('field') || {};
        return item && field.label === 'Electronic Resource';
      });

      expect(node.type()).to.equal(DefinitionField);
      expect(node.prop('field').label).to.equal('Electronic Resource');

      const resources = node.prop('bibValues');

      expect(resources).to.have.lengthOf(2);
      expect(isAeonLink(resources[1].url)).to.be.true;
    });

    it('should not Render the items table', () => {
      const node = page.findWhere((node) => {
        return node.type() === BibItems;
      });

      expect(node.type()).to.equal(BibItems);
      expect(node.prop('items')).to.have.lengthOf(1);
      expect(node.isEmptyRender()).to.be.true;
    });
  });

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
            dispatch={() => undefined}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />
        </Provider>,
        { context, childContextTypes: { router: PropTypes.object } },
      );
    });

    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('Heading').at(3).prop('children')).to.equal(
        'Details',
      );
    });

    it('combines details sections', () => {
      expect(
        component.findWhere(
          (el) => el.type() === 'dt' && el.text() === 'Abbreviated Title',
        ).length,
      ).to.equal(1);
    });

    it('has "View in Legacy Catalog" link', () => {
      const linkToLegacy = component.find('#legacy-catalog-link');
      expect(linkToLegacy.length).to.equal(1);
      expect(linkToLegacy.is('a')).to.equal(true);
      expect(linkToLegacy.prop('href')).to.equal(
        'https://legacyBaseUrl.nypl.org/record=b11417539~S1',
      );
    });
  });

  describe('Serial', () => {
    let itemTable;
    let component;

    before(() => {
      mockBibWithHolding.holdings.forEach((holding) =>
        addHoldingDefinition(holding),
      );

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
            dispatch={() => undefined}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />
        </Provider>,
        {
          context,
          childContextTypes: { router: PropTypes.object },
        },
      );

      itemTable = component.find('ItemTable');
    });

    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('Heading').at(4).prop('children')).to.equal(
        'Details',
      );
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
      expect(
        component
          .find('dt')
          .findWhere((node) => node.type() === 'dt' && node.text() === 'Notes')
          .length,
      ).to.equal(1);
    });
  });

  describe('Back to search results Text', () => {
    const bib = { ...mockBibWithHolding, ...annotatedMarc };

    it('displays if `result.bibId` matches ID of bib for page', () => {
      const result = {
        fromUrl: 'resultsurl.com',
        bibId: bib['@id'].substring(4),
      };

      const component = shallow(
        <BackToSearchResults bibId={bib['@id'].substring(4)} result={result} />,
      );

      expect(component.type().displayName).to.equal('Link');
      expect(component.render().text()).to.equal('Back to search results');
    });

    it('does not display if `result.bibId` does not match ID of bib for page', () => {
      const result = {
        fromUrl: 'resultsurl.com',
        bibId: bib['@id'].substring(4),
      };

      const component = shallow(
        <BackToSearchResults bibId={'1234'} result={result} />,
      );

      expect(component.type()).to.be.null;
    });
  });
});
