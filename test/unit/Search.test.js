/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import axios from 'axios';
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { act } from 'react-dom/test-utils';
import { expect } from 'chai';

import sinon from 'sinon';
import Search from '../../src/app/components/Search/Search';
import { basicQuery } from '../../src/app/utils/utils';
import appConfig from '../../src/app/data/appConfig';
import { mountTestRender, makeTestStore } from '../helpers/store';

describe('Search', () => {
  let mockStore;
  before(() => {
    mockStore = makeTestStore();
  });
  describe('Default render', () => {
    let component;

    before(() => {
      component = mountTestRender(<Search />, { store: mockStore }).find('Search');
    });

    it('should have default state', () => {
      expect(component.props().field).to.equal('all');
      expect(component.props().searchKeywords).to.equal('');
    });

    it('should render a form element', () => {
      expect(component.find('form').length).to.equal(1);
      expect(component.find('form').prop('method')).to.equal('POST');
    });

    it('should have the form action point to the endpoint with no queries', () => {
      expect(component.find('form').prop('action')).to.equal(`${appConfig.baseUrl}/search`);
    });

    it('should render a select element', () => {
      expect(component.find('select').length).to.equal(1);
      expect(component.find('select').prop('id')).to.equal('searchbar-select-mainContent');
    });

    it('should render four option elements', () => {
      expect(component.find('option').length).to.equal(6);
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
      component = mountTestRender(<Search />, {
        store: makeTestStore({
          field: 'title', searchKeywords: 'Dune',
        }),
      }).find('Search');
    });

    it('should update the initial state with the props', () => {
      expect(component.props().field).to.equal('title');
      expect(component.props().searchKeywords).to.equal('Dune');
    });
  });

  describe('Update the field selected', () => {
    let component;
    let createAPIQuery;

    before(() => {
      createAPIQuery = basicQuery({});

      component = mountTestRender(<Search createAPIQuery={createAPIQuery} />, {
        store: mockStore,
        context: { router: { createHref: () => {}, push: () => {} } },
      }).find('Search');
    });

    it('should update the select value and update the state', async () => {
      expect(component.props().field).to.equal('all');

      // Because Search#onFieldChange derives the selected value from the DOM
      // node by reference (rather than reading the target node referenced in
      // the event, which may have been trashed by the time we read it), we
      // need to both set the node value directly and then also simulate a
      // 'change' event to trigger the handler:
      let select = component.find('select');
      
      act(() => {
        select.simulate('change', { target: { value: 'title' } });
      });

      select = component.update().find('select');

      expect(select.props().value).to.equal('title');
    });
  });

  describe('Update the input entered', () => {
    let component;
    let createAPIQuery;

    before(() => {
      createAPIQuery = basicQuery({});

      component = mountTestRender(<Search createAPIQuery={createAPIQuery} />, {
        store: mockStore,
        context: { router: { createHref: () => {}, push: () => {} } },
      }).find('Search');
    });


    it('should update the input value entered', () => {
      expect(component.props().searchKeywords).to.equal('');

      component.find('input').at(0).simulate('change', { target: { value: 'Dune' } });
      component = component.update();
      expect(component.find('input').props().value).to.equal('Dune');
    });
  });

  describe('Update when submitting', () => {
    let component;
    let createAPIQuery;
    let mock;
    let contextRoutesPushed = [];
    let updateKeywords;
    let updateField;

    before(() => {
      createAPIQuery = basicQuery({});
      updateKeywords = sinon.spy();
      updateField = sinon.spy();

      component = mountTestRender(
        <Search
          createAPIQuery={createAPIQuery}
          router={{ push: route => contextRoutesPushed.push(route) }}
          updateSearchKeywords={updateKeywords}
          updateField={updateField}
        />,
        { store: mockStore }).find('Search');

      mock = new MockAdapter(axios);
      mock
        .onGet(new RegExp(`${appConfig.baseUrl}/api\\?q=.*`))
        .reply(200, { searchResults: [] })
        .onAny()
        .reply(500);
    });

    after(() => {
      mock.restore();
      // updateKeywords.restore();
      // updateField.restore();
    });

    afterEach(() => {
      contextRoutesPushed = [];
    });

    it.only('should submit the input entered when clicking the submit button', (done) => {
      expect(component.props().searchKeywords).to.equal('');
      
      component.find('input').at(0).simulate('change', { target: { value: 'Dune' } });
      component.find('button').at(0).simulate('click');
      setTimeout(() => {
        // console.log("DIEGO", updateKeywords.getCall(0).args)
        expect(updateKeywords.called).to.equal(true);
        done();
      }, 1000);
    });

    it('should submit the input entered when pressing enter', () => {
      component.find('input').at(0).simulate('change', { target: { value: 'Dune' } });
      expect(component.props().searchKeywords).to.equal('Dune');
      component.find('input').at(0).simulate('change', { target: { value: 'Harry Potter' } });
      component.find('button').at(0).simulate('submit');
      expect(component.props().searchKeywords).to.equal('Harry Potter');
    });
  });
});
