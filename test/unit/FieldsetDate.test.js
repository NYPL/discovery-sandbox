/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import FieldsetDate from '../../src/app/components/Filters/FieldsetDate';
import Actions from './../../src/app/actions/Actions.js';

describe('FieldsetDate', () => {
  describe('Default', () => {
    const selectedFacets = {
      language: ['lang:fr', 'lang:sp'],
    };
    let component;

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
    });

    after(() => {
      component.unmount();
    });

    it('should render a fieldset.', () => {
      expect(component.find('fieldset').length).to.equal(1);
    });

    it('should render a legend with text Date.', () => {
      expect(component.find('legend').length).to.equal(1);
      expect(component.find('legend').text()).to.equal('Date');
    });

    it('should have inputs and labels for start year and end year.', () => {
      const container = component.find('#input-container');

      expect(container.find('label').length).to.equal(2);

      expect(container.find('label').at(0).text()).to.equal('Start Year');
      expect(container.find('label').at(0).find('input').length).to.equal(1);
      expect(container.find('label').at(0).find('input').props().type).to.equal('text');
      expect(container.find('label').at(0).props().id).to.equal('startDate-label');
      expect(container.find('label').at(0).find('input').props()['aria-labelledby']).to.equal(
        'startDate-label dateInput-status'
      );

      expect(container.find('label').at(1).text()).to.equal('End Year');
      expect(container.find('label').at(1).find('input').length).to.equal(1);
      expect(container.find('label').at(1).find('input').props().type).to.equal('text');
      expect(container.find('label').at(1).props().id).to.equal('endDate-label');
      expect(container.find('label').at(1).find('input').props()['aria-labelledby']).to.equal(
        'endDate-label dateInput-status'
      );
    });

    it('should have the default state of dateAfter and dateBefore of "0".', () => {
      expect(component.state('dateAfter')).to.equal('0');
      expect(component.state('dateBefore')).to.equal('0');
    });

    it('should have the default state of selectedFacets as the props passed.', () => {
      expect(component.state('selectedFacets')).to.equal(selectedFacets);
    });

    it('should render no error messages', () => {
      expect(component.find('#dateInput-status').text()).to.equal('');
    });
  });

  describe('If entering dates', () => {
    let component;
    let updateSelectedFacets;
    const selectedFacets = {
      language: ['lang:fr', 'lang:sp'],
    };
    const calledWithStartDateValues = {
      language: ['lang:fr', 'lang:sp'],
      dateAfter: '2001',
    };
    const calledWithEndDateValues = {
      language: ['lang:fr', 'lang:sp'],
      dateAfter: '2001',
      dateBefore: '2100',
    };

    // As we use the module 'react-number-format' to build the input fields in FieldsetDate,
    // it needs this specific function to simulate changes for those input fields.
    // The function is referenced from the tests of the module itself.
    // See node_modules/react-number-format/test/test_utils.js
    const getCustomEvent = (value, name) => {
      let event = new Event('custom');
      const el = document.createElement('input');

      event = Object.assign({}, event, { target: el, persist: () => {} });
      event.target = el;
      el.value = value;
      el.name = name;
      return event;
    };

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
      updateSelectedFacets = sinon.spy(Actions, 'updateSelectedFacets');
    });

    afterEach(() => {
      updateSelectedFacets.reset();
    });

    after(() => {
      updateSelectedFacets.restore();
      component.unmount();
    });

    it('should update selectedFacets based on it\'s input from Start Year input.', () => {
      const startYearInput = component.find('#input-container').find('label').at(0).find('input');

      startYearInput.simulate('change', getCustomEvent(2001, 'start-date'));

      expect(component.state('dateAfter')).to.equal('2001');
      expect(updateSelectedFacets.calledOnce).to.equal(true);
      expect(component.state('selectedFacets')).to.deep.equal(calledWithStartDateValues);
    });

    it('should update selectedFacets based on it\'s input from End Year input.', () => {
      const endYearInput = component.find('#input-container').find('label').at(1).find('input');

      endYearInput.simulate('change', getCustomEvent(2100, 'end-date'));

      expect(component.state('dateBefore')).to.equal('2100');
      expect(updateSelectedFacets.calledOnce).to.equal(true);
      expect(component.state('selectedFacets')).to.deep.equal(calledWithEndDateValues);
    });
  });

  describe('It will show the error message', () => {
    const selectedFacets = {
      language: ['lang:fr', 'lang:sp'],
    };
    let component;

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
    });

    after(() => {
      component.unmount();
    });

    it('should show the error message if dateBefore is earlier than dateAfter', () => {
      component.setState({ dateAfter: '2100', dateBefore: '2001' });

      expect(component.find('#dateInput-status').text()).to.equal(
        'end year should be later than start year.'
      );
    });
  });
});
