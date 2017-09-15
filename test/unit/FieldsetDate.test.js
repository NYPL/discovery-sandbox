/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import FieldsetDate from '../../src/app/components/Filters/FieldsetDate';
import Actions from './../../src/app/actions/Actions.js';

describe('FieldsetDate', () => {
  describe('Default', () => {
    const selectedFacets = {
      language: ['lang:fr', 'lang:fr'],
    };
    let component;

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
    });

    it('should render a fieldset', () => {
      expect(component.find('fieldset').length).to.equal(1);
    });

    it('should render a legend with text Date', () => {
      expect(component.find('legend').length).to.equal(1);
      expect(component.find('legend').text()).to.equal('Date');
    });

    it('should have an input and label for each list item', () => {
      const container = component.find('#input-container');

      expect(container.find('label').length).to.equal(2);

      expect(container.find('label').at(0).text()).to.equal('Start Year');
      expect(container.find('label').at(0).find('input').length).to.equal(1);
      expect(container.find('label').at(0).find('input').props().type).to.equal('text');
      expect(container.find('label').at(0).find('input').props().maxLength).to.equal('4');

      expect(container.find('label').at(1).text()).to.equal('End Year');
      expect(container.find('label').at(1).find('input').length).to.equal(1);
      expect(container.find('label').at(1).find('input').props().type).to.equal('text');
      expect(container.find('label').at(1).find('input').props().maxLength).to.equal('4');
    });
  });

  describe('It will update the store', () => {
    const selectedFacets = {
      language: ['lang:fr', 'lang:fr'],
    };
    let component;
    let updateSelectedFacets;
    let inputChange;
    const calledWithValues = {
      language: ['lang:fr', 'lang:fr'],
      dateAfter: '',
      dateBefore: '2100',
    };

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
      updateSelectedFacets = sinon.spy(Actions, 'updateSelectedFacets');
      inputChange = sinon.spy(FieldsetDate.prototype, 'inputChange');
    });

    it('should update selectedFacets based on it\'s inputs', () => {
      const startYearInput = component.find('#input-container').find('label').at(0).find('input');
      const endYearInput = component.find('#input-container').find('label').at(1).find('input');

      // startYearInput.simulate('input', {target: {value: '2001'}});
      // endYearInput.simulate('change', {target: {value: '2100'}});

      startYearInput.node.value = '2001';
      startYearInput.simulate('change');
      // endYearInput.simulate('change', {target: {value: '2100'}});

      // console.log(component.state.dateBefore);

      // expect(updateSelectedFacets.calledOnce).to.equal(true);
      // expect(updateSelectedFacets.calledWithMatch).to.equal(calledWithValues);
      // expect(updateSelectedFacets.callCount).to.equal(1);
      component.update();
      expect(inputChange.callCount).to.equal(1);
    });
  });

  describe('It will show the error message', () => {
    const selectedFacets = {
      language: ['lang:fr', 'lang:fr'],
    };
    let component;

    before(() => {
      component = mount(<FieldsetDate selectedFacets={selectedFacets} />);
    });

    it('should show the error message if dateBefore is earlier than dateAfter', () => {

    });
  });
});
