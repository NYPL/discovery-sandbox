/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { mock } from 'sinon';
import { makeTestStore, mountTestRender } from '../helpers/store';
import ElectronicDeliveryForm from './../../src/app/components/ElectronicDeliveryForm/ElectronicDeliveryForm';
import appConfig from './../../src/app/data/appConfig';
import ElectronicDelivery from './../../src/app/pages/ElectronicDelivery';

describe('ElectronicDeliveryForm', () => {
  describe('default form', () => {
    let component;
    let appConfigMock;

    before(() => {
      appConfigMock = mock(appConfig);
      appConfig.features = [];
      appConfig.eddAboutUrl.default = 'example.com/edd-default-url';
      component = shallow(<ElectronicDeliveryForm fromUrl='example.com' />);
    });

    after(() => {
      appConfigMock.restore();
    });

    it('should have `pickupLocation` set to `edd`', () => {
      expect(
        component
          .find('input')
          .findWhere((n) => n.props().name === 'pickupLocation').length,
      ).to.equal(1);
    });

    it('should have default EDD about URL', () => {
      expect(component.find('a').first().prop('href')).to.equal(
        'example.com/edd-default-url',
      );
    });
  });

  describe('with "on-site-edd" feature flag', () => {
    let component;
    let appConfigMock;

    before(() => {
      appConfigMock = mock(appConfig);
      appConfigMock.object.eddAboutUrl = {
        onSiteEdd: 'example.com/scan-and-deliver',
      };

      const store = makeTestStore({ features: ['on-site-edd'] });

      component = mountTestRender(
        <ElectronicDelivery
          params={{ bibId: 'book1' }}
          location={{
            query: '',
          }}
        />,
        { store },
      );
    });

    after(() => {
      component.unmount();
    });

    it('should have "Scan & Deliver" EDD about URL', () => {
      const form = component.find('ElectronicDeliveryForm');
      expect(form.find('a').first().prop('href')).to.equal(
        'example.com/scan-and-deliver',
      );
    });
  });

  describe('EDD Request Form', () => {
    let component;
    let appConfigMock;

    const state = {
      form: {
        emailAddress: '',
        chapterTitle: 'fake',
        startPage: '1',
        endPage: '1',
      },
    };

    before(() => {
      appConfigMock = mock(appConfig);
      appConfig.features = [];
      appConfig.eddAboutUrl.default = 'example.com/edd-default-url';
      component = mount(
        <ElectronicDeliveryForm
          fromUrl='example.com'
          form={state.form}
          raiseError={() => ({})}
          submitRequest={() => ({})}
        />,
      );
    });

    after(() => {
      appConfigMock.restore();
      sessionStorage.clear();
      // remove callback
      // sessionStorage.itemInsertionCallback = null;
    });

    it('Should not contain storage on load', () => {
      const inputs = component
        .find('input')
        .findWhere((node) => node.props().type === 'text')
        .some((node) => Boolean(node.text()));

      expect(inputs, 'Inputs Contain Values').to.be.false;
      expect(component.state().form, 'Form Has State').to.deep.eq(state.form);
      expect(sessionStorage, 'Session Storage Has Length').to.have.lengthOf(0);
    });

    it('Should have session storage on form input', () => {
      const emailField = component.find('input').at(0);
      expect(emailField.prop('id'), 'Not Email Field').to.eq('emailAddress');
      expect(emailField.prop('value'), 'Email Field Has Value').to.eq('');

      const fake = 'fake@nypl.org';

      emailField.simulate('change', {
        target: { value: fake },
      });

      state.form.emailAddress = fake;

      expect(component.state().form, 'Email Not Set').to.deep.eq(state.form);

      const { formstate } = sessionStorage;
      expect(JSON.parse(formstate), 'No Session Email').to.deep.eq(state.form);
    });

    it('Should not have session storage after form submit', () => {
      component.find('form').simulate('submit');
      expect(sessionStorage, 'Session Storage Has Length').to.have.lengthOf(0);
    });
  });
});
