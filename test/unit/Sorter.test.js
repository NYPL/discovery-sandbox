/* eslint-env mocha */
import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import axios from 'axios';
import sinon from 'sinon';

import { basicQuery } from '../../src/app/utils/utils';
import Sorter from '../../src/app/components/Sorter/Sorter';
import appConfig from '../../appConfig';

Enzyme.configure({ adapter: new Adapter() });
describe('Sorter', () => {
  describe('Default - no javascript', () => {
    // Since this is a shallow render, the component itself is not mounted. The `js` flag
    // becomes true when the component is mounted on the client-side so we know that
    // javascript is enabled.
    it('should not render an input submit element', () => {
      const component = shallow(<Sorter />);

      expect(component.state('js')).to.equal(false);
      expect(component.find('input').length).to.equal(1);
      expect(component.find('input').prop('type')).to.equal('submit');
    });
  });

  describe('Default', () => {
    let component;

    before(() => {
      component = mount(<Sorter />);
    });

    it('should have default state', () => {
      expect(component.state('sortValue')).to.equal('relevance');
      // Above suite tests for the default false since this one is the mounted component.
      expect(component.state('js')).to.equal(true);
    });

    it('should return a wrapper div and class nypl-results-sorting-controls', () => {
      expect(component.find('.nypl-results-sorting-controls').length).to.equal(1);
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
    });

    it('should render a label for the select element', () => {
      expect(component.find('label').length).to.equal(1);
      expect(component.find('label').prop('htmlFor')).to.equal('sort-by-label');
      expect(component.find('#sort-by-label').length).to.equal(1);
    });

    it('should render five option elements', () => {
      expect(component.find('option').length).to.equal(5);
    });

    it('should have relevance as the default selected option', () => {
      expect(component.find('select').prop('value')).to.equal('relevance');
    });

    it('should not render an input submit element', () => {
      expect(component.find('input').length).to.equal(0);
    });
  });

  describe('With bad sortBy and searchKeywords props', () => {
    let component;

    before(() => {
      const sortBy = 'some_other_value';
      component = mount(<Sorter sortBy={sortBy} />);
    });

    it('should not be able to find the sortBy prop but still render the default label', () => {
      expect(component.state('sortValue')).to.equal('some_other_value');
    });
  });

  describe('With good sortBy and searchKeywords props', () => {
    let component;

    before(() => {
      const searchKeywords = 'harry potter';
      const sortBy = 'title_asc';
      const field = 'title';
      component = mount(<Sorter sortBy={sortBy} searchKeywords={searchKeywords} field={field} />);
    });

    it('should have updated state based on sortBy prop', () => {
      expect(component.find('input').length).to.equal(0);

      expect(component.state('sortValue')).to.equal('title_asc');
    });

    it('should have title as the selected option', () => {
      expect(component.find('select').prop('value')).to.equal('title_asc');
    });

    it('should have the form action point to the endpoint with the passed searchKeywords' +
      ' and field', () => {
      expect(component.find('form').prop('action'))
        .to.equal(`${appConfig.baseUrl}/search?q=harry potter&search_scope=title`);
    });
  });

  describe('Mocking ajax call for the bib', () => {
    describe('Good response', () => {
      let component;
      let createAPIQuery;
      let axiosSpy;
      let mock;

      before(() => {
        createAPIQuery = basicQuery({});
        component = mount(
          <Sorter createAPIQuery={createAPIQuery} updateIsLoadingState={() => {}} />,
          { context: { router: { createHref: () => {}, push: () => {} } } },
        );
        mock = new MockAdapter(axios);
        mock
          .onGet(`${appConfig.baseUrl}/api?q=&sort=title&sort_direction=desc`)
          .reply(200, { searchResults: [] });
      });

      after(() => {
        mock.restore();
        axiosSpy.restore();
      });

      it('should make an ajax request and update the state', () => {
        axiosSpy = sinon.spy(axios, 'get');

        expect(component.state('sortValue')).to.equal('relevance');

        component.find('select').simulate('change', { target: { value: 'title_desc' } });

        expect(axiosSpy.callCount).to.equal(1);
        expect(component.state('sortValue')).to.equal('title_desc');
      });
    });
  });

  describe('Sorter functions', () => {
    let component;
    let createAPIQuery;
    let sortResultsBySpy;
    let mock;
    const updateIsLoadingState = () => {};

    before(() => {
      sortResultsBySpy = sinon.spy(Sorter.prototype, 'sortResultsBy');
      createAPIQuery = basicQuery({});

      component = mount(
        <Sorter createAPIQuery={createAPIQuery} updateIsLoadingState={updateIsLoadingState} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
      mock = new MockAdapter(axios);
      mock
        .onGet(`${appConfig.baseUrl}/api?q=&sort=date&sort_direction=desc`)
        .reply(200, { searchResults: [] });
    });

    after(() => {
      mock.restore();
      sortResultsBySpy.restore();
      component.unmount();
    });

    it('should call sortResultsBy, make an ajax call, and update the state', () => {
      expect(component.state('sortValue')).to.equal('relevance');
      component.find('select').simulate('change', { target: { value: 'date_desc' } });

      expect(sortResultsBySpy.calledOnce).to.equal(true);
      expect(component.state('sortValue')).to.equal('date_desc');
    });
  });
});
