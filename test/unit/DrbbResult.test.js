/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { spy } from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import DrbbResult from './../../src/app/components/Drbb/DrbbResult';
import { mockRouterContext } from '../helpers/routing';
import workData from '../fixtures/work-detail.json';

describe('DrbbResult', () => {
  let component;
  const context = mockRouterContext();

  describe('with work prop', () => {
    const authors = workData.data.agents.filter(agent => agent.roles.includes('author'));
    before(() => {
      component = shallow(<DrbbResult work={workData.data}/>);
    });

    it('should be wrapped in a .drbb-item class', () => {
      expect(component.find('.drbb-item')).to.be.defined;
      expect(component.find('.drbb-item')).to.have.length(1);
    });

    it('should have a link with .drbb-result-title class', () => {
      expect(component.find('.drbb-result-title')).to.be.defined;
      expect(component.find('.drbb-result-title')).to.have.length(1);
    });

    it('should have links to authors', () => {
      expect(component.find('.drbb-result-author')).to.be.defined;
      expect(component.find('.drbb-result-author')).to.have.length(authors.length);
    });
  });

  describe('without work prop', () => {
    before(() => {
      component = shallow(<DrbbResult />);
    });

    it('should return `null`', () => {
      expect(component.type()).to.be.null;
    })
  });
});
