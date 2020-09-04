/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Home from '../../src/app/components/Home/Home';

describe('Home', () => {
  let component;

  before(() => {
    component = shallow(<Home />);
  });

  it('should be wrapped in a .home class', () => {
    expect(component.find('.home').length).to.equal(1);
    expect(component.find('div').first().hasClass('home')).to.equal(true);
  });

  it('should render a hero-type banner page title', () => {
    const pageHeader = component.find('.nypl-homepage-hero');

    expect(pageHeader).to.have.length(1);
    expect(pageHeader.find('h1')).to.have.length(1);
    expect(pageHeader.find('h1').text()).to.equal('Shared Collection Catalog');
    expect(pageHeader.contains(<h1>Shared Collection Catalog</h1>)).to.equal(true);
  });

  xit('should contains a Search component in the banner', () => {
    const pageHeader = component.find('.nypl-homepage-hero');
    expect(pageHeader.find('Search')).to.have.length(1);
  });

  it('should contain an h2', () => {
    const h2 = component.find('h2');
    expect(h2.length).to.equal(1);
    expect(h2.text()).to.equal('Research at NYPL');
  });

  it('should contain five images', () => {
    const imageBlocks = component.find('img.nypl-quarter-image');

    expect(component.find('img').length).to.equal(5);
    expect(imageBlocks.length).to.equal(5);
  });

  it('should have five h3s in the image blocks', () => {
    const imageBlocks = component.find('div.nypl-quarter-image');

    expect(imageBlocks.find('h3').length).to.equal(5);
  });
});
