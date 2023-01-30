/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import DateSearchBar from './../../src/app/components/Item/DateSearchBar';

describe('DateSearchBar', () => {
  describe('Basic rendering', () => {
    let component;
    let selectedYear = '';
    let isSubmitted = false;
    let setSelectedYear = (value) => { selectedYear = value; };
    let submitFilterSelections = () => { isSubmitted = true; };

    before(() => {
      component = mount(
        <DateSearchBar
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          submitFilterSelections={submitFilterSelections}
        />
      );
    });

    it('should render a title, input field, search button, and clear button', () => {
      // Title
      expect(component.find('p').text()).to.equal('Search by Year');
      // Input field
      expect(component.find('input').at(0).props().placeholder).to.equal('YYYY');
      // Search button
      expect(component.find('button').at(0).text()).to.include('search');
      // Clear button
      expect(component.find('button').at(1).text()).to.equal('Clear search year');
    });

    it('should render a "close" X button when there is input', () => {
      // Add a value to the input field.
      component.find('input').at(0).simulate('change', { target: { value: '2020' } });

      // The first button is now the close button.
      expect(component.find('button').at(0).text()).to.include('close');
      
      // Reset the input field.
      component.find('input').at(0).simulate('change', { target: { value: '' } });
      
      // The first button is the search button again and the close X
      // button is now removed.
      expect(component.find('button').at(0).text()).to.include('search');
    });

    it('should updated the value the user inputs', () => {
      expect(selectedYear).to.equal('');
      // Input field
      component.find('input').at(0).simulate('change', { target: { value: '2020' } });
      // Search button
      component.find('button').at(0).simulate('click');
      
      expect(selectedYear).to.equal('2020');
    });
    
    it('should render the error message for bad dates', () => {
      // Input field
      component.find('input').at(0).simulate('change', { target: { value: '21' } });
      // Search button
      component.find('button').at(0).simulate('click');
      // State for the value is updated in the parent so this
      // must be passed down to the component.
      component.setProps({ selectedYear: '21' });
      // Form
      component.find('form').at(0).simulate('submit');
      
      expect(component.find('div').at(0).text()).to.include('Please enter a valid year');
    });
    
    it('should submit the form and call `submitFilterSelections`', () => {
      // Input field
      component.find('input').at(0).simulate('change', { target: { value: '2022' } });
      // Search button
      component.find('button').at(0).simulate('click');
      // State for the value is updated in the parent so this
      // must be passed down to the component.
      component.setProps({ selectedYear: '2022' });
      // Form
      component.find('form').at(0).simulate('submit');

      expect(selectedYear).to.equal('2022');
      expect(isSubmitted).to.equal(true);
    });
  });
});
