/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ItemFilters from './../../src/app/components/Item/ItemFilters';

describe('ItemFilters', () => {
  describe('default rendering', () => {
    let component;
    before(() => {
    });
    it('should not render without an `items` prop', () => {
      component = shallow(<ItemFilters />);
      expect(component.type()).to.equal(null);
    });
  });
});
