/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import Breadcrumbs from './../src/app/components/Breadcrumbs/Breadcrumbs.jsx';

// The current page is the last item in the breadcrumb and it is not linked.
describe('Breadcrumbs', () => {
  // Home >> Research >> Research Catalog
  describe('Default instance - homepage', () => {
    let component;

    before(() => {
      component = shallow(<Breadcrumbs />);
    });

    it('should be wrapped in a .breadcrumbs class', () => {
      expect(component.find('.breadcrumbs')).to.exist;
      expect(component.find('div').first().hasClass('breadcrumbs')).to.equal(true);
    });

    it('should contain two Link elements', () => {
      expect(component.find('Link')).to.have.length(2);
    });

    it('should have the first link go to the nypl.org homepage', () => {
      const firstLink = component.find('Link').first();
      expect(firstLink.prop('to')).to.equal('https://nypl.org');
      expect(firstLink.children().text()).to.equal('Home');
    });

    it('should have the second link go to the nypl.org/research page', () => {
      const secondLink = component.find('Link').last();
      expect(secondLink.prop('to')).to.equal('https://nypl.org/research');
      expect(secondLink.children().text()).to.equal('Research');
    });

    it('should display the current page as "Research Catalog"', () => {
      expect(component.find('.currentPage').text()).to.equal('Research Catalog');
    });
  });

  // Home >> Research >> Research Catalog >> Search Results for [search keyword]
  describe('On the Search Results page', () => {
    describe('No search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Breadcrumbs type="search" />);
      });

      it('should contain three Link elements', () => {
        expect(component.find('Link')).to.have.length(3);
      });

      it('should have a link to the Discovery homepage', () => {
        const thirdLink = component.find('Link').at(2);
        expect(thirdLink.prop('to')).to.equal('/');
        expect(thirdLink.children().text()).to.equal('Research Catalog');
      });

      it('should display the current page as an empty string', () => {
        expect(component.find('.currentPage').text()).to.equal('');
      });
    });

    describe('With a search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Breadcrumbs type="search" query="locofocos" />);
      });

      it('should display the current page as an empty string', () => {
        expect(component.find('.currentPage').text()).to.equal('Search Results for "locofocos"');
      });
    });
  });

  describe('On the Item page', () => {
    // The item was access directly without a search.
    // There is, therefore, no 'Items' link to go to.
    // Home >> Research >> Research Catalog >> [title]
    describe('No search keyword', () => {
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs type="item" title="Locofoco Platform [electronic resource]." />
        );
      });

      it('should contain three Link elements', () => {
        expect(component.find('Link')).to.have.length(3);
      });

      it('should display the current page with the item title', () => {
        expect(component.find('.currentPage').text())
          .to.equal('Locofoco Platform [electronic resource].');
      });
    });

    // Home >> Research >> Research Catalog >> Items >> [title]
    describe('With a search keyword', () => {
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs
            type="item"
            query="locofocos"
            title="Locofoco Platform [electronic resource]." />
        );
      });

      it('should contain four Link elements', () => {
        expect(component.find('Link')).to.have.length(4);
      });

      it('should link back to the search results page', () => {
        const searchLink = component.find('Link').at(3);
        expect(searchLink.prop('to')).to.equal('/search?q=locofocos');
        expect(searchLink.children().text()).to.equal('Items');
      });

      it('should display the current page with the item title', () => {
        expect(component.find('.currentPage').text())
          .to.equal('Locofoco Platform [electronic resource].');
      });
    });

    // Home >> Research >> Research Catalog >> Items >> [title]
    describe('With a long item title', () => {
      let component;
      const title = "Prospect before us, or Locofoco impositions exposed. " +
        "To the people of the United States.";

      before(() => {
        component = shallow(
          <Breadcrumbs
            type="item"
            query="locofocos"
            title={title} />
        );
      });

      it('should shorten the item title to 50 characters', () => {
        const shortenTitle = `${title.substring(0, 50)}...`;

        expect(component.find('.currentPage').text()).to.equal(shortenTitle);
      });
    });
  });


}); /* End of Breadcrumbs component */
