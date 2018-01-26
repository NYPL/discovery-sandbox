/* eslint-env mocha */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { mount } from 'enzyme';
import axios from 'axios';
import sinon from 'sinon';

const mock = new MockAdapter(axios);

import { basicQuery } from '../../src/app/utils/utils.js';
import Search from '../../src/app/components/Search/Search';
import appConfig from '../../appConfig';

describe('Search', () => {
  describe('Default render', () => {
    let component;

    before(() => {
      component = mount(<Search />);
    });

    it('should have default state', () => {
      expect(component.state('field')).to.equal('all');
      expect(component.state('searchKeywords')).to.equal('');
    });

    it('should render a form element', () => {
      expect(component.find('form').length).to.equal(1);
      expect(component.find('form').prop('method')).to.equal('POST');
    });

    it('should have the form action point to the endpoint with no queries', () => {
      expect(component.find('form').prop('action')).to.equal(`${appConfig.baseUrl}/search`);
    });

    it('should render the nypl-omnisearch style class', () => {
      expect(component.find('.nypl-omnisearch').length).to.equal(1);
    });

    it('should render a select element', () => {
      expect(component.find('select').length).to.equal(1);
      expect(component.find('select').prop('id')).to.equal('search-by-field');
    });

    it('should render a label for the select element', () => {
      expect(component.find('label').length).to.equal(2);
      expect(component.find('label').at(0).prop('htmlFor')).to.equal('search-by-field');
      expect(component.find('#search-by-field').length).to.equal(1);
    });

    it('should render three option elements', () => {
      expect(component.find('option').length).to.equal(3);
    });

    it('should have relevance as the default selected option', () => {
      expect(component.find('select').prop('value')).to.equal('all');
    });

    it('should render an input text element', () => {
      expect(component.find('input').length).to.equal(1);
      expect(component.find('input').at(0).prop('type')).to.equal('text');
    });

    it('should render a submit button', () => {
      expect(component.find('button').length).to.equal(1);
      expect(component.find('button').at(0).prop('type')).to.equal('submit');
    });
  });

  describe('Render with props', () => {
    let component;

    before(() => {
      component = mount(<Search field="title" searchKeywords="Dune" />);
    });

    it('should update the initial state with the props', () => {
      expect(component.state('field')).to.equal('title');
      expect(component.state('searchKeywords')).to.equal('Dune');
    });
  });

  describe('Update the field selected', () => {
    let component;
    let createAPIQuery;
    let onFieldChangeSpy;

    before(() => {
      createAPIQuery = basicQuery({});
      onFieldChangeSpy = sinon.spy(Search.prototype, 'onFieldChange');
      component = mount(
        <Search createAPIQuery={createAPIQuery} updateIsLoadingState={() => {}} />,
        { context: { router: { createHref: () => {}, push: () => {} } } }
      );
    });

    after(() => {
      onFieldChangeSpy.restore();
    });

    it('should update the select value and update the state', () => {
      expect(component.state('field')).to.equal('all');

      component.find('select').simulate('change', { target: { value: 'title' } });

      expect(onFieldChangeSpy.callCount).to.equal(1);
      expect(component.state('field')).to.equal('title');
    });
  });

  describe('Update the input entered', () => {
    let component;
    let createAPIQuery;
    let inputChangeSpy;

    before(() => {
      createAPIQuery = basicQuery({});
      inputChangeSpy = sinon.spy(Search.prototype, 'inputChange');
      component = mount(
        <Search createAPIQuery={createAPIQuery} updateIsLoadingState={() => {}} />,
        { context: { router: { createHref: () => {}, push: () => {} } } }
      );
    });

    after(() => {
      inputChangeSpy.restore();
    });

    it('should update the input value entered and update the state', () => {
      expect(component.state('searchKeywords')).to.equal('');

      component.find('input').at(0).simulate('change', { target: { value: 'Dune' } });

      expect(inputChangeSpy.callCount).to.equal(1);
      expect(component.state('searchKeywords')).to.equal('Dune');
    });
  });

  describe('Update when submitting', () => {
    let component;
    let createAPIQuery;
    let triggerSubmitSpy;
    let submitSearchRequestSpy;

    before(() => {
      createAPIQuery = basicQuery({});
      triggerSubmitSpy = sinon.spy(Search.prototype, 'triggerSubmit');
      submitSearchRequestSpy = sinon.spy(Search.prototype, 'submitSearchRequest');
      component = mount(
        <Search createAPIQuery={createAPIQuery} updateIsLoadingState={() => {}} />,
        { context: { router: { createHref: () => {}, push: () => {} } } }
      );

      mock
        .onGet(`${appConfig.baseUrl}/api?q=Dune`)
        .reply(200, { searchResults: [] });
    });

    after(() => {
      mock.reset();
      triggerSubmitSpy.restore();
      submitSearchRequestSpy.restore();
    });

    it('should submit the input entered when clicking the submit button', () => {
      expect(component.state('searchKeywords')).to.equal('');

      component.find('input').at(0).simulate('change', { target: { value: 'Dune' } });
      component.find('button').at(0).simulate('click');

      expect(component.state('searchKeywords')).to.equal('Dune');
      expect(submitSearchRequestSpy.callCount).to.equal(1);
    });

    it('should submit the input entered when pressing enter', () => {
      expect(component.state('searchKeywords')).to.equal('Dune');

      component.find('input').at(0).simulate('change', { target: { value: 'Harry Potter' } });
      component.find('button').at(0).simulate('keyPress');

      expect(component.state('searchKeywords')).to.equal('Harry Potter');
      expect(triggerSubmitSpy.callCount).to.equal(1);
    });
  });
});
