import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import { Link } from 'react-router';
import BackToSearchResults from '../../src/app/components/BibPage/BackToSearchResults';
import BibDetails from '../../src/app/components/BibPage/BibDetails';
import { isAeonLink } from '../../src/app/utils/utils';
import annotatedMarc from '../fixtures/annotatedMarc.json';
import bibs from '../fixtures/bibs';
import mockBibWithHolding from '../fixtures/mockBibWithHolding.json';
import { mockRouterContext } from '../helpers/routing';
import { makeTestStore } from '../helpers/store';
import { BibPage } from './../../src/app/pages/BibPage';
import { Heading } from '@nypl/design-system-react-components';
import {
  addCheckInItems,
  addHoldingDefinition,
} from './../../src/server/ApiRoutes/Bib';

describe.only('BibPage', () => {
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
      const bttBibComp = page.findWhere(
        (node) =>
          node.type() === BibDetails && node.prop('additionalData').length,
      );
      // The Bottom Bib Details Component has the original, Non altered, aggregated resources list.
      // It can be checked to see if the bib details would have been passed a list with Aeon links.

      expect(bttBibComp.type()).to.equal(BibDetails);
      expect(bttBibComp.prop('electronicResources')).to.have.lengthOf(2);

      const [resource] = bttBibComp
        .prop('electronicResources')
        .filter(
          (er) => er.label === 'Request Access to Special Collections Material',
        );
      expect(isAeonLink(resource.url)).to.be.true;
    });

    it('should not include an Aeon link in top BibDetails', () => {
      const topBibComp = page.findWhere(
        (node) =>
          node.type() === BibDetails && !node.prop('additionalData').length,
      );
      expect(topBibComp.type()).to.equal(BibDetails);
      expect(
        topBibComp.findWhere(
          (el) => el.type() === 'dt' && el.text() === 'Electronic Resource',
        ).length,
      ).to.equal(1);
      expect(topBibComp.prop('electronicResources')).to.have.lengthOf(1);
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
          .findWhere((_n) => _n.type() === 'dt' && _n.text() === 'Notes')
          .length,
      ).to.equal(1);
    });
  });

  describe('Back to search results Text', () => {
    const bib = { ...mockBibWithHolding, ...annotatedMarc };

    it('displays if `resultSelection.bibId` matches ID of bib for page', () => {
      const component = shallow(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: 'resultsurl.com',
            bibId: bib['@id'].substring(4),
          }}
        />,
        { context },
      );

      expect(component.find(BackToSearchResults)).to.have.lengthOf(1);
      expect(
        component.find(BackToSearchResults).first().render().text(),
      ).to.equal('Back to search results');
    });

    it('does not display if `resultSelection.bibId` does not match ID of bib for page', () => {
      const component = shallow(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: 'resultsurl.com',
            bibId: 'wrongbib',
          }}
        />,
        { context },
      );

      expect(component.find(BackToSearchResults)).to.have.lengthOf(1);
      expect(
        component.find(BackToSearchResults).first().render().find(Link).length,
      ).to.equal(0);
    });
  });

  describe('Bib with parallel title', () => {
    it('should display parallel title as main title', () => {
      const bib = {...mockBibWithHolding, ...{ parallelTitle: ['Parallel Title'] }};
      const testStore = makeTestStore({
        bib: {
          done: true,
          numItems: 0,
        },
      });
      const component = mount(
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

      expect(component.find(Heading).at(1).text()).to.eql('Parallel Title')
    })
  });
});
