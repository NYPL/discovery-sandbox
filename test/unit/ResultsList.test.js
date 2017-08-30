/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ResultsList from '../../src/app/components/Results/ResultsList.jsx';

const results = [{}, {}, {}];

describe('ResultsList', () => {
  describe('Default rendering', () => {
    it('should return null if no results were passed', () => {
      const component = shallow(<ResultsList />);
      expect(component.type()).to.equal(null);
    });
  });

  describe('Basic rendering checks', () => {
    let component;

    before(() => {
      component = shallow(<ResultsList results={results} />);
    });

    it('should have a ul wrapper', () => {
      expect(component.first().type()).to.equal('ul');
      expect(component.find('.nypl-results-list').length).to.equal(1);
    });

    it('should not have an initial isLoading state', () => {
      expect(component.find('.hide-results-list').length).to.equal(0);
    });
  });
});
