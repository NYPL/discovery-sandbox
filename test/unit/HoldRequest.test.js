/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import HoldRequest from './../../src/app/components/HoldRequest/HoldRequest.jsx';
import Actions from './../../src/app/actions/Actions.js';

describe('HoldRequest', () => {
  describe('After being rendered, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should check if the patron is logged in.', () => {
      expect(requireUser.calledOnce).to.equal(true);
    });
  });

  describe('If the patron is not logged in, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should redirect the patron to OAuth log in page.', () => {
      expect(requireUser.returnValues[0]).to.equal(false);
    });

    it('should display log in error message.', () => {
      expect(component.find('.loggedInInstruction').text()).to.equal(
        'Something wrong during retrieving your patron data.'
      );
    });
  });

  describe('If the patron is logged in but the App doesn\'t get valid data, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      Actions.updatePatronData({
        id: '6677200',
        names: ['Leonard, Mike'],
        barcodes: ['162402680435300'],
      });
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should pass the patron data check in requireUser().', () => {
      expect(requireUser.returnValues[0]).to.equal(true);
    });

    it('should deliver the patron\'s name on the page', () => {
      expect(component.find('.loggedInInstruction').find('strong').text())
        .to.equal('Leonard, Mike');
    });

    it('should display the layout of error page.', () => {
      expect(component.find('.item').find('h2').text())
        .to.equal('Something wrong with your request');
    });

    it('should not deliver request button with the respective URL on the page', () => {
      expect(component.find('.place-hold-form').find('button')).to.have.length(0);
    });
  });

  describe('If the patron is logged in and the App receives valid data, <HoldRequest>', () => {
    it('should display the layout of hold request.', () => {

    });

    it('should deliver the patron\'s name on the page', () => {

    });

    it('should deliver request button with the respective URL on the page', () => {

    });
  });
});
