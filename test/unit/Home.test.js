/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Home from '../../src/app/pages/Home';

describe('Home', () => {
  let component;

  before(() => {
    component = shallow(<Home />);
  });

  it('should be wrapped in a .home class', () => {
    expect(component.find('.home').length).to.equal(1);
  });

  it('should contain a Search component in the banner', () => {
    expect(component.find('Search')).to.have.length(1);
  });

  it('should contain an h2', () => {
    const h2 = component.find('Heading').at(0).dive();
    expect(h2.text()).to.equal('Research at NYPL');
  });

  it('should contain five images', () => {
    const imageBlocks = component.find('img.nypl-quarter-image');

    expect(component.find('img').length).to.equal(5);
    expect(imageBlocks.length).to.equal(5);
  });

  it('should have five h3s in the image blocks', () => {
    const imageBlocks = component.find('div.nypl-quarter-image');
    imageBlocks.forEach((imageBlock) => {
      expect(imageBlock.render().find('h4').length).to.equal(1);
    });
  });
});
