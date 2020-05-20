/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Application from '@Application';
import { Header, navConfig } from '@nypl/dgx-header-component';
import { mockRouterContext } from '../helpers/routing'

describe('Application', () => {
  let component;

  before(() => {
    component = shallow(<Application children={{}} />, mockRouterContext);
  });

  it('should be wrapped in a .app-wrapper class', () => {
    expect(component.find('.app-wrapper')).to.be.defined;
    expect(component.find('.app-wrapper')).to.have.length(1);
  });

  it('should render a <Header /> components', () => {
    expect(component.find('Header')).to.have.length(1);
  });

  it('should have the skip navigation link enabled,', () => {
    expect(component.contains(
      <Header navData={navConfig.current} skipNav={{ target: 'mainContent' }} />
    )).to.equal(true);
  });

  it('should render a <Footer /> components', () => {
    expect(component.find('Footer')).to.have.length(1);
  });
});
