/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import DrbbContainer from './../../src/app/components/Drbb/DrbbContainer';
import appConfig from '../../src/app/data/appConfig';
import configureStore from '../../src/app/stores/configureStore';
import initialState from '../../src/app/stores/InitialState';

describe('DrbbContainer', () => {
  let component;

  describe('all renderings', () => {
    const store = configureStore(initialState);
    before(() => {
      component = mount(<DrbbContainer store={store} />);
    });

    it('should have an h3', () => {
      expect(component.find('h3').length).to.equal(1);
      expect(component.find('h3').text()).to.include('Digital Research Books Beta');
    });

    it('should have a <p> with a <span> and an <a>', () => {
      expect(component.find('p').length).to.equal(1);
      // test that space is rendered before 'Read more...' link
      expect(component.find('p').text()).to.include('No Library Card is Required. Read more about the project.');
      expect(component.find('p').find('span').length).to.equal(1);
      expect(component.find('p').find('span').text()).to.equal('Read more about the project.');
      expect(component.find('p').find('span').find('a').text()).to.equal('Read more about the project');
      expect(component.find('p').find('span').find('a').prop('href')).to.equal(`${appConfig.drbbFrontEnd[appConfig.environment]}/about?source=catalog`);
    });
  });

  describe('with one result', () => {
    before(() => {
      const drbbResults = {
        works: [{ title: 'work', id: 10 }],
        totalWorks: 1,
        researchNowQueryString: 'query=onework',
      };
      const store = configureStore({ ...initialState, drbbResults });
      component = mount(<DrbbContainer store={store} />);
    });

    it('h3 text should be "Results from Digital Research Books Beta"', () => {
      expect(component.find('h3').text()).to.equal('Results from Digital Research Books Beta');
    });
    it('should render a <ul>', () => {
      expect(component.find('ul').length).to.equal(1);
    });
    it('should render 1 `DrbbResult`', () => {
      expect(component.find('DrbbResult').length).to.equal(1);
    });
    it('should render a link to the DRBB search results page', () => {
      expect(component.find('Link').prop('to')).to.deep.equal({
        pathname: `${appConfig.drbbFrontEnd[appConfig.environment]}/search?`,
        search: 'query=onework' });
    });
    it('link text should have result singular', () => {
      expect(component.find('Link').render().text()).to.include('See 1 result');
    });
  });

  describe('with multiple works', () => {
    before(() => {
      const drbbResults = {
        works: [{ title: 'work', id: 10 }, { title: 'work', id: 11 }],
        totalWorks: 1000,
        researchNowQueryString: 'query=multipleworks',
      };
      const store = configureStore({ ...initialState, drbbResults });
      component = mount(<DrbbContainer store={store} />);
    });

    it('link text should have results plural and correct thousands separators', () => {
      expect(component.find('Link').render().text()).to.include('See 1,000 results');
    });
  });

  describe('no ResearchNow results', () => {
    before(() => {
      const drbbResults = {
        works: [],
        totalWorks: 0,
        researchNowQueryString: 'query=noworks',
      };
      const store = configureStore({ ...initialState, drbbResults });
      component = mount(<DrbbContainer store={store} />);
    });

    it('should display the drbb promo', () => {
      expect(component.find('img')).to.have.length(1);
    });

    it('h3 text should be "No results found from Digital Research Books Beta"', () => {
      expect(component.find('h3').text()).to.equal('No results found from Digital Research Books Beta');
    });

    it('link text should be "Explore Digital Research Books Beta"', () => {
      expect(component.find('Link').render().text()).to.equal('Explore Digital Research Books Beta');
    });

    it('link text should be "Explore Digital Research Books Beta"', () => {
      expect(component.find('Link').prop('to')).to.equal(appConfig.drbbFrontEnd[appConfig.environment]);
    });
  });
});
