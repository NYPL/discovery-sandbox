import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';
import { spy } from 'sinon';
import LinkableField from '../../src/app/components/BibPage/components/LinkableField';
import { isEmpty } from '../../src/app/utils/utils';

describe('Linkable Field ', () => {
  describe('Nullable', () => {
    it('should return NULL if invalid props', () => {
      const component = mount(<LinkableField />);

      expect(component.isEmptyRender()).to.equal(true);
      expect(isEmpty(component.props())).to.equal(true);

      component.setProps({ displayText: 'display me' });
      expect(component.isEmptyRender()).to.equal(true);
      expect(component.props()).to.include({ displayText: 'display me' });
      expect(!isEmpty(component.props())).to.equal(true);

      component.setProps({ field: 'contributor' });
      expect(component.isEmptyRender()).to.equal(true);
      expect(!isEmpty(component.props())).to.equal(true);
      expect(component.props()).to.include({ field: 'contributor' });

      component.setProps({ label: 'Contributor' });
      expect(component.isEmptyRender()).to.equal(true);
      expect(component.props()).to.include({ label: 'Contributor' });
      expect(!isEmpty(component.props())).to.equal(true);

      component.setProps({ searchQuery: 'Me & You' });
      expect(component.isEmptyRender()).to.equal(false);
      expect(component.props()).to.include({ searchQuery: 'Me & You' });
      expect(!isEmpty(component.props())).to.equal(true);

      component.setProps({ searchQuery: undefined, url: 'go here' });
      expect(component.isEmptyRender()).to.equal(false);
      expect(component.props()).to.include({ url: 'go here' });
      expect(!isEmpty(component.props())).to.equal(true);
    });
  });

  describe('Renderable', () => {
    describe('Display', () => {
      const component = mount(
        <LinkableField
          displayText='display me'
          field='contributor'
          label='Contributor'
          searchQuery='search me'
        />,
      );

      it('Should display the provided value', () => {
        expect(component.text()).to.equal('display me');
      });
    });

    describe('Link', () => {
      it('should return a React Router Link component', () => {
        const component = shallow(
          <LinkableField
            displayText='display me'
            field='contributor'
            label='Contributor'
            searchQuery='search me'
          />,
        );

        expect(component.isEmptyRender()).to.equal(false);
        expect(component.find(Link).length).to.equal(1);
        expect(component.find(Link).type().displayName).to.equal('Link');
      });

      describe('With No URL', () => {
        const component = shallow(
          <LinkableField
            displayText='display me'
            field='contributor'
            label='Contributor'
            searchQuery='search me'
          />,
        );

        it('should receive "to" prop with searchQuery', () => {
          const props = component.find(Link).props();
          expect(!isEmpty(props)).to.equal(true);
          expect(props).to.include({
            to: '/research/research-catalog/search?filters[contributor]=search%20me',
          });
        });

        it('should receive undefined for the target prop', () => {
          const props = component.find(Link).props();
          expect(!isEmpty(props)).to.equal(true);
          expect(props).to.include({
            target: undefined,
          });
        });
      });

      describe('With URL', () => {
        const component = shallow(
          <LinkableField
            displayText='display me'
            field='contributor'
            label='Contributor'
            searchQuery='search me'
            url='Go Here'
          />,
        );

        it('should receive the URL string for the "to" prop', () => {
          const props = component.find(Link).props();
          expect(!isEmpty(props)).to.equal(true);
          expect(props).to.include({
            to: 'Go Here',
          });
        });

        it('should receive "_blank" as the target ', () => {
          const props = component.find(Link).props();
          expect(!isEmpty(props)).to.equal(true);
          expect(props).to.include({
            target: '_blank',
          });
        });
      });
    });

    describe('Click', () => {
      const onClick = spy((event) => {
        event.preventDefault();
      });

      const component = mount(
        <LinkableField
          displayText='display me'
          field='contributor'
          label='Contributor'
          searchQuery='search me'
          onClick={onClick}
        />,
      );
      it('should be handled by the click handler');

      it('should use the onClick prop if no url', () => {
        const link = component.find(Link);
        const props = link.props();
        expect(!isEmpty(props)).to.equal(true);
        expect(props.onClick).to.exist;

        // component.find('a').simulate('click');
        // expect(onClick.called).to.equal(true);
      });

      it('should not use the onClick prop if url');
      it('should not use the onClick prop if no onClick');
      it('should send the label and display text to tracking');
    });

    describe('Encoding', () => {
      it('should url encode & and + symbols in linkable field values', () => {
        const component = shallow(
          <LinkableField
            displayText='&&++'
            field='contributor'
            label='contributor'
            searchQuery='&&++'
          />,
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
