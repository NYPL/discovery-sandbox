/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import ElectronicDeliveryForm from './../../src/app/components/ElectronicDelivery/ElectronicDeliveryForm';

describe('ElectronicDeliveryForm', () => {
  describe('default form', () => {
    let component;
    before(() => {
      component = shallow(
        <ElectronicDeliveryForm fromUrl="example.com" />,
      );
    });
    it('should have `pickupLocation` set to `edd`', () => {
      expect(component.find('input').findWhere(n => n.props().name === 'pickupLocation').length).to.equal(1);
    });
  });
});
