/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import nock from 'nock';
import appConfig from '../../src/app/data/appConfig';

import Feedback from '../../src/app/components/Feedback/Feedback';
import { FeedbackBoxProvider } from '../../src/app/context/FeedbackContext'

// test correct url, data is being passed
// call number is displayed (?)

describe('Feedback', () => {
  const FeedbackWithContext =
    <FeedbackBoxProvider>
      <Feedback />
    </FeedbackBoxProvider>
  describe('submitting form', () => {
    let savedBaseUrl;
    let savedSetState;

    after(() => {
      appConfig.baseUrl = savedBaseUrl;
    });

    it('should submit form when submit is pressed', () => {
      savedBaseUrl = appConfig.baseUrl;
      appConfig.baseUrl = 'http://test-server.com';
      component = mount(<Feedback />);

      return new Promise((resolve) => {
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
    it('should send item metadata, email, comment', () => {

    })
  });

  describe('handling form failure in case of response with errors', () => {
    component = mount(<Feedback />);
    const textarea = component.find('textarea');
    textarea.instance().value = 'Test text';
    textarea.simulate('change');
    const submitButton = component.find('button').at(2);
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
    const submitButton = component.find('button').at(2);
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

});

// capture response 
