/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Breadcrumbs from './../../src/app/components/Breadcrumbs/Breadcrumbs.jsx';

// The current page is the last item in the breadcrumb and it is not linked.
describe('Breadcrumbs', () => {
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
      expect(li.at(0).render().text()).to.equal('Shared Collection Catalog');
      expect(li.at(1).render().text()).to.equal('Search Results');
      expect(li.at(2).render().text()).to.equal('Item Details');
      expect(li.at(3).render().text()).to.equal('Item Request');
      expect(li.at(4).render().text()).to.equal('Request Confirmation');
    });
  });

  // Home > Research > Research Catalog > Search Results for [search keyword]
  describe('On the Search Results page', () => {
    describe('No search keyword:', () => {
      const searchKeywords = '';
      let component;

      before(() => {
        component = shallow(<Breadcrumbs query={searchKeywords} type="search" />);
      });

      it('should contain three Link elements', () => {
        expect(component.find('Link')).to.have.length(1);
      });

      it('should have a link to the Discovery homepage', () => {
        const thirdLink = component.find('Link');
        expect(thirdLink.prop('to')).to.equal('/');
        expect(thirdLink.children().text()).to.equal('Research Catalog');
      });

      it('should display the current page as "Search Results"', () => {
        expect(component.find('li').at(3).text()).to.equal('Search Results');
      });
    });

    describe('With a search keyword:' +
      '\n\tHome > Research > Research Catalog > Search Results for [search keyword]', () => {
      let component;

      before(() => {
        component = shallow(<Breadcrumbs type="search" query="locofocos" />);
      });

      it('should display the current page with the search keyword', () => {
        expect(component.find('li').at(3).text()).to.equal('Search Results for "locofocos"');
      });
    });
  });

  describe('On the Bib page', () => {
    // The bib was access directly without a search.
    // There is, therefore, no 'Bib' link to go to.
    // Home > Research > Research Catalog > [title]
    describe('No search keyword:\n\tHome > Research > Research Catalog > [title]', () => {
      const title = 'Locofoco Platform [electronic resource].';
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs type="bib" title={title} />
        );
      });

      it('should contain three Link elements', () => {
        expect(component.find('Link')).to.have.length(1);
      });

      it('should display the current page with the bib title', () => {
        expect(component.find('li').at(3).text()).to.equal(title);
      });
    });

    // Home > Research > Research Catalog > Items > [title]
    describe('With a search keyword:' +
      '\n\tHome > Research > Research Catalog > Items > [title]', () => {
      const title = 'Locofoco Platform [electronic resource].';
      let component;

      before(() => {
        component = shallow(
          <Breadcrumbs
            type="bib"
            query="locofocos"
            title={title}
          />
        );
      });

      it('should contain four Link elements', () => {
        expect(component.find('Link')).to.have.length(2);
      });

      it('should link back to the search results page as the fourth link', () => {
        const searchLink = component.find('Link').at(1);
        expect(searchLink.prop('to')).to.equal('/search?q=locofocos');
        expect(searchLink.children().text()).to.equal('Items');
      });

      it('should display the current page with the item title', () => {
        expect(component.find('li').at(4).text()).to.equal(title);
      });
    });
  });

  //
  // // Do not have this implemented yet.
  // describe('On the Hold page', () => {
  //   // Home > Research > Research Catalog > [title] > Place a hold
  //   describe('No search keyword:' +
  //     '\n\tHome > Research > Research Catalog > [title] > Place a hold', () => {
  //     const title = 'Locofoco Platform [electronic resource].';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="hold"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should contain four Link elements', () => {
  //       expect(component.find('Link')).to.have.length(4);
  //     });
  //
  //     it('should link back to the item page as the fourth link', () => {
  //       const searchLink = component.find('Link').at(3);
  //       expect(searchLink.prop('to')).to.equal(`/item/${bNum}`);
  //       expect(searchLink.children().text()).to.equal(title);
  //     });
  //
  //     it('should display "Place a hold" on the current page', () => {
  //       expect(component.find('.currentPage').text()).to.equal('Place a hold');
  //     });
  //   });
  //
  //   // Home > Research > Research Catalog > Items > [title] > Place a hold
  //   describe('With a search keyword' +
  //     '\n\tHome > Research > Research Catalog > Items > [title] > Place a hold', () => {
  //     const title = 'Locofoco Platform [electronic resource].';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="hold"
  //           query="locofocos"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should contain five Link elements', () => {
  //       expect(component.find('Link')).to.have.length(5);
  //     });
  //
  //     it('should link back to the item page as the fifth link', () => {
  //       const searchLink = component.find('Link').at(4);
  //       expect(searchLink.prop('to')).to.equal(`/item/${bNum}`);
  //       expect(searchLink.children().text()).to.equal(title);
  //     });
  //
  //     it('should display "Place a hold" on the current page', () => {
  //       expect(component.find('.currentPage').text()).to.equal('Place a hold');
  //     });
  //   });
  //
  //   // // Home > Research > Research Catalog > Items > [title] > Place a hold
  //   describe('With a long item title', () => {
  //     const title = 'Prospect before us, or Locofoco impositions exposed. ' +
  //       'To the people of the United States.';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="hold"
  //           query="locofocos"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should shorten the item title to 50 characters', () => {
  //       const titleLink = component.find('Link').at(4);
  //       const shortenTitle = `${title.substring(0, 50)}...`;
  //
  //       expect(titleLink.children().text()).to.equal(shortenTitle);
  //     });
  //   });
  // });
  //
  // describe('On the Hold Confirmation page', () => {
  //   // Home > Research > Research Catalog > [title] > Hold confirmation
  //   describe('No search keyword:' +
  //     '\n\tHome > Research > Research Catalog > [title] > Hold confirmation', () => {
  //     const title = 'Locofoco Platform [electronic resource].';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="holdConfirmation"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should contain four Link elements', () => {
  //       expect(component.find('Link')).to.have.length(4);
  //     });
  //
  //     it('should display "Hold confirmation" on the current page', () => {
  //       expect(component.find('.currentPage').text()).to.equal('Hold confirmation');
  //     });
  //   });
  //
  //   // Home > Research > Research Catalog > Items > [title] > Hold confirmation
  //   describe('With a search keyword' +
  //     '\n\tHome > Research > Research Catalog > Items > [title] > Hold confirmation', () => {
  //     const title = 'Locofoco Platform [electronic resource].';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="holdConfirmation"
  //           query="locofocos"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should contain five Link elements', () => {
  //       expect(component.find('Link')).to.have.length(5);
  //     });
  //
  //     it('should link back to the item page as the fifth link', () => {
  //       const searchLink = component.find('Link').at(4);
  //       expect(searchLink.prop('to')).to.equal(`/item/${bNum}`);
  //       expect(searchLink.children().text()).to.equal(title);
  //     });
  //   });
  //
  //   // // Home > Research > Research Catalog > Items > [title] > Hold confirmation
  //   describe('With a long item title', () => {
  //     const title = 'Prospect before us, or Locofoco impositions exposed. ' +
  //       'To the people of the United States.';
  //     const bNum = 'b20862164';
  //     let component;
  //
  //     before(() => {
  //       component = shallow(
  //         <Breadcrumbs
  //           type="holdConfirmation"
  //           query="locofocos"
  //           title={title}
  //           url={bNum}
  //         />
  //       );
  //     });
  //
  //     it('should shorten the item title to 50 characters', () => {
  //       const titleLink = component.find('Link').at(4);
  //       const shortenTitle = `${title.substring(0, 50)}...`;
  //
  //       expect(titleLink.children().text()).to.equal(shortenTitle);
  //     });
  //   });
  // });
}); /* End of Breadcrumbs component */
