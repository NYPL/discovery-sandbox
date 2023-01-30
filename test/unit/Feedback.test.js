/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { mount } from 'enzyme';
import { stub } from 'sinon';
import appConfig from '../../src/app/data/appConfig';
import axios from 'axios'

import { FeedbackBoxProvider } from '../../src/app/context/FeedbackContext'
import Feedback from '../../src/app/components/Feedback/Feedback';

// Enzyme cannot find the new DS Feedback modal, so these tests will have to wait until we upgrade to jest/react-testing-library

xdescribe('Feedback', () => {
  const FeedbackWithProvider = () => {
    return (
      <FeedbackBoxProvider >
        <Feedback />
      </FeedbackBoxProvider>)
  }
  describe('submitFeedback', () => {
    let savedBaseUrl;
    let savedSetState;
    let component
    let post
    let feedback
    before(() => {
      savedBaseUrl = appConfig.baseUrl;
      appConfig.baseUrl = 'http://test-server.com';
      component = mount(<FeedbackWithProvider />);
      feedback = component.find('Feedback')
      post = stub(axios, 'post')
      // post.onCall(0).returns({ status: 200 })
      // post.onCall(1).returns({ status: 500 })
    })
    after(() => {
      appConfig.baseUrl = savedBaseUrl;
    });

    it('should submit form when submit is pressed', async () => {
      const submitButton = feedback.find('button')
      await submitButton.invoke('onClick')
      expect(post).to.have.been.calledWith(`${appConfig.baseUrl}/api/feedback`, { bibId: '123', itemId: '456', barcode: '666', callNumber: '1999' })
    });
    it('should send item metadata, email, comment', () => {

    })
  });

  // xdescribe('handling form failure in case of response with error status', () => {
  // component = mount(<Feedback />);
  // const textarea = component.find('textarea');
  // textarea.instance().value = 'Test text';
  // textarea.simulate('change');
  // const submitButton = component.find('button').at(2);
  // const originalLog = console.log;
  // let loggedCorrectly = false;


  // let savedBaseUrl;

  // after(() => {
  //   appConfig.baseUrl = savedBaseUrl;
  //   console.log = originalLog;
  // });

  // it('should log the error', () => {
  //   savedBaseUrl = appConfig.baseUrl;
  //   appConfig.baseUrl = 'http://test-server.com';

  //   return new Promise((resolve) => {

  //     console.log = (...args) => {
  //       originalLog(...args);
  //       if (args.includes('Feedback error')) {
  //         loggedCorrectly = true;
  //         resolve();
  //       }
  //     };
  //     nock('http://test-server.com')
  //       .defaultReplyHeaders({
  //         'access-control-allow-origin': '*',
  //         'access-control-allow-credentials': 'true',
  //       })
  //       .post(/\/api\/feedback/)
  //       .reply(500, () => {
  //         return { error: 'errorText' };
  //       });

  //     submitButton.simulate('submit');
  //   }).then(() => {
  //     expect(loggedCorrectly).to.equal(true);
  //   });
  // });
  // });

});
