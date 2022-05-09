import dataLoaderUtil from '@dataLoaderUtil';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import sinon from 'sinon';
import { DataLoader } from './../../src/app/components/DataLoader/DataLoader';

describe('DataLoader', () => {
  let dataLoaderUtilSpy;
  const location = { pathname: '', search: '' };
  let wrapper;
  before(() => {
    const children = <div />;
    dataLoaderUtilSpy = sinon.spy(dataLoaderUtil, 'loadDataForRoutes');
    wrapper = shallow(
      <DataLoader
        lastLoaded='/pathname'
        location={location}
        dispatch={() => undefined}
      >
        {children}
      </DataLoader>,
    );
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
