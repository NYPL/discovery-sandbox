/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';

import SubjectHeadingsIndex from '@SubjectHeadingsIndex';
import SubjectHeadingsIndexPage from './../../src/app/pages/SubjectHeadingsIndexPage';
import { mockRouterContext } from '../helpers/routing';

describe('SubjectHeadingsIndexPage', () => {
  let component;
  before(() => {
    component = shallow(
      <SubjectHeadingsIndexPage
        location={{
          search: '',
          query: {
            filter: '',
          },
        }}
      />);
  });
  it('should render `SubjectHeadingSearch`', () => {
    expect(component.find('SubjectHeadingSearch').length).to.equal(1);
  });
});

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
