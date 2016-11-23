/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchButton from './../src/app/components/Buttons/SearchButton.jsx';

describe('SearchButton', () => {
  let component;

  before(() => {
    component = shallow(<SearchButton />);
  });

  it('should be wrapped in a .svgIcon', () => {
    expect(component.find('.svgIcon')).to.be.defined;
  });

  it('should have a button element', () => {
    expect(component.find(<button />)).to.be.defined;
  });
});
