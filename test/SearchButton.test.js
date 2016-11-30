/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchButton from './../src/app/components/Buttons/SearchButton.jsx';

describe('SearchButton', () => {
  describe('Default props', () => {
    let component;

    before(() => {
      component = shallow(<SearchButton />);
    });

    it('should be wrapped in a .searchButton-wrapper', () => {
      expect(component.hasClass('searchButton-wrapper')).to.equal(true);
    });

    it('should be wrapped in a #searchButton-wrapper', () => {
      expect(component.find('#searchButton-wrapper')).to.have.length(1);
    });

    it('should have a button element', () => {
      expect(component.find('button')).to.have.length(1);
    });

    it('should have a "Search" label', () => {
      expect(component.find('button').text()).to.equal('Search');
    });
  });

  describe('Adding props', () => {
    let component;

    before(() => {
      component = shallow(
        <SearchButton id="discoverySearch" className="discoverySearch" label="Search" />
      );
    });

    it('should be wrapped in a .discoverySearch-wrapper', () => {
      expect(component.hasClass('discoverySearch-wrapper')).to.equal(true);
    });

    it('should be wrapped in a #discoverySearch-wrapper', () => {
      expect(component.find('#discoverySearch-wrapper')).to.have.length(1);
    });

    it('should have a button element', () => {
      expect(component.find('button')).to.have.length(1);
    });

    it('should have a "Search" label', () => {
      expect(component.find('button').text()).to.equal('Search');
    });
  });
});
