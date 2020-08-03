/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DataLoader from './../../src/app/components/DataLoader/DataLoader';
import Content from './../../src/app/components/Content/Content';
import dataLoaderUtil from '@dataLoaderUtil';

describe('DataLoader', () => {
  let dataLoaderUtilSpy;
  const location = { pathname: '', search: '' };
  let wrapper;
  let component;

  before(() => {
    const children = (<div />);
    dataLoaderUtilSpy = sinon.spy(dataLoaderUtil, 'loadDataForRoutes');
    component = (<DataLoader location={location} children={children} />);
    wrapper = shallow(component);
  });

  after(() => {
    dataLoaderUtilSpy.restore();
  });

  it('should call dataLoaderUtil with location', () => {
    expect(dataLoaderUtilSpy.calledWith(location)).to.equal(true);
  });

  it('should render the children', () => {
    expect(wrapper.find('div')).to.have.lengthOf(1);
  });
});
