/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Content from './../../src/app/components/Content/Content';

describe('Content', () => {
  let wrapper;
  let children;
  let shouldComponentUpdate;

  before(() => {
    children = (<div />);
    wrapper = shallow(<Content>{children}</Content>);
    shouldComponentUpdate = wrapper.instance().shouldComponentUpdate;
  });

  it('should render children', () => {
    expect(wrapper.find('div')).to.have.lengthOf(1);
  });

  it('should not update if loaded prop doesn\'t match location', () => {
    expect(
      shouldComponentUpdate({ location: 1 }, { lastLoaded: 2 }),
    ).to.equal(false);
  });

  it('should update when loaded prop matches location', () => {
    expect(
      shouldComponentUpdate({ location: 1 }, { loaded: 1 }),
    ).to.equal(true);
  });
});
