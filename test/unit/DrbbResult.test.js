/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DrbbResult from './../../src/app/components/Drbb/DrbbResult';
import workData from '../fixtures/work-detail.json';

describe('DrbbResult', () => {
  let component;

  describe('with work prop', () => {
    const authors = workData.data.agents.filter(agent => agent.roles.includes('author'));
    before(() => {
      component = shallow(<DrbbResult work={workData.data}/>);
    });

    it('Should render an `li`', () => {
      expect(component.find('li')).to.have.length(1);
    });

    it('should have a link with .drbb-result-title class', () => {
      expect(component.findWhere(n => n.text() === 'The Blithedale romance, by Nathaniel Hawthorne.')).to.have.length(1);
    });

    it('should have links to authors', () => {
      expect(component.find('.drbb-result-author')).to.have.length(authors.length);
    });

    describe('edition with no items', () => {
      before(() => {
        const workWithItemsNull = workData.data;
        let { editions } = workWithItemsNull;
        editions = [editions[0]];
        editions[0].items = null;

        component = shallow(<DrbbResult work={workWithItemsNull} />);
      });
      it('should still render', () => {
        expect(component.find('li')).to.have.length(1);
      });
    });
  });

  describe('without work prop', () => {
    before(() => {
      component = shallow(<DrbbResult />);
    });

    it('should return `null`', () => {
      expect(component.type()).to.be.null;
    });
  });
});
