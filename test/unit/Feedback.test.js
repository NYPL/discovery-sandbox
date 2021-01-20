/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Feedback from './../../src/app/components/Feedback/Feedback';

describe('Feedback', () => {
  let component;
  before(() => {
    component = mount(<Feedback />);
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

  it('closed state does not have .active on #feedback-menu', () => {
    expect(component.find('#feedback-menu').hasClass('active')).to.equal(false);
  });

  it('should change showForm state on click and add .active class to #feedback-menu', () => {
    component.find('Button').first().simulate('click');
    expect(component.state().showForm).to.equal(true);
    expect(component.find('#feedback-menu').hasClass('active')).to.equal(true);
  });

  describe('success screen', () => {
    before(() => {
      component.setState({ success: true });
    });

    it('should render a <p>', () => {
      const successP = component.find('p');
      expect(successP).to.have.length(1);
      expect(successP.text()).to.equal('Thank you for submitting your comments, if you requested a response, our service staff will get back to you as soon as possible.');
    });
  });
});
