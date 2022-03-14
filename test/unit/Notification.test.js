/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { makeTestStore } from '../helpers/store';

import Notification from './../../src/app/components/Notification/Notification';

describe('Notification', () => {
  const testStore = makeTestStore({
    appConfig: {
      searchResultsNotification: 'Some info about search <a>helpful link</a>',
      holdRequestNotification: 'Some info about holds <a>helpful link</a>',
    },
  });

  const renderComponent = (notificationType) =>
    mount(
      <Provider store={testStore}>
        <Notification notificationType={notificationType} />
      </Provider>,
    );

  describe('notificationType = "searchResultsNotification"', () => {
    let component;
    before(() => {
      component = renderComponent('searchResultsNotification');
    });

    it('should render an aside', () => {
      expect(component.find('aside').length).to.equal(1);
    });

    it('should have an svg', () => {
      expect(component.find('svg').length).to.equal(1);
    });

    it('should render the right notification', () => {
      expect(component.text()).to.include('search');
    });

    it('should render the stringified HTML', () => {
      /*
       * when using `dangerouslySetInnerHTML`
       * `.render()` needs to be used for testing
       */
      expect(component.render().find('a').length).to.equal(1);
    });
  });

  describe('notificationType = "holdRequestNotification"', () => {
    let component;
    before(() => {
      component = renderComponent('holdRequestNotification');
    });

    it('should render the right notification', () => {
      expect(component.text()).to.include('holds');
    });
  });

  describe('type not found in `appConfig`', () => {
    const component = renderComponent('someBadType');
    expect(component.find('aside').length).to.equal(0);
  });
});
