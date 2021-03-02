/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { mock } from 'sinon';
import { mountTestRender, makeTestStore } from '../helpers/store';

import ElectronicDeliveryForm from './../../src/app/components/ElectronicDeliveryForm/ElectronicDeliveryForm';
import ElectronicDelivery from './../../src/app/pages/ElectronicDelivery';
import appConfig from './../../src/app/data/appConfig';

describe('ElectronicDeliveryForm', () => {
  describe('default form', () => {
    let component;
    let appConfigMock;
    before(() => {
      appConfigMock = mock(appConfig);
      appConfig.features = [];
      appConfig.eddAboutUrl.default = 'example.com/edd-default-url';
      component = shallow(
        <ElectronicDeliveryForm fromUrl="example.com" />,
      );
    });
    after(() => {
      appConfigMock.restore();
    });
    it('should have `pickupLocation` set to `edd`', () => {
      expect(component.find('input').findWhere(n => n.props().name === 'pickupLocation').length).to.equal(1);
    });
    it('should have default EDD about URL', () => {
      expect(component.find('a').first().prop('href')).to.equal('example.com/edd-default-url');
    });
  });
  describe('with "on-site-edd" feature flag', () => {
    let component;
    let appConfigMock;
    before(() => {
      appConfigMock = mock(appConfig);
      appConfigMock.object.features = ['on-site-edd'];
      appConfigMock.object.eddAboutUrl = {
        onSiteEdd: 'example.com/scan-and-deliver',
      };
      const store = makeTestStore({ appConfig: appConfigMock.object });
      component = mountTestRender(
        <ElectronicDelivery
          params={{ bibId: 'book1' }}
          location={{
            query: '',
          }}
        />,
        { store, attachTo: document.body },
      );
    });
    after(() => {
      appConfigMock.restore();
      component.unmount();
    });
    it('should have "Scan & Deliver" EDD about URL', () => {
      const form = component.find('ElectronicDeliveryForm');
      expect(form.find('a').first().prop('href')).to.equal('example.com/scan-and-deliver');
    });
  });
});
