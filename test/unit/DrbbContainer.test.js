/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
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
      expect(component.find('.drbb-loading-layer')).to.be.defined;
      expect(component.find('.drbb-container')).to.have.length(1);
    });

    it('should be wrapped in a .drbb-container class', () => {
      expect(component.find('.drbb-container')).to.be.defined;
      expect(component.find('.drbb-container')).to.have.length(1);
    });

    it('should have initial loading state', () => {
      expect(component.state('drbbResultsLoading')).to.equal(true);
    });
  });

  describe('with search params', () => {
    let fetchResearchNowResults;
    let mock;
    before(() => {
      context.router.location.search = '?q=dogs';
      fetchResearchNowResults = spy(DrbbContainer.prototype, 'fetchResearchNowResults');
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/research-now?q=dogs')
        .reply(200, { works: ['work'], totalWorks: 1, researchNowQueryString: 'query=dogs' });
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
      expect(component.state('works')).to.be.an('array').that.includes('work');
      expect(component.state('totalWorks')).to.equal(1);
      expect(component.state('researchNowQueryString')).to.equal('query=dogs');
    });
  });
});
