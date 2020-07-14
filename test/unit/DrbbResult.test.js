/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import DrbbResult from './../../src/app/components/Drbb/DrbbResult';
import workData from '../fixtures/work-detail.json';

describe('DrbbResult', () => {
  describe('with work prop', () => {

    describe('work with all data', () => {
      let component;
      const authors = workData.data.agents.filter(agent => agent.roles.includes('author'));
      before(() => {
        component = shallow(<DrbbResult work={workData.data} />);
      });

      it('should render an `li`', () => {
        expect(component.find('li')).to.have.length(1);
      });

      it('should have a link with .drbb-result-title class', () => {
        expect(component.find('Link').first().render().text()).to.equal(workData.data.title);
      });

      it('should have links to authors', () => {
        expect(component.find('.drbb-result-author')).to.have.length(authors.length);
        expect(component.find('.drbb-result-author').is('Link')).to.equal(true);
      });
    });

    describe('edition with no items', () => {
      let component;
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

    describe('work with no authors', () => {
      let component;
      before(() => {
        const workWithNoAuthors = workData.data;
        const { agents } = workWithNoAuthors;
        workWithNoAuthors.agents = agents.filter(agent => !agent.roles.includes('author'));
        component = shallow(<DrbbResult work={workWithNoAuthors} />);
      });

      it('should not have a .drbb-authorship element', () => {
        expect(component.find('.drbb-authorship')).to.have.length(0);
      });
    });
  });

  describe('without work prop', () => {
    let component;
    before(() => {
      component = shallow(<DrbbResult />);
    });

    it('should return `null`', () => {
      expect(component.type()).to.be.null;
    });
  });
});
