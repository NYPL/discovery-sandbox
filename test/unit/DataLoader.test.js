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
  it('should initialize loaded to null', () => {
    expect(wrapper.state().loaded).to.equal(null);
  })
  it('should call dataLoaderUtil with location', () => {
    expect(dataLoaderUtilSpy.calledWith(location)).to.equal(true);
  });
  it('should call dataLoaderUtil with updateState', () => {
    expect(dataLoaderUtilSpy.firstCall.args[4].name).to.equal('bound updateState');
  });
  it('should render the children', () => {
    expect(wrapper.find('div')).to.have.lengthOf(1);
  });
  it('should render the content', () => {
    expect(wrapper.find(Content)).to.have.lengthOf(1);
  });
  it('should pass the location prop to content', () => {
    expect(wrapper.find(Content).props().location).to.equal(wrapper.props().location);
  });
  it('should pass the loaded slice of state to content', () => {
    expect(wrapper.find(Content).props().loaded).to.equal(wrapper.state().loaded);
  });
  it('should pass the children to content', () => {
    expect(wrapper.find(Content).props().children).to.equal(wrapper.props().children);
  });

  describe('updateState', () => {
    let setStateSpy;
    before(() => {
      setStateSpy = sinon.spy(wrapper.instance(), 'setState');
    });
    after(() => {
      setStateSpy.restore();
    });
    it('should call setState with input', () => {
      wrapper.instance().updateState('fake');
      expect(setStateSpy.firstCall.args).to.deep.equal([{ loaded: 'fake' }]);
    });
  });
});
