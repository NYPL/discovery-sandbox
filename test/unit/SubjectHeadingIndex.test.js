/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import SubjectHeadingsIndex from '@SubjectHeadingsIndex';
import { mockRouterContext } from '../helpers/routing';

describe('SubjectHeadingsIndex', () => {
  const context = mockRouterContext();
  let component;
  describe('Unfiltered index', () => {
    before(() => {
      component = mount(
        <SubjectHeadingsIndex />,
        { context });
    });
    it('should render `Alphabetical Pagination`', () => {
      expect(component.find('AlphabeticalPagination').length).to.equal(1);
    });
  });

  describe('Filtered index', () => {
    before(() => {
      context.router.location.query.filter = 'pottery';
      component = mount(
        <SubjectHeadingsIndex />,
        { context },
      );
    });
    after(() => {
      context.router.location.query.filter = undefined;
    });
    it('should not render `Alphabetical Pagination`', () => {
      expect(component.find('AlphabeticalPagination').length).to.equal(0);
    });
  });
});
