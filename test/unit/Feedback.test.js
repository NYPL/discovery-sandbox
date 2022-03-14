/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import nock from 'nock';
import appConfig from '../../src/app/data/appConfig';

import Feedback from './../../src/app/components/Feedback/Feedback';

describe('Feedback', () => {
  let component;
  const onSubmitFormSpy = spy(Feedback.prototype, 'onSubmitForm');
  before(() => {
    component = mount(<Feedback />);
  });
  after(() => {
    onSubmitFormSpy.restore();
  });

  it('should render a <div> with class .feedback', () => {
    expect(component.find('.feedback')).to.have.length(1);
  });

  it('should have initial state', () => {
    const initialState = component.state();
    expect(initialState.showForm).to.equal(false);
    expect(initialState.success).to.equal(false);
  });

  it('should render a ds <button> with text "Help & Feedback"', () => {
    expect(component.find('Button').first().text()).to.equal('Help & Feedback');
  });

  it('in closed state does not have .active on #feedback-menu', () => {
    expect(component.find('#feedback-menu').hasClass('active')).to.equal(false);
  });

  it('should change showForm state on click and add .active class to #feedback-menu', () => {
    component.find('Button').first().simulate('click');
    expect(component.state().showForm).to.equal(true);
    expect(component.find('#feedback-menu').hasClass('active')).to.equal(true);
  });

  it('should have a "Cancel" button', () => {
    const cancelButton = component.find('Button').at(1);
    expect(cancelButton.text()).to.equal('Cancel');
    expect(cancelButton.props().type).to.equal('reset');
  });

  it('should deactivate form when "Cancel" button is clicked', () => {
    const cancelButton = component.find('Button').at(1).find('button').first();
    cancelButton.simulate('click');
    expect(onSubmitFormSpy.notCalled).to.equal(true);
  });

  it('should have a "Submit" button', () => {
    const submitButton = component.find('Button').at(2);
    expect(submitButton.text()).to.equal('Submit');
    expect(submitButton.props().type).to.equal('submit');
  });

  it('should show an error if attempting to submit nothing', () => {
    const submitButton = component.find('Button').at(2);
    submitButton.simulate('click');
    const form = component.find('form');
    form.simulate('submit');
    expect(component.html()).to.include('Please fill out this field');
  });

  describe('entering text', () => {
    it('should record text typed into form', () => {
      const textarea = component.find('textarea');
      textarea.instance().value = 'Test text';
      textarea.simulate('change');
      expect(textarea.text()).to.equal('Test text');
    });
  });

  describe('submitting form', () => {
    let savedBaseUrl;
    let savedSetState;

    const setUp = (resolve) => {
      return new Promise(() => {
        component = mount(<Feedback />);
        const textarea = component.find('textarea');
        textarea.instance().value = 'Test text';
        textarea.simulate('change');

        const submitButton = component.find('Button').at(2).find('button');
        submitButton.simulate('submit');
        component.update();
        resolve();
      });
    };

    after(() => {
      appConfig.baseUrl = savedBaseUrl;
    });

    it('should submit form when submit is pressed', () => {
      savedBaseUrl = appConfig.baseUrl;
      appConfig.baseUrl = 'http://test-server.com';
      component = mount(<Feedback />);
      const textarea = component.find('textarea');
      textarea.instance().value = 'Test text';
      textarea.simulate('change');

      return new Promise((resolve) => {
        savedSetState = component
          .instance()
          .setState.bind(component.instance());
        component.instance().setState = (...args) => {
          savedSetState(...args, () => {
            resolve();
          });
        };

        nock('http://test-server.com')
          .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',
          })
          .post(/\/api\/feedback/)
          .reply(200, () => {});

        const submitButton = component.find('Button').at(2).find('button');
        submitButton.simulate('submit');
      }).then(() => {
        expect(nock.isDone()).to.equal(true);
      });
    });

    it('should not show We are here to help message or form', () => {
      setUp().then(() => {
        const form = component.find('form');
        const message = component.html();
        expect(form.length).to.equal(0);
        expect(message).not.to.include('We are here to help');
      });
    });

    it('should show thank you message', () => {
      setUp().then(() => {
        const ptag = component.find('p');
        const expectedText =
          'Thank you for submitting your comments. ' +
          'If you requested a response, our service staff ' +
          'will get back to you as soon as possible.';
        expect(ptag.text()).to.equal(expectedText);
      });
    });
  });

  describe('handling form failure in case of response with errors', () => {
    component = mount(<Feedback />);
    const textarea = component.find('textarea');
    textarea.instance().value = 'Test text';
    textarea.simulate('change');
    const submitButton = component.find('Button').at(2);
    const originalError = console.error;
    let erroredCorrectly = false;

    let savedBaseUrl;

    after(() => {
      appConfig.baseUrl = savedBaseUrl;
      console.error = originalError;
    });

    it('should log the error', () => {
      savedBaseUrl = appConfig.baseUrl;
      appConfig.baseUrl = 'http://test-server.com';

      return new Promise((resolve) => {
        console.error = (...args) => {
          originalError(...args);
          if (args.includes('errorText')) {
            erroredCorrectly = true;
            resolve();
          }
        };
        nock('http://test-server.com')
          .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',
          })
          .post(/\/api\/feedback/)
          .reply(200, () => {
            return { error: 'errorText' };
          });

        submitButton.simulate('submit');
      }).then(() => {
        expect(erroredCorrectly).to.equal(true);
      });
    });
  });

  describe('handling form failure in case of response with error status', () => {
    component = mount(<Feedback />);
    const textarea = component.find('textarea');
    textarea.instance().value = 'Test text';
    textarea.simulate('change');
    const submitButton = component.find('Button').at(2);
    const originalLog = console.log;
    let loggedCorrectly = false;

    let savedBaseUrl;

    after(() => {
      appConfig.baseUrl = savedBaseUrl;
      console.log = originalLog;
    });

    it('should log the error', () => {
      savedBaseUrl = appConfig.baseUrl;
      appConfig.baseUrl = 'http://test-server.com';

      return new Promise((resolve) => {
        console.log = (...args) => {
          originalLog(...args);
          if (args.includes('Feedback error')) {
            loggedCorrectly = true;
            resolve();
          }
        };
        nock('http://test-server.com')
          .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',
          })
          .post(/\/api\/feedback/)
          .reply(500, () => {
            return { error: 'errorText' };
          });

        submitButton.simulate('submit');
      }).then(() => {
        expect(loggedCorrectly).to.equal(true);
      });
    });
  });

  describe('success screen', () => {
    before(() => {
      component.setState({ success: true });
    });

    it('should render a <p>', () => {
      const successP = component.find('p');
      expect(successP).to.have.length(1);
      expect(successP.text()).to.equal(
        'Thank you for submitting your comments. If you requested a response, our service staff will get back to you as soon as possible.',
      );
    });
  });
});
