/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

// Import the component that is going to be tested
import AdditionalDetailsViewer from './../../src/app/components/BibPage/AdditionalDetailsViewer';
import sampleBib from '../fixtures/bib.json'

describe('After Clicking on Button', () => {
  let component;
  let link;

  before(() => {
    console.log(sampleBib);
    component = mount(<AdditionalDetailsViewer bib={sampleBib}/>);
    link = component.find('a');
  });

  // These tests should be changed to be more informative
  it('should display Abbreviated Title', () => {
    expect(component.find('div').someWhere(item => item.text() === "Abrev. title -- 210 ")).to.equal(false);
  });

  it('should display url fields', () => {
    expect(link);
  });

  it('should have correct href for url fields', () => {
    expect(link.someWhere(item => item.prop('href') === 'http://blogs.nypl.org/rcramer/')).to.equal(true);
  });

  it('should display correct text for url fields', () => {
    expect(link.someWhere(item => item.text().trim() === '856 40')).to.equal(true);
  });
});
