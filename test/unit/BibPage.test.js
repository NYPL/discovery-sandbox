/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

// Import Bib helper functions for pre-processing
import { addHoldingDefinition } from './../../src/server/ApiRoutes/Bib';

// Import the unwrapped component that is going to be tested
import { BibPage } from './../../src/app/pages/BibPage';
import bibs from '../fixtures/bibs';
import annotatedMarc from '../fixtures/annotatedMarc.json';
import mockBibWithHolding from '../fixtures/mockBibWithHolding.json';
import { makeTestStore, mountTestRender, shallowTestRender } from '../helpers/store';
import { mockRouterContext } from '../helpers/routing';
import BackToSearchResults from '../../src/app/components/BibPage/BackToSearchResults';
import { Link } from 'react-router';
import BibDetails from '../../src/app/components/BibPage/BibDetails';
import ElectronicResources from '../../src/app/components/BibPage/ElectronicResources'
import { isAeonLink } from '../../src/app/utils/utils';
import { Heading } from '@nypl/design-system-react-components';


describe('BibPage', () => {
  const electronicResources = [
    {
      '@type': 'nypl:ElectronicLocation',
      label: 'Full text available via HathiTrust',
      url: 'http://hdl.handle.net/2027/nyp.33433076020639',
    },
    {
      '@type': 'nypl:ElectronicLocation',
      label: 'Request Access to Special Collections Material',
      url: 'https://specialcollections.nypl.org/aeon/Aeon.dll?Action=10&Form=30&Title=A+bibliographical+checklist+of+American+Negro+poetry+/&Site=SCHRB&CallNumber=Sc+Rare+016.811-S+(Schomburg,+A.+Bibliographical+checklist)&Author=Schomburg,+Arthur+Alfonso,&ItemPlace=New+York+:&ItemPublisher=Charles+F.+Heartman,&Date=1916.&ItemInfo3=https://catalog.nypl.org/record=b22030125&ReferenceNumber=b220301256&Genre=Book-text&Location=Schomburg+Center',
    },
  ]
  const context = mockRouterContext();
  describe('Electronic Resources List', () => {
    const testStore = makeTestStore({
      bib: {
        numItems: 0,
      },
    });

    const bib = { ...bibs[2], electronicResources };
    const page = mountTestRender(
      <BibPage
        location={{ search: 'search', pathname: '' }}
        bib={bib}
        dispatch={() => {}}
        resultSelection={{
          fromUrl: '',
          bibId: '',
        }}
      />,
      { context, childContextTypes: { router: PropTypes.object }, store: testStore },
    );

    it.only('should have an Aeon link available', () => {
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

    it('should not include an Aeon link in top section of bib page', () => {
      const topBibComp = page.findWhere(
        (node) =>
          node.type() === ElectronicResources
      );
      expect(topBibComp.type()).to.equal(ElectronicResources);
      expect(topBibComp.prop('electronicResources')).to.have.lengthOf(1);
      expect(topBibComp.prop('id')).to.equal('electronic-resources');
    });

    it('should not render Electronic Resources component when there are no electronic resources', () => {
      const noElectronicResourcesBib = bibs[0]
      const noElectronicResourcesBibPage = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={noElectronicResourcesBib}
          dispatch={() => { }}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
        />,
        { context, childContextTypes: { router: PropTypes.object }, store: testStore }
      );
      expect(noElectronicResourcesBibPage.find(ElectronicResources)).to.have.lengthOf(0)
    })


  });

  describe('Non-serial bib', () => {
    const testStore = makeTestStore({
      bib: {
        numItems: 0,
      },
    });
    let component;
    before(() => {
      const bib = { ...bibs[0], ...annotatedMarc };
      component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => { }}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
        />,
        { context, childContextTypes: { router: PropTypes.object }, store: testStore },
      );
    });


    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('h3').at(2).prop('children')).to.equal('Details');
    });

    it('has section with id items-table', () => {
      expect(component.find('#items-table').length).to.equal(1)
    })

    it('combines details sections', () => {
      expect(component.findWhere(el => el.type() === 'dt' && el.text() === 'Abbreviated Title').length).to.equal(1);
    });

    it('has "View in Legacy Catalog" link', () => {
      const linkToLegacy = component.find('a#legacy-catalog-link');
      expect(linkToLegacy.length).to.equal(1);
      expect(linkToLegacy.is('a')).to.equal(true);
      expect(linkToLegacy.prop('href')).to.equal('https://legacyBaseUrl.nypl.org/record=b11417539~S1');
    });
  });

  describe('No items', () => {
    const testStore = makeTestStore({
      bib: {
        done: true,
        numItems: 0,
      },
    });

    let component;
    before(() => {
      const bib = { ...bibs[0], ...annotatedMarc, numItemsTotal: 0 };
      // This is not enough. The ItemsContainer component renders based on
      // the `numItemsTotal` prop from the API.
      bib.items = [];
      component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => { }}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
        />,
        { context, childContextTypes: { router: PropTypes.object }, store: testStore },
      );
    });

    it('should not display ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(0);
    });
  });

  describe('Serial', () => {
    let itemTable;
    let component;
    before(() => {
      mockBibWithHolding.holdings.forEach(holding => addHoldingDefinition(holding));
      const bib = { ...mockBibWithHolding, ...annotatedMarc, numItemsTotal: 1 };
      const testStore = makeTestStore({
        bib: {
          items: [{ holdingLocationCode: 'lol', id: 1234 }],
        },
      });

      component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => { }}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
        />,
        { context, childContextTypes: { router: PropTypes.object }, store: testStore },
      );

    });

    it('has ItemsContainer', () => {
      expect(component.find('ItemsContainer').length).to.equal(1);
    });

    it('has Details section', () => {
      expect(component.find('h3').at(3).prop('children')).to.equal('Details');
    });

    it('has holdings section', () => {
      expect(component.find('LibraryHoldings').length).to.equal(1);
    });

    it('has an item table', () => {
      itemTable = component.find('ItemTable');
      expect(itemTable.length).to.be.at.least(1)
    });

    it('displays any notes in the "Library Holdings" tab', () => {
      expect(component.find('dt').findWhere(n => n.type() === 'dt' && n.text() === 'Notes').length).to.equal(1);
    });
  });

  describe('Back to search results Text', () => {
    const bib = { ...mockBibWithHolding, ...annotatedMarc };

    it('displays if `resultSelection.bibId` matches ID of bib for page', () => {
      const component = shallow(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => { }}
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
          dispatch={() => { }}
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
      const bib = { ...mockBibWithHolding, ...{ parallelTitle: ['Parallel Title'] } };
      const testStore = makeTestStore({
        bib: {
          numItems: 0,
        },
      });
      const component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
          features={['parallels']}
        />,
        {
          context,
          childContextTypes: { router: PropTypes.object },
          store: testStore,
        },
      );

      expect(component.find(Heading).at(1).text()).to.eql('Parallel Title')
    })

    it('should display parallel title rtl if rtl', () => {
      const bib = { ...mockBibWithHolding, ...{ parallelTitle: ['\u200FParallel Title'] } };
      const testStore = makeTestStore({
        bib: {
          numItems: 0,
        },
      });
      const component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
          features={['parallels']}
        />,
        {
          context,
          childContextTypes: { router: PropTypes.object },
          store: testStore,
        },
      );

      expect(component.find('section').at(0).prop('dir')).to.eql('rtl')
    })

    it('should display parallel title ltr if ltr', () => {
      const bib = { ...mockBibWithHolding, ...{ parallelTitle: ['Parallel Title'] } };
      const testStore = makeTestStore({
        bib: {
          numItems: 0,
        },
      });
      const component = mountTestRender(
        <BibPage
          location={{ search: 'search', pathname: '' }}
          bib={bib}
          dispatch={() => undefined}
          resultSelection={{
            fromUrl: '',
            bibId: '',
          }}
          features={['parallels']}
        />,
        {
          context,
          childContextTypes: { router: PropTypes.object },
          store: testStore,
        },
      );

      expect(component.find('section').at(0).prop('dir')).to.eql(null)
    })
  });


  describe('ItemsContainer conditional display', () => {
    let component;
    let testStore
    const bib = { ...mockBibWithHolding, ...annotatedMarc }
    before(() => {
      mockBibWithHolding.holdings.forEach(holding => addHoldingDefinition(holding));

      testStore = makeTestStore({
        bib: {
          items: [{ holdingLocationCode: 'lol', id: 1234 }],
        },
      });
    })
    describe('1 item, electronic resources', () => {
      const oneItemYesER = { ...bib, numItemsTotal: 1, numElectronicResources: 20 }
      before(() => {
        component = mountTestRender(
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={oneItemYesER}
            dispatch={() => { }}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />,
          { context, childContextTypes: { router: PropTypes.object }, store: testStore },
        )
      })
      it('does not render ItemsContainer', () => { expect(component.find('ItemsContainer').length).to.equal(0) })
    })
    describe('No item, no electronic resources', () => {
      const noItemsNoEr = { ...bib, numItemsTotal: 0, numElectronicResources: 0 }
      before(() => {
        component = mountTestRender(
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={noItemsNoEr}
            dispatch={() => { }}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />,
          { context, childContextTypes: { router: PropTypes.object }, store: testStore },
        )
      })
      it(' does not render ItemsContainer', () => { expect(component.find('ItemsContainer').length).to.equal(0) });
    })
    describe('1 item, no electronic resources does render ItemsContainer', () => {

      const oneItemNoER = { ...bib, numItemsTotal: 1 };
      before(() => {
        component = mountTestRender(
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={oneItemNoER}
            dispatch={() => { }}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />,
          { context, childContextTypes: { router: PropTypes.object }, store: testStore },
        )
      })
      it(' does render ItemsContainer', () => {
        expect(component.find('ItemsContainer').length).to.equal(1)
      })
    })
    describe('Multi item, electronic resources', () => {
      const multiItemsYesER = { ...bib, numItemsTotal: 20, numElectronicResources: 30 }
      before(() => {
        component = mountTestRender(
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={multiItemsYesER}
            dispatch={() => { }}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />,
          { context, childContextTypes: { router: PropTypes.object }, store: testStore },
        )
      })
      it(' does render ItemsContainer', () => { expect(component.find('ItemsContainer').length).to.equal(1); })
    })
    describe('Multi item, no electronic resources does render ItemsContainer', () => {
      const multiItemsNoER = { ...bib, numItemsTotal: 10 }
      before(() => {
        component = mountTestRender(
          <BibPage
            location={{ search: 'search', pathname: '' }}
            bib={multiItemsNoER}
            dispatch={() => { }}
            resultSelection={{
              fromUrl: '',
              bibId: '',
            }}
          />,
          { context, childContextTypes: { router: PropTypes.object }, store: testStore },
        )
      })
      it(' does render ItemsContainer', () => { expect(component.find('ItemsContainer').length).to.equal(1); })
    })
  })
});
