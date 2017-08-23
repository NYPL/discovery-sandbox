/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import HoldConfirmation from './../../src/app/components/HoldConfirmation/HoldConfirmation.jsx';
import Actions from './../../src/app/actions/Actions.js';

describe('HoldConfirmation', () => {
  describe('After being rendered, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
        searchKeywords: 'Bryant',
      },
    };

    before(() => {
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should check if the patron is logged in.', () => {
      expect(requireUser.calledOnce).to.equal(true);
    });
  });

  describe('If the patron is not logged in, <HoldConfirmation>', () => {
    let component;
    let requireUser;
    const location = {
      query: {
        pickupLocation: 'myr',
        searchKeywords: 'Bryant',
      },
    };

    before(() => {
      requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
      component = mount(<HoldConfirmation location={location} />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should redirect the patron to OAuth log in page.', () => {
      expect(requireUser.returnValues[0]).to.equal(false);
    });
  });

  describe('If the patron is logged in but the App doesn\'t get valid data,<HoldConfirmation>',
    () => {
      let component;
      let requireUser;
      const location = {
        query: {
          pickupLocation: 'myr',
          searchKeywords: 'Bryant',
        },
      };

      before(() => {
        Actions.updatePatronData({
          id: '6677200',
          names: ['Leonard, Mike'],
          barcodes: ['162402680435300'],
        });
        requireUser = sinon.spy(HoldConfirmation.prototype, 'requireUser');
        component = mount(<HoldConfirmation location={location} />);
      });

      after(() => {
        requireUser.restore();
        component.unmount();
      });

      it('should pass the patron data check in requireUser().', () => {
        expect(requireUser.returnValues[0]).to.equal(true);
      });

      it('should display the layout of error page.', () => {

      });
    }
  );

  describe('If the patron is logged in and the App receives valid data, <HoldConfirmation>', () => {
    it('should display the layout of request confirmation.', () => {

    });

    it('should deliver the item\'s title on the page', () => {

    });

    it('should deliver the link to the patron\'s account page', () => {

    });

    it('should deliver the location information', () => {

    });
  });
});
