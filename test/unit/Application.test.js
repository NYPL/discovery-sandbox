/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { stub } from 'sinon';

import Application from '@Application';
import { Header, navConfig } from '@nypl/dgx-header-component';
import { mockRouterContext } from '../helpers/routing';

const resizeWindow = (x) => {
  window.innerWidth = x;
  window.dispatchEvent(new Event('resize'));
};

describe('Application', () => {
  let component;
  const context = mockRouterContext();

  before(() => {
    window.matchMedia = () => ({ addListener: () => {} });
    window.matchMedia().addListener = stub();
    component = shallow(
      <Application
        children={{}}
        route={{
          history: { listen: stub() },
        }}
      />, { context });

    component.setState({ patron: {} });
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
      <Header
        navData={navConfig.current}
        skipNav={{ target: 'mainContent' }}
        patron={component.state.patron}
      />)).to.equal(true);
  });

  it('should render a <Footer /> components', () => {
    expect(component.find('Footer')).to.have.length(1);
  });

  describe('should set media type in context', () => {
    it('should set media as "desktop" for screenwidths above 871px', () => {
      resizeWindow('871');
      expect(component.state().media).to.eql('desktop');
    });
    it('should set media as "tablet" for screenwidths 484-870px', () => {
      resizeWindow('484');
      expect(component.state().media).to.eql('tablet');
      resizeWindow('870');
      expect(component.state().media).to.eql('tablet');
    });
    it('should set media as "mobile" for screenwidths below 484px', () => {
      resizeWindow('483');
      expect(component.state().media).to.eql('mobile');
    });
  });
});
