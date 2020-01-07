/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import Breadcrumbs from './../../src/app/components/Breadcrumbs/Breadcrumbs';
import appConfig from './../../src/app/data/appConfig';

Enzyme.configure({ adapter: new Adapter() });

const appTitle = appConfig.displayTitle;
const baseUrl = `${appConfig.baseUrl}/`;

// The current page is the last item in the breadcrumb and it is not linked.
describe('Breadcrumbs', () => {
  // Shared Collection Catalog > Search Results > Item Details > Item Request > Request Confirmation
  describe('Default rendering - all links', () => {
    let component;

    before(() => {
      component = shallow(<Breadcrumbs />);
    });

    it('should render a nav and an order list', () => {
      expect(component.find('nav').length).to.equal(1);
      expect(component.find('ol').length).to.equal(1);
    });

    it('should render five li\'s and four links', () => {
      expect(component.find('li').length).to.equal(5);
      expect(component.find('Link').length).to.equal(4);
    });

    it('should render all the navigation', () => {
      const li = component.find('li');
      expect(li.at(0).render().text()).to.equal(appTitle);
      expect(li.at(1).render().text()).to.equal('Search Results');
      expect(li.at(2).render().text()).to.equal('Item Details');
      expect(li.at(3).render().text()).to.equal('Item Request');
      expect(li.at(4).render().text()).to.equal('Request Confirmation');
    });
  });

  // Shared Collection Catalog > Search Results
  describe('On the Search Results page', () => {
    // Note: There's only one type of way this will get rendered on the Search Results page
    // and it does not matter if there is a searchKeywords prop or not.
    let component;

    before(() => {
      component = shallow(<Breadcrumbs type="search" />);
    });

    it('should contain one Link element', () => {
      expect(component.find('Link')).to.have.length(1);
    });

    it('should have a link to the Discovery homepage', () => {
      const link = component.find('Link');
      expect(link.prop('to')).to.equal(baseUrl);
      expect(link.children().text()).to.equal(appTitle);
    });

    it('should display the current page as "Search Results"', () => {
      expect(component.find('li').at(1).text()).to.equal('Search Results');
    });
  });

  // Shared Collection Catalog > Search Results > Item Details
  describe('On the Bib page', () => {
    describe('No search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Breadcrumbs type="bib" />);
      });

      it('should contain two Link elements', () => {
        expect(component.find('Link')).to.have.length(2);
      });

      it('should link back to the regular search results page', () => {
        const searchLink = component.find('Link').at(1);
        expect(searchLink.children().text()).to.equal('Search Results');
        expect(searchLink.prop('to')).to.equal(`${baseUrl}search?`);
      });

      it('should display the current page with the item title', () => {
        expect(component.find('li').at(2).text()).to.equal('Item Details');
      });
    });

    describe('With a search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Breadcrumbs type="bib" query="q=locofocos" />);
      });

      it('should contain two Link elements', () => {
        expect(component.find('Link')).to.have.length(2);
      });

      it('should link back to the search results page with the passed search keyword', () => {
        const searchLink = component.find('Link').at(1);
        expect(searchLink.children().text()).to.equal('Search Results');
        expect(searchLink.prop('to')).to.equal(`${baseUrl}search?q=locofocos`);
      });

      it('should display the current page with the item title', () => {
        expect(component.find('li').at(2).text()).to.equal('Item Details');
      });
    });
  });

  // The search keyword/no search keyword scenarios were tested above and won't be
  // tested again in the following tests.

  // Shared Collection Catalog > Search Results > Item Details > Item Request
  describe('On the Hold Request page', () => {
    const bibId = 'b123456789';
    let component;

    before(() => {
      component = shallow(
        <Breadcrumbs
          query="q=hamlet"
          bibUrl={`/bib/${bibId}`}
          type="hold"
        />,
      );
    });

    it('should contain three Link elements', () => {
      expect(component.find('Link')).to.have.length(3);
    });

    it('should link back to the bib page as the third link', () => {
      const searchLink = component.find('Link').at(2);
      expect(searchLink.prop('to')).to.equal(`${baseUrl}bib/${bibId}`);
    });

    it('should display "Item Request" on the current page', () => {
      expect(component.find('li').at(3).text()).to.equal('Item Request');
    });
  });

  // Shared Collection Catalog > Search Results > Item Details > Item Request
  //  > Electronic Delivery Request
  describe('On the Electronic Delivery Request page', () => {
    const bibId = 'b123456789';
    const itemId = 'i987654321';
    let component;

    before(() => {
      component = shallow(
        <Breadcrumbs
          type="edd"
          bibUrl={`/bib/${bibId}`}
          itemUrl={`/hold/request/${bibId}-${itemId}`}
        />,
      );
    });

    it('should contain four Link elements', () => {
      expect(component.find('Link')).to.have.length(4);
    });

    it('should link back to the item request page as the fouth link', () => {
      const searchLink = component.find('Link').at(3);
      expect(searchLink.prop('to')).to.equal(`${baseUrl}hold/request/${bibId}-${itemId}`);
    });

    it('should display "Electronic Delivery Request" on the current page', () => {
      expect(component.find('li').at(4).text()).to.equal('Electronic Delivery Request');
    });
  });

  describe('On the Hold Confirmation page', () => {
    const bibId = 'b123456789';
    const itemId = 'i987654321';

    // Shared Collection Catalog > Search Results > Item Details > Item Request
    //  > Request Confirmation
    describe('From a physical Hold Request', () => {
      const fromEdd = false;
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs
            type="confirmation"
            bibUrl={`/bib/${bibId}`}
            itemUrl={`/hold/request/${bibId}-${itemId}`}
            edd={fromEdd}
          />,
        );
      });

      it('should contain four Link elements', () => {
        expect(component.find('Link')).to.have.length(4);
      });

      it('should link back to the item request page as the fouth link', () => {
        const searchLink = component.find('Link').at(3);
        expect(searchLink.prop('to')).to.equal(`${baseUrl}hold/request/${bibId}-${itemId}`);
      });

      it('should display "Request Confirmation" on the current page', () => {
        expect(component.find('li').at(4).text()).to.equal('Request Confirmation');
      });
    });

    // Shared Collection Catalog > Search Results > Item Details > Item Request
    //  > Electronic Delivery Request > Request Confirmation
    describe('From the Electronic Delivery Request page', () => {
      const fromEdd = true;
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs
            type="confirmation"
            bibUrl={`/bib/${bibId}`}
            itemUrl={`/hold/request/${bibId}-${itemId}`}
            edd={fromEdd}
          />,
        );
      });

      it('should contain five Link elements', () => {
        expect(component.find('Link')).to.have.length(5);
      });

      it('should link back to the Electronic Delivery Request page as the fifth link', () => {
        const searchLink = component.find('Link').at(4);
        expect(searchLink.prop('to')).to.equal(`${baseUrl}hold/request/${bibId}-${itemId}/edd`);
      });

      it('should display "Request Confirmation" on the current page', () => {
        expect(component.find('li').at(5).text()).to.equal('Request Confirmation');
      });
    });
  });
}); /* End of Breadcrumbs component */
