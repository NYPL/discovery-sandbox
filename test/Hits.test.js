/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Hits from '../src/app/components/Hits/Hits.jsx';

describe('Hits', () => {
  describe('No props', () => {
    describe('No search keyword', () => {
      let component;

      before(() => {
        component = shallow(<Hits />);
      });

      it('should be wrapped in a .results-message class', () => {
        expect(component.find('.results-message')).to.exist;
        expect(component.find('div').first().hasClass('results-message')).to.equal(true);
      });

      it('should output that no results were found', () => {
        expect(component.find('p')).to.exist;
        expect(component.find('p').text()).to.equal('No results found.');
      });
    });

    describe('No result count', () => {
      let component;

      before(() => {
        component = shallow(<Hits query="locofocos" />);
      });

      it('should output that no results were found', () => {
        expect(component.find('p')).to.exist;
        expect(component.find('p').text())
          .to.equal('No results found with keywords "locofocos"[x].');
      });
    });
  });

  describe('Locale count', () => {
    let component;

    it('should be wrapped in a .results-message class', () => {
      component = shallow(<Hits hits={40} />);
      expect(component.find('p').text).to.equal('Found 40 results.');
    });

    it('should output that no results were found', () => {
      component = shallow(<Hits hits={4000} />);
      expect(component.find('p').text()).to.equal('Found 4,000 results.');
    });

    it('should output that no results were found', () => {
      component = shallow(<Hits hits={4000000} />);
      expect(component.find('p').text()).to.equal('Found 4,000,000 results.');
    });
  });
});
