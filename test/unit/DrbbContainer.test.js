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

  let mock;
  describe('with search params', () => {
    before(() => {
      context.router.location.search = '?q=dogs';
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/research-now?q=dogs')
        .reply(200, { works: [{ title: 'work' }], totalWorks: 1, researchNowQueryString: 'query=dogs' });
      component = shallow(<DrbbContainer />, { context });
    });

    after(() => {
      mock.restore();
    });
  });

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
      expect(component.find('img')).to.have.length(1);
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
      expect(component.find('img')).to.have.length(1);
    });
  });
});
