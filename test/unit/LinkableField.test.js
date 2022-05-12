import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import LinkableField from '../../src/app/components/BibPage/components/LinkableField';
import { isEmpty } from '../../src/app/utils/utils';

describe('Linkable Field ', () => {
  describe('Nullable', () => {
    it('should return NULL if invalid props', () => {
      const component = mount(<LinkableField />);

      expect(component.isEmptyRender()).to.equal(true);
      expect(isEmpty(component.props())).to.equal(true);

      component.setProps({ value: undefined, field: 'contributor' });
      expect(component.isEmptyRender()).to.equal(true);
      expect(!isEmpty(component.props())).to.equal(true);
      expect(component.props()).to.include({ field: 'contributor' });

      component.setProps({ value: 'display me', field: undefined });
      expect(component.isEmptyRender()).to.equal(true);
      expect(component.props()).to.include({ value: 'display me' });
      expect(!isEmpty(component.props())).to.equal(true);
    });
  });

  describe('Renderable', () => {
    describe('Display', () => {
      it('Should display the provided value', () => {
        const component = mount(
          <LinkableField value='display me 1' field='contributor' />,
        );
        expect(component.text()).to.equal('display me 1');
      });

      it('Should display the value.prefLabel', () => {
        const component = mount(
          <LinkableField
            value={{ prefLabel: 'display me' }}
            field='contributor'
            outbound
          />,
        );

        expect(component.text()).to.equal('display me');
      });

      it('Should display the value.label', () => {
        const component = mount(
          <LinkableField
            value={{ label: 'display me' }}
            field='contributor'
            outbound
          />,
        );

        expect(component.text()).to.equal('display me');
      });

      it('Should display the value.url', () => {
        const component = mount(
          <LinkableField
            value={{ url: 'display me' }}
            field='contributor'
            outbound
          />,
        );

        expect(component.text()).to.equal('display me');
      });
    });

    describe('Link', () => {
      it('should return a React Router Link component', () => {
        const component = shallow(
          <LinkableField value='display me' field='contributor' />,
        );

        expect(component.isEmptyRender()).to.equal(false);
        expect(component.find(Link).length).to.equal(1);
        expect(component.find(Link).type().displayName).to.equal('Link');
      });

      it('should have non outbound props passed to Link');
      it('should have outbound props passed to Link');
    });

    describe('Click', () => {
      it('should be handled by the click handler');
    });

    describe('Encoding', () => {
      it('should url encode & and + symbols in linkable field values', () => {
        const component = shallow(
          <LinkableField value='&&++' field='contributor' />,
        );
        const link = component.find('Link');
        const { to } = link.props();
        expect(to).to.not.include('&');
        expect(to).to.not.include('+');
        expect(to).to.include('%26%26%2B%2B');
      });

      it('should url encode & and + symbols in linkable field values that are objects', () => {
        const fakeBib = { '@id': '&&++' };
        const component = shallow(
          <LinkableField value={fakeBib} field='contributor' />,
        );
        const link = component.find('Link');
        const { to } = link.props();
        expect(to).to.not.include('&');
        expect(to).to.not.include('+');
        expect(to).to.include('%26%26%2B%2B');
      });
    });
  });
});
