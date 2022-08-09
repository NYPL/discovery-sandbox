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
import mockedItem from '../fixtures/mocked-item';

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

      const store = makeTestStore({
        features: ['on-site-edd'],
        bib: {
          'title': ['Harry Potter'],
          '@id': 'res:b17688688',
          'items': [{ ...mockedItem[0], eddRequestable: true }],
        },
      });

      component = mountTestRender(
        <ElectronicDelivery
          params={{ bibId: 'book1', itemId: 'i10000003' }}
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
    let itemId = 'abc123';

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
          itemId={itemId}
          raiseError={() => ({})}
          submitRequest={() => ({})}
        />,
      );
    });

    after(() => {
      appConfigMock.restore();
      localStorage.clear();
    });

    it('Should not contain storage on load', () => {
      const inputs = component
        .find('input')
        .findWhere((node) => node.props().type === 'text')
        .some((node) => Boolean(node.text()));

      expect(inputs, 'Inputs Contain Values').to.be.false;
      expect(component.state().form, 'Form Has State').to.deep.eq(state.form);

      const { formstate } = localStorage;
      expect(formstate, 'Local Storage Still Exists').to.be.undefined;
    });

    it('Should have Local storage on form input', () => {
      const emailField = component.find('input').at(0);
      expect(emailField.prop('id'), 'Not Email Field').to.eq('emailAddress');
      expect(emailField.prop('value'), 'Email Field Has Value').to.eq('');

      const fake = 'fake@nypl.org';

      emailField.simulate('change', {
        target: { value: fake },
      });

      state.form.emailAddress = fake;

      expect(component.state().form, 'Email Not Set').to.deep.eq(state.form);

      const { formstate } = localStorage;
      expect(JSON.parse(formstate)[itemId], 'No Local Email').to.deep.eq(
        state.form,
      );
    });

    it('Should retain Local Storage on rerender', () => {
      const { [itemId]: localState } = JSON.parse(localStorage.formstate);
      expect(localState, "Local Storage Doesn't Match").to.deep.eq(state.form);

      component.setProps({ itemId, form: state.form }); // Force Rerender

      const { [itemId]: reLocalState } = JSON.parse(localStorage.formstate);
      expect(reLocalState, "Doesn't Retain Local").to.deep.eq(state.form);
    });

    it('Should not have local storage on new item', () => {
      const { [itemId]: localState } = JSON.parse(localStorage.formstate);
      expect(localState, 'Old Item State Should Match').to.deep.eq(state.form);

      component.unmount();

      itemId = '123abc';
      component.setProps({
        itemId,
        form: { ...state.form, emailAddress: '' },
      });

      const propId = component.props().itemId;
      expect(propId, 'Failed to reset itemId').to.deep.eq(itemId);

      const reLocalState = localStorage.formstate;
      expect(reLocalState, "Shouldn't Retain Local Storage").to.be.undefined;
    });

    it('Should not have Local Storage Form State after form submit', () => {
      const { formstate: initialFormState } = localStorage;
      expect(initialFormState).to.be.undefined;

      const emailField = component.find('input').at(0);
      expect(emailField.prop('id'), 'Not Email Field').to.eq('emailAddress');
      expect(emailField.prop('value'), 'Email Field Has Value').to.eq('');

      const fake = 'fake@nypl.org';
      emailField.simulate('change', {
        target: { value: fake },
      });

      const { [itemId]: localState } = JSON.parse(localStorage.formstate);
      expect(localState).to.deep.eq(state.form);

      component.find('form').simulate('submit');

      const { formstate } = localStorage;
      expect(formstate, 'Form State Still Exists').to.be.undefined;
    });
  });

  describe('EDD unavailable message', () => {
    let appConfigMock;
    let component;

    before(() => {
      appConfigMock = mock(appConfig);
    });
    after(() => {
      appConfigMock.restore();
    });

    it('should render the error message when the item is not eddRequestable', () => {
      const bib = {
        'title': ['Harry Potter'],
        '@id': 'res:b17688688',
        'items': [{ ...mockedItem[0], eddRequestable: false }],
      };
      const store = makeTestStore({
        bib,
      });
      component = mountTestRender(
        <ElectronicDelivery params={{ bibId: 'bibId', itemId: 'i10000003' }} />,
        { store },
      );
      const message = component.find('h2');
      setImmediate(() => {
        expect(message.find('h2')).to.have.length(1);
        expect(
          message.contains(
            <h2 className='nypl-request-form-title'>
              Delivery options for this item are currently unavailable. Please
              try again later or contact 917-ASK-NYPL (
              <a href='tel:917-275-6975'>917-275-6975</a>).
            </h2>,
          ),
        ).to.equal(true);
      });
    });
    it('should render the edd form when the item is eddRequestable', () => {
      const bib = {
        'title': ['Harry Potter'],
        '@id': 'res:b17688688',
        'items': [{ ...mockedItem[0], eddRequestable: true }],
      };
      const store = makeTestStore({
        bib,
      });
      component = mountTestRender(
        <ElectronicDelivery
          location={{ query: 'query' }}
          params={{ bibId: 'bibId', itemId: 'i10000003' }}
        />,
        { store },
      );
      const message = component.find('h2');
      expect(message).to.be.empty;
      const form = component.find('ElectronicDeliveryForm');
      setImmediate(() => {
        expect(form.props().method).to.equal('POST');
      });
    });
  });
});
