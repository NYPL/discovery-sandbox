/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy, stub } from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import DrbbContainer from './../../src/app/components/Drbb/DrbbContainer';
import { mockRouterContext } from '../helpers/routing';

describe('DrbbContainer', () => {
  let component;
  const context = mockRouterContext();

  describe('initial render', () => {
    before(() => {
      component = shallow(<DrbbContainer />, {
        context,
        disableLifecycleMethods: true,
      });
    });

    it('should render the loading component', () => {
      expect(component.find('.drbb-loading-layer')).to.have.length(1);
    });

    it('should render three divs', () => {
      expect(component.find('div')).to.have.length(3);
    });

    it('should have initial loading state', () => {
      expect(component.state('drbbResultsLoading')).to.equal(true);
    });
  });

  let fetchResearchNowResults;
  let mock;
  describe('with search params', () => {
    before(() => {
      context.router.location.search = '?q=dogs';
      fetchResearchNowResults = spy(DrbbContainer.prototype, 'fetchResearchNowResults');
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/research-now?q=dogs')
        .reply(200, { works: [{ title: 'work' }], totalWorks: 1, researchNowQueryString: 'query=dogs' });
      component = shallow(<DrbbContainer />, { context });
    });

    after(() => {
      mock.restore();
    });

    it('should have `search` property', () => {
      expect(component.instance().search).to.equal('?q=dogs');
    });

    it('should call `fetchResearchNowResults`', () => {
      expect(fetchResearchNowResults.calledOnce).to.equal(true);
    });

    it('should not be loading', () => {
      expect(component.state('drbbResultsLoading')).to.equal(false);
      expect(component.find('.drbb-loading-layer')).to.not.be.defined;
    });

    it('should set state with the fetched results', () => {
      expect(component.state('works')).to.be.an('array');
      expect(component.state('works')).to.have.length(1);
      expect(component.state('totalWorks')).to.equal(1);
      expect(component.state('researchNowQueryString')).to.equal('query=dogs');
    });

    it('should render DrbbResult', () => {
      expect(component.find('DrbbResult').exists()).to.equal(true);
    });
  });

  const promoStub = stub(DrbbContainer.prototype, 'promo');
  describe('no ResearchNow results', () => {
    before(() => {
      context.router.location.search = '?q=noresults';
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/research-now?q=noresults')
        .reply(200, { works: [] });
      component = shallow(<DrbbContainer />, { context });
    });

    after(() => {
      mock.restore();
    });
    it('should display the drbb promo', () => {
      expect(component.find('.drbb-promo')).to.have.length(1);
    });
  });

  describe('bad results response', () => {
    before(() => {
      context.router.location.search = '?q=badresults';
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/research-now?q=badresults')
        .reply(200, { notWhatIExpected: 'whatever' });
      component = shallow(<DrbbContainer />, { context });
    });

    after(() => {
      mock.restore();
    });

    it('should display the drbb promo', () => {
      expect(component.find('.drbb-promo')).to.have.length(1);
    });
  });

  after(() => { promoStub.restore(); });
});
