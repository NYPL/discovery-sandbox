/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import Pagination from '../../src/app/components/Pagination/Pagination.jsx';

const mock = new MockAdapter(axios);
const response = { searchResults: {} };

// The Pagination component displays the items currently being displayed. If there are more
// than 50 items then the "next" button gets rendered. If the page prop is greater than 1,
// the "previous" button gets renderd.
describe('Pagination', () => {
  describe('Default component', () => {
    let component;

    before(() => {
      component = mount(<Pagination />);
    });

    it('should return null', () => {
      expect(component.html()).to.equal(null);
    });
  });

  describe('With 40 results', () => {
    let component;

    before(() => {
      component = shallow(<Pagination hits={40} />);
    });

    it('should be wrapped in a pagination wrapper', () => {
      expect(component.hasClass('pagination')).to.be.true;
    });

    it('should not have any buttons since the results are less than 51', () => {
      expect(component.find('button')).to.have.length(0);
    });

    it('should display how many items are displayed', () => {
      expect(component.find('span').text()).to.equal('1 - 40 of 40');
    });

    it('should have a descriptive aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying 1 - 40 out of 40 total items.');
    });
  });

  describe('With 400 results on the default page', () => {
    let component;

    before(() => {
      component = mount(<Pagination hits={400} />);
    });

    it('should have a "next page" button since there are more than 51 items', () => {
      expect(component.find('button')).to.have.length(1);
      expect(component.find('.next').text()).to.equal('Next Page');
    });

    it('should display how many items are displayed', () => {
      expect(component.find('span').text()).to.equal('1 - 50 of 400');
    });

    it('should have a descriptive aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying 1 - 50 out of 400 total items.');
    });
  });

  describe('With 400 results on the second page', () => {
    let component;

    before(() => {
      component = mount(<Pagination hits={400} page="2" />);
    });

    it('should have a "previous page" and a "next page" button', () => {
      expect(component.find('button')).to.have.length(2);
      expect(component.find('.previous').text()).to.equal('Previous Page');
      expect(component.find('.next').text()).to.equal('Next Page');
    });

    it('should display how many items are displayed', () => {
      expect(component.find('span').text()).to.equal('51 - 100 of 400');
    });

    it('should have a description aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying 51 - 100 out of 400 total items.');
    });
  });

  describe('With 4000 results on the third page', () => {
    let component;

    before(() => {
      component = mount(<Pagination hits={4000} page="3" />);
    });

    it('should have a "previous page" and a "next page" button', () => {
      expect(component.find('button')).to.have.length(2);
      expect(component.find('.previous').text()).to.equal('Previous Page');
      expect(component.find('.next').text()).to.equal('Next Page');
    });

    it('should display how many items are displayed', () => {
      expect(component.find('span').text()).to.equal('101 - 150 of 4,000');
    });

    it('should have a description aria-label', () => {
      expect(component.find('span').prop('aria-label'))
        .to.equal('Displaying 101 - 150 out of 4,000 total items.');
    });
  });

  describe('getPage() method', () => {
    let component;

    before(() => {
      component = shallow(<Pagination hits={4000} page="3" />);
    });

    it('should have the method "getPage()"', () => {
      expect(component.instance().getPage).to.be.defined;
    });

    it('should return null if no arguments are passed', () => {
      expect(component.instance().getPage()).to.be.null;
    });

    it('should return a button with "Next Page" as the default text', () => {
      const nextPage = component.instance().getPage(2);

      expect(nextPage.type).to.equal('button');
      expect(nextPage.props.rel).to.equal('next');
      expect(nextPage.props.children[0] + nextPage.props.children[1]).to.equal('Next Page');
    });

    it('should return a button with "Previous Page"', () => {
      const nextPage = component.instance().getPage(2, 'Previous');

      expect(nextPage.type).to.equal('button');
      expect(nextPage.props.rel).to.equal('previous');
      expect(nextPage.props.children[0] + nextPage.props.children[1]).to.equal('Previous Page');
    });
  });

  describe('Start on the first page and go to the second page', () => {
    let component;
    let spyAxios;

    before(() => {
      mock
        .onGet('/api?q=war&page=2')
        // Doesn't matter what data gets returned from the API for this component.
        .reply(200, response);

      spyAxios = sinon.spy(axios, 'get');

      component = mount(<Pagination hits={1000} location={{ query: { q: 'war' } }} />, {
        context: { router: [] },
      });
    });

    after(() => {
      spyAxios.restore();
      mock.reset();
    });

    it('should only have the "next" button', () => {
      expect(component.find('button')).to.have.length(1);
      expect(component.find('.next').text()).to.equal('Next Page');
    });

    it('should fetch data for the second page when the "next" button is clicked', () => {
      const nextButton = component.find('.next');
      expect(nextButton.text()).to.equal('Next Page');

      nextButton.simulate('click');

      expect(spyAxios.calledOnce).to.be.true;
      expect(spyAxios.calledWith('/api?q=war&page=2')).to.be.true;
    });
  });

  describe('Start on the second page and go to the first page', () => {
    let component;
    let spyAxios;

    before(() => {
      mock
        .onGet('/api?q=war')
        .reply(200, response);

      spyAxios = sinon.spy(axios, 'get');

      component = mount(<Pagination hits={1000} location={{ query: { q: 'war' } }} page="2" />, {
        context: { router: [] },
      });
    });

    after(() => {
      spyAxios.restore();
      mock.reset();
    });

    it('should have a "previous" and "next" button', () => {
      expect(component.find('button')).to.have.length(2);
      expect(component.find('.previous').text()).to.equal('Previous Page');
      expect(component.find('.next').text()).to.equal('Next Page');
    });

    it('should fetch data for the first page when the "previous" button is clicked', () => {
      const previousButton = component.find('.previous');
      expect(previousButton.text()).to.equal('Previous Page');

      previousButton.simulate('click');

      expect(spyAxios.calledOnce).to.be.true;
      // No `&page` param to get initial data for page 1.
      expect(spyAxios.calledWith('/api?q=war')).to.be.true;
    });
  });
});
