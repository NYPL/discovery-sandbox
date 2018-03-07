/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchButton from './../../src/app/components/Buttons/SearchButton';

describe('SearchButton', () => {
  describe('Default props', () => {
    let component;

    before(() => {
      component = shallow(<SearchButton />);
    });

    it('should be wrapped in a #nypl-omni-button', () => {
      expect(component.find('#nypl-omni-button').length).to.equal(1);
    });

    it('should have a button element', () => {
      expect(component.find('button')).to.have.length(1);
    });

    it('should have a "Search" value', () => {
      expect(component.find('button').prop('type')).to.equal('submit');
    });
  });

  describe('Adding props', () => {
    let component;
    let val = 1;
    // Dummy function to test.
    const updateVal = () => {
      val = 5;
    };

    before(() => {
      component = shallow(
        <SearchButton
          id="discoverySearch"
          value="Search Discovery"
          onClick={updateVal}
        />,
      );
    });

    it('should be wrapped in a #discoverySearch', () => {
      expect(component.find('#discoverySearch').length).to.equal(1);
    });

    it('should have a "Search Discovery" value', () => {
      expect(component.find('button').text()).to.include('Search').and.include('Discovery');
    });

    it('should perform the passed function when it is clicked', () => {
      expect(val).to.equal(1);
      component.simulate('click');
      expect(val).to.equal(5);
    });
  });
});
