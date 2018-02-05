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
    it('should not render an open button but an <a> instead', () => {
      const component = shallow(<FilterPopup totalResults={1} />);

      expect(component.state('js')).to.equal(false);
      // These tests will need to be updated when the DOM structure gets updated.
      expect(component.find('a').at(0).prop('className'))
        .to.equal('popup-btn-open nypl-primary-button');
      expect(component.find('a').at(0).prop('href')).to.equal('#popup-no-js');
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
      expect(component.find('button').length).to.equal(6);
      expect(component.find('button').at(0).prop('className'))
        .to.equal('nypl-basic-button clear-filters-button');
      // expect(component.find('button').at(1).prop('name')).to.equal('Clear-Filters');
      expect(component.find('button').at(2).prop('className'))
        .to.equal('nypl-primary-button apply-button');
    });

    it('should not render the "no-js" <a> element', () => {
      expect(component.find('.cancel-no-js').length).to.equal(0);
    });

    // it('should have accessible open button', () => {
    //   const openBtn = component.find('.popup-btn-open');
    //   expect(openBtn.prop('aria-haspopup')).to.equal('true');
    //   expect(openBtn.prop('aria-expanded')).to.equal(null);
    //   expect(openBtn.prop('aria-controls')).to.equal('filter-popup-menu');
    // });

    // it('should have accessible close button', () => {
    //   const openBtn = component.find('.popup-btn-close');
    //   expect(openBtn.prop('aria-expanded')).to.equal(true);
    //   expect(openBtn.prop('aria-controls')).to.equal('filter-popup-menu');
    // });

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

  describe('If clicking "Clear Filters" button', () => {
    const selectedFilters = {
      dateAfter: '2000',
      language: [
        {
          count: 4,
          label: 'German',
          selected: true,
          value: 'lang:ger',
        },
        {
          count: 8,
          label: 'Spainish',
          selected: true,
          value: 'lang:sp',
        },
      ],
      materialType: {
        count: 5,
        label: 'Text',
        selected: true,
        value: 'resourcetypes:txt',
      },
    };
    const emptySelectedFilters = {
      materialType: [],
      language: [],
      dateAfter: '',
      dateBefore: '',
    };
    let component;

    before(() => {
      component = mount(<FilterPopup selectedFilters={selectedFilters} />);
    });

    after(() => {
      component.unmount();
    });

    it('should clear all the selected filters in the state.', () => {
      const clearFiltersButton = component.find('.clear-filters-button').at(0);

      clearFiltersButton.simulate('click');
      expect(component.state('selectedFilters')).to.deep.equal(emptySelectedFilters);
    });
  });

  describe('If submitting with invalid input values', () => {
    const selectedFilters = {
      dateAfter: '2000',
      dateBefore: '1999',
      language: [
        {
          count: 4,
          label: 'German',
          selected: true,
          value: 'lang:ger',
        },
        {
          count: 8,
          label: 'Spainish',
          selected: true,
          value: 'lang:sp',
        },
      ],
      materialType: {
        count: 5,
        label: 'Text',
        selected: true,
        value: 'resourcetypes:txt',
      },
    };
    let component;

    beforeEach(() => {
      component = mount(<FilterPopup selectedFilters={selectedFilters} />);
    });

    afterEach(() => {
      component.unmount();
    });

    after(() => {
      component.unmount();
    });

    it('should stop submitting and the function of submitting returns false', () => {
      const submitFormButton = component.find('.apply-button').at(0);

      expect(component.find('.nypl-form-error').length).to.equal(0);

      submitFormButton.simulate('click');
      expect(component.state('raisedErrors')).to.deep.equal([{ name: 'date', value: 'Date' }]);
      expect(component.find('.nypl-form-error').length).to.equal(1);
    });

    it('should render a div for error messages', () => {
      const submitFormButton = component.find('.apply-button').at(0);

      expect(component.find('.nypl-form-error').length).to.equal(0);

      submitFormButton.simulate('click');
      expect(component.find('.nypl-form-error').length).to.equal(1);
    });
  });
});
