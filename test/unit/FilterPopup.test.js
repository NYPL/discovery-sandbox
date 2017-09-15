/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import FilterPopup from '../../src/app/components/FilterPopup/FilterPopup';

describe('FilterPopup', () => {
  describe('Default - no javascript', () => {
    // Since this is a shallow render, the component itself is not mounted. The `js` flag
    // becomes true when the component is mounted on the client-side so we know that
    // javascript is enabled.
    it('should not render a open/close buttons but <a>s instead', () => {
      const component = shallow(<FilterPopup />);

      expect(component.state('js')).to.equal(false);
      // The Apply and Clear buttons should still be rendered:
      expect(component.find('button').length).to.equal(2);
      // These tests will need to be updated when the DOM structure gets updated.
      // The second <a> element is the no-js 'cancel' element for the "smart" no-js solution.
      expect(component.find('a').at(0).prop('className'))
        .to.equal('popup-btn-open nypl-short-button');
      expect(component.find('a').at(0).prop('href')).to.equal('#popup-no-js');
      expect(component.find('a').at(1).prop('className')).to.equal('cancel-no-js');
      expect(component.find('a').at(2).prop('className'))
        .to.equal('popup-btn-close nypl-x-close-button');
    });

    it('should have specific "no-js" id and class', () => {
      const component = shallow(<FilterPopup />);

      expect(component.state('js')).to.equal(false);
      expect(component.find('#popup-no-js').length).to.equal(1);
      expect(component.find('.popup-no-js').length).to.equal(1);
    });
  });

  describe('Default', () => {
    let component;

    before(() => {
      component = mount(<FilterPopup />);
    });

    it('should have a .filter-container class for the wrapper', () => {
      expect(component.find('.filter-container').length).to.equal(1);
    });

    it('should render open/close buttons', () => {
      expect(component.state('js')).to.equal(true);
      // All buttons should be rendered
      expect(component.find('button').length).to.equal(4);
      expect(component.find('button').at(0).prop('className'))
        .to.equal('popup-btn-open nypl-short-button');
      expect(component.find('button').at(1).prop('name')).to.equal('apply-filters');
      expect(component.find('button').at(2).prop('name')).to.equal('Clear-Filters');
      expect(component.find('button').at(3).prop('className'))
        .to.equal('popup-btn-close nypl-x-close-button');
    });

    it('should not render the "no-js" <a> element', () => {
      expect(component.find('.cancel-no-js').length).to.equal(0);
    });

    it('should have accessible open button', () => {
      const openBtn = component.find('.popup-btn-open');
      expect(openBtn.prop('aria-haspopup')).to.equal('true');
      expect(openBtn.prop('aria-expanded')).to.equal(false);
      expect(openBtn.prop('aria-controls')).to.equal('filter-popup-menu');
    });

    it('should have accessible close button', () => {
      const openBtn = component.find('.popup-btn-close');
      expect(openBtn.prop('aria-expanded')).to.equal(true);
      expect(openBtn.prop('aria-controls')).to.equal('filter-popup-menu');
    });

    it('should not have specific "no-js" id and class', () => {
      expect(component.state('js')).to.equal(true);
      expect(component.find('#popup-no-js').length).to.equal(0);
      expect(component.find('.popup-no-js').length).to.equal(0);
    });

    it('should have a form', () => {
      expect(component.find('form').length).to.equal(1);
      expect(component.find('form').prop('method')).to.equal('POST');
    });
  });

  describe('Open/close the popup', () => {
    let component;

    before(() => {
      component = mount(<FilterPopup />);
    });

    it('should be hidden at first', () => {
      expect(component.find('.popup-container').hasClass('active')).to.equal(false);
    });

    // TODO: Figure out how to get the `FocusTrap` component to work with these tests:
    // it('should display the popup when the open button is clicked', () => {
    //   expect(component.find('.popup-container').hasClass('active')).to.equal(false);
    //   component.find('.popup-btn-open').simulate('click');
    //   expect(component.find('.popup-container').hasClass('active')).to.equal(true);
    // });

    // it('should hide the popup when the close button is clicked', () => {
    //   component.setState({ showForm: true });
    //   expect(component.find('.popup-container').hasClass('active')).to.equal(true);
    //   component.find('.popup-btn-close').simulate('click');
    //   expect(component.find('.popup-container').hasClass('active')).to.equal(false);
    // });
  });
});
