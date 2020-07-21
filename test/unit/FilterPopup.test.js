/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { mock } from 'sinon';

import FilterPopup from '../../src/app/components/FilterPopup/FilterPopup';
import appConfig from '../../src/app/data/appConfig';

describe('FilterPopup', () => {
  describe('Default - no javascript', () => {
    // Since this is a shallow render, the component itself is not mounted. The `js` flag
    // becomes true when the component is mounted on the client-side so we know that
    // javascript is enabled.
    it('should not render an open button but an <a> instead', () => {
      const component = shallow(
        <FilterPopup totalResults={1} />, { disableLifecycleMethods: true }
      );

      expect(component.state('js')).to.equal(false);
      // These tests will need to be updated when the DOM structure gets updated.
      expect(component.find('a').at(0).prop('className'))
        .to.equal('popup-btn-open nypl-primary-button');
      expect(component.find('a').at(0).prop('href')).to.equal('#popup-no-js');
    });

    it('should not have specific "no-js" id and class', () => {
      const component = shallow(<FilterPopup />, { disableLifecycleMethods: true });

      expect(component.state('js')).to.equal(false);
      expect(component.find('#popup-no-js').length).to.equal(0);
      expect(component.find('.popup-no-js').length).to.equal(0);
    });

    it('should have specific "no-js" id and class', () => {
      const component = shallow(<FilterPopup />, { disableLifecycleMethods: true });
      component.setState({ showForm: true });

      expect(component.state('js')).to.equal(false);
      expect(component.find('#popup-no-js').length).to.equal(1);
      expect(component.find('.popup-no-js').length).to.equal(1);
    });
  });

  describe('Default', () => {
    let component;

    before(() => {
      component = mount(<FilterPopup totalResults={1} />);
    });

    it('should have a .filter-container class for the wrapper', () => {
      expect(component.find('.filter-container').length).to.equal(1);
    });

    it('should not render open/close buttons', () => {
      expect(component.state('js')).to.equal(true);
      // All buttons should be rendered
      expect(component.find('button').length).to.equal(1);
      expect(component.find('button').at(0).prop('className'))
        .to.equal('popup-btn-open nypl-primary-button');
      // expect(component.find('button').at(1).prop('name')).to.equal('Clear-Filters');
      // expect(component.find('button').at(2).prop('className'))
      //   .to.equal('nypl-primary-button cancel-button');
    });

    it('should not render the "no-js" <a> element', () => {
      expect(component.find('.cancel-no-js').length).to.equal(0);
    });

    it('should have accessible open button', () => {
      const openBtn = component.find('.popup-btn-open');
      expect(openBtn.prop('aria-haspopup')).to.equal('true');
      expect(openBtn.prop('aria-expanded')).to.equal(null);
      expect(openBtn.prop('aria-controls')).to.equal('filter-popup-menu');
    });

    it('should have accessible close button', () => {
      component.setState({ showForm: true });
      const cancelBtn = component.find('.cancel-button');

      expect(cancelBtn.length).to.equal(2);
      expect(cancelBtn.at(0).prop('aria-expanded')).to.equal(false);
      expect(cancelBtn.at(0).prop('aria-controls')).to.equal('filter-popup-menu');
    });

    it('should not have specific "no-js" id and class', () => {
      expect(component.state('js')).to.equal(true);
      expect(component.find('#popup-no-js').length).to.equal(0);
      expect(component.find('.popup-no-js').length).to.equal(0);
    });

    it('should not have a form', () => {
      component.setState({ showForm: false });
      expect(component.find('form').length).to.equal(0);
    });

    it('should have a form', () => {
      component.setState({ showForm: true });
      expect(component.find('form').length).to.equal(1);
      expect(component.find('form').prop('method')).to.equal('POST');
    });
  });

  describe('Open/close the popup', () => {
    let component;

    before(() => {
      component = mount(<FilterPopup />);
    });

    it('should not be rendered at first', () => {
      expect(component.find('.popup-container').length).to.equal(0);
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
      subjectLiteral: [],
      dateAfter: '',
      dateBefore: '',
    };

    const context = {
      router: [],
    };

    let component;

    before(() => {
      component = mount(<FilterPopup selectedFilters={selectedFilters} />, { context });
    });

    after(() => {
      component.unmount();
    });

    it('should clear all the selected filters in the state.', () => {
      component.setState({ showForm: true });
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
      component.setState({ showForm: true });
    });

    afterEach(() => {
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

  describe('DRBB integration', () => {
    let component;
    let appConfigMock;
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

    before(() => {
      appConfigMock = mock(appConfig);
    });

    after(() => {
      appConfigMock.restore();
    });

    describe('without integration', () => {
      before(() => {
        appConfig.includeDrbb = false;
        component = mount(<FilterPopup selectedFilters={selectedFilters} />);
      });

      it('should not have any components with .drbb-integration class', () => {
        expect(component.find('.drbb-integration')).to.have.length(0);
      });
    });

    describe('with integration', () => {
      before(() => {
        appConfig.includeDrbb = true;
        component = mount(<FilterPopup selectedFilters={selectedFilters} />);
      });

      it('should have components with .drbb-integration class', () => {
        expect(component.find('.drbb-integration')).to.have.length(1);
      });
    });
  });
});
