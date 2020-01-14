/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Pagination from '../../src/app/components/Pagination/Pagination';

// The Pagination component displays the items currently being displayed. If there are more
// than 50 items then the "next" link gets rendered. If the page prop is greater than 1,
// the "previous" link gets rendered.
Enzyme.configure({ adapter: new Adapter() });
describe('Pagination', () => {
  describe('Default component', () => {
    let component;

    before(() => {
      component = shallow(<Pagination />);
    });

    it('should return null', () => {
      expect(component.html()).to.equal(null);
    });
  });

  describe('With 40 results', () => {
    let component;

    before(() => {
      component = shallow(<Pagination total={40} />);
    });

    it('should be wrapped in a .nypl-results-pagination nav wrapper', () => {
      expect(component.hasClass('nypl-results-pagination')).to.equal(true);
      expect(component.type()).to.equal('nav');
    });

    it('should not have any Links since the results are less than 51', () => {
      expect(component.find('Link').children().length).to.equal(0);
    });

    it('should display what page you are on', () => {
      expect(component.find('.page-count').text()).to.equal('Page 1 of 1');
    });

    it('should have a descriptive aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying page 1 out of 1 total pages.');
    });
  });

  describe('With 400 results on the default page', () => {
    let component;

    before(() => {
      component = mount(<Pagination total={400} />);
    });

    it('should have a first page class for the text display', () => {
      expect(component.find('.first').length).to.equal(1);
    });

    it('should not have a previous link', () => {
      expect(component.find('Link').children().length).to.equal(1);
      expect(component.find('.previous-link').length).to.equal(0);
    });

    // The SVG titles should maybe not be here:
    it('should have a "next" link since there are more than 51 items', () => {
      expect(component.find('Link').children().length).to.equal(1);
      expect(component.find('.next-link').at(1).text()).to.equal('NYPL Right Wedge SVG Icon Next');
    });

    it('should display what page you are on', () => {
      expect(component.find('span').text()).to.equal('Page 1 of 9');
    });

    it('should have a descriptive aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying page 1 out of 9 total pages.');
    });
  });

  describe('With 400 results on the second page', () => {
    let component;

    before(() => {
      component = mount(<Pagination total={400} page={2} />);
    });

    it('should not have a first page class for the text display', () => {
      expect(component.find('.first').length).to.equal(0);
    });

    it('should have a "previous" and a "next" link', () => {
      expect(component.find('Link').children().length).to.equal(2);
      expect(component.find('.previous-link').at(1).text()).to.equal('NYPL Left Wedge SVG Icon Previous');
      expect(component.find('.next-link').at(1).text()).to.equal('NYPL Right Wedge SVG Icon Next');
    });

    it('should display what page you are on', () => {
      expect(component.find('span').text()).to.equal('Page 2 of 9');
    });

    it('should have a description aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying page 2 out of 9 total pages.');
    });
  });

  describe('With 4000 results on the third page', () => {
    let component;

    before(() => {
      component = mount(<Pagination total={4000} page={3} />);
    });

    it('should have a "previous page" and a "next page" link', () => {
      expect(component.find('Link')).to.have.length(2);
      expect(component.find('.previous-link').at(1).text()).to.equal('NYPL Left Wedge SVG Icon Previous');
      expect(component.find('.next-link').at(1).text()).to.equal('NYPL Right Wedge SVG Icon Next');
    });

    it('should display what page you are on', () => {
      expect(component.find('span').text()).to.equal('Page 3 of 81');
    });

    it('should have a description aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying page 3 out of 81 total pages.');
    });
  });

  describe('getPage() method', () => {
    let component;

    before(() => {
      component = shallow(<Pagination total={4000} page={3} />);
    });

    it('should have the method "getPage()"', () => {
      expect(typeof component.instance().getPage).to.equal(typeof Function);
    });

    it('should return null if no arguments are passed', () => {
      expect(component.instance().getPage()).to.equal(null);
    });

    it('should return a link with "Next" as the default text', () => {
      const nextPage = component.instance().getPage(2);

      expect(nextPage.props.rel).to.equal('next');
      expect(nextPage.props.className).to.equal('next-link');
      expect(nextPage.props.children[2]).to.equal('Next');
    });

    it('should return a link with "Previous"', () => {
      const nextPage = component.instance().getPage(2, 'Previous');

      expect(nextPage.props.rel).to.equal('previous');
      expect(nextPage.props.className).to.equal('previous-link');
      expect(nextPage.props.children[2]).to.equal('Previous');
    });
  });

  describe('Start on the first page and go to the second page', () => {
    let component;
    let page = 1;
    // Dummy function to test.
    const updatePage = (updatedPage) => {
      page = updatedPage;
    };

    before(() => {
      component = mount(<Pagination total={1000} page={page} updatePage={updatePage} />);
    });

    it('should return "2" since the next link was clicked', () => {
      expect(page).to.equal(1);
      component.find('.next-link').at(1).simulate('click');
      expect(page).to.equal(2);
    });
  });

  describe('Start on the second page and go to the first page', () => {
    let component;
    let page = 2;
    // Dummy function to test.
    const updatePage = (updatedPage) => {
      page = updatedPage;
    };

    before(() => {
      component = mount(<Pagination total={1000} page={page} updatePage={updatePage} />);
    });

    it('should perform the passed function when it is clicked', () => {
      expect(page).to.equal(2);
      component.find('.previous-link').at(1).simulate('click');
      expect(page).to.equal(1);
    });
  });
});
