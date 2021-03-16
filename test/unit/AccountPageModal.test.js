/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
/* global window */
import React from 'react';

import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
// import {
//   Button,
//   Card,
// } from '@nypl/design-system-react-components';

import AccountPageModal from './../../src/app/components/AccountPageModal/AccountPageModal';

describe('AccountPageModal', () => {
  describe('When more than 3 minutes remain', () => {
    const callRecord = [];
    let component;
    let sandbox;
    let clock;

    before(() => {
      sandbox = sinon.sandbox.create();
      clock = sinon.useFakeTimers();

      window.location = { replace: () => {} };
      global.document.cookie = 'accountPageExp=1615496302599';
      sandbox.stub(window.location, 'replace').callsFake(() => { callRecord.push({ replace: true }); });
      sandbox.stub(global, 'setTimeout').callsFake((fn, timeout) => {
        callRecord.push({ setTimeout: timeout });
        fn();
      });
      sandbox.stub(React, 'useState').callsFake((arg) => {
        global.update = arg;
        return [
          global.update,
          (setUpdateArg) => {
            callRecord.push({ setUpdate: setUpdateArg });
          },
        ];
      });

      component = mount(
        <AccountPageModal
          stayLoggedIn={() => {}}
          baseUrl="fakeBaseUrl"
        />,
      );
    });

    it('should set a timeout to update in 1 second', () => {
      expect(callRecord.some(call => call.setTimeout === 1000)).to.equal(true);
      expect(callRecord.some(call => call.setUpdate === true)).to.equal(true);
    });

    it('should not trigger a logout', () => {
      expect(callRecord.some(call => call.replace)).to.equal(false);
    });

    it('should render null', () => {
      expect(component.instance()).to.equal(null);
    });

    after(() => {
      sandbox.restore();
      clock.restore();
    });
  });

  describe('when between 0 and 3 minutes remain', () => {
    const callRecord = [];
    let component;
    let sandbox;

    before(() => {
      sandbox = sinon.sandbox.create();

      window.location = { replace: () => {} };
      global.document.cookie = `accountPageExp=${((2 * 60) + 3) * 1000}`;
      sandbox.stub(window.location, 'replace').callsFake(() => { callRecord.push({ replace: true }); });
      sandbox.stub(global, 'setTimeout').callsFake((fn, timeout) => {
        callRecord.push({ setTimeout: timeout });
        fn();
      });
      sandbox.stub(Date.prototype, 'getTime').callsFake(function () {
        return this.toString().includes('123000') ? 123000 : 0;
      });
      sandbox.stub(React, 'useState').callsFake((arg) => {
        global.update = arg;
        return [
          global.update,
          (setUpdateArg) => {
            callRecord.push({ setUpdate: setUpdateArg });
          },
        ];
      });

      component = mount(
        <AccountPageModal
          stayLoggedIn={() => {}}
          baseUrl="fakeBaseUrl"
        />,
      );
    });

    it('should set a timeout to update in 1 second', () => {
      expect(callRecord.some(call => call.setTimeout === 1000)).to.equal(true);
      expect(callRecord.some(call => call.setUpdate === true)).to.equal(true);
    });

    it('should not trigger a logout', () => {
      expect(callRecord.some(call => call.replace)).to.equal(false);
    });

    it('should say \'Your session is about to time out\'', () => {
      expect(component.find('Card').text()).to.include('Your session is about to time out');
    });
    it('should display the time', () => {
      expect(component.find('Card').text()).to.include('2:03');
    });
    it('should say \'Do you want to stay logged in\'', () => {
      expect(component.find('Card').text()).to.include('Do you want to stay logged in');
    });
    it('should have a button to log out', () => {
      expect(component.find('Button').at(0).text()).to.equal('Log off');
    });
    it('should have a button to stay logged in', () => {
      expect(component.find('Button').at(1).text()).to.equal('Stay logged in');
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe('when no time left', () => {
    const callRecord = [];
    let component;
    let sandbox;

    before(() => {
      sandbox = sinon.sandbox.create();
      const iframes = global.document.getElementsByTagName('iframe');

      for (let index = iframes.length - 1; index >= 0; index -= 1) {
        iframes[index].parentNode.removeChild(iframes[index]);
      }

      window.location = { replace: () => {} };
      global.document.cookie = 'accountPageExp=;expires=Thu, 01-Jan-1970 00:00:01 GMT;';
      sandbox.stub(window.location, 'replace').callsFake((arg) => { callRecord.push({ replace: arg }); });
      sandbox.stub(global, 'setTimeout').callsFake((fn, timeout) => {
        callRecord.push({ setTimeout: timeout });
        fn();
      });
      sandbox.stub(Date.prototype, 'getTime').callsFake(() => 0);
      sandbox.stub(React, 'useState').callsFake((arg) => {
        global.update = arg;
        return [
          global.update,
          (setUpdateArg) => {
            callRecord.push({ setUpdate: setUpdateArg });
          },
        ];
      });

      component = mount(
        <AccountPageModal
          stayLoggedIn={() => {}}
          baseUrl="fakeBaseUrl"
        />,
      );
    });

    it('should log out and redirect', () => {
      const onload = global.document.getElementsByTagName('iframe')[0].onload;
      expect(!!onload).to.equal(true);
      onload();
      expect(callRecord.some(call => call.replace === 'fakeBaseUrl')).to.equal(true);
    });

    it('should not call update', () => {
      expect(callRecord.some(call => call.setTimeout === 1000)).to.equal(false);
      expect(callRecord.some(call => call.setUpdate === true)).to.equal(false);
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe('Buttons', () => {
    let component;
    let sandbox;
    let stayLoggedIn = false;
    let replace;

    before(() => {
      sandbox = sinon.sandbox.create();
      const iframes = global.document.getElementsByTagName('iframe');

      for (let index = iframes.length - 1; index >= 0; index -= 1) {
        iframes[index].parentNode.removeChild(iframes[index]);
      }

      window.location = { replace: () => {} };
      global.document.cookie = 'accountPageExp=123000;';
      sandbox.stub(window.location, 'replace').callsFake((arg) => { replace = arg; });
      sandbox.stub(global, 'setTimeout').callsFake(() => {});
      sandbox.stub(Date.prototype, 'getTime').callsFake(function() {
        return this.toString().includes('123000') ? 123000 : 0;
      });

      component = mount(
        <AccountPageModal
          stayLoggedIn={() => { stayLoggedIn = true; }}
          baseUrl="fakeBaseUrl"
        />,
      );
    });

    it('should log the user out and redirect if they click log off', () => {
      const logOffButton = component.find('Button').at(0);
      logOffButton.simulate('click');
      const onload = global.document.getElementsByTagName('iframe')[0].onload;
      onload();
      expect(replace).to.equal('fakeBaseUrl');
    });

    it('should call the stayLoggedIn param if they click stay logged in', () => {
      const stayLoggedInButton = component.find('Button').at(1);
      stayLoggedInButton.simulate('click');
      expect(stayLoggedIn).to.equal(true);
    });

    after(() => {
      sandbox.restore();
    });
  });
});
