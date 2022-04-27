import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import BibDetails from '../../src/app/components/BibPage/BibDetails';
import BottomBibDetails from '../../src/app/components/BibPage/BottomBibDetails';

describe('BottomBibDetails', () => {
  it('should pass the correct list of fields to the BibDetails component', () => {
    let bibWithoutHeadings = {
      uri: 'b12345',
    };

    let bibWithHeadings = {
      uri: 'b12345',
      subjectHeadingData: [],
    };

    let component1 = shallow(
      <BottomBibDetails bib={bibWithoutHeadings} resources={[]} />,
    );

    let component2 = shallow(
      <BottomBibDetails bib={bibWithHeadings} resources={[]} />,
    );

    let bibDetails1 = component1.find(BibDetails);
    let bibDetails2 = component2.find(BibDetails);

    let subjects1 = bibDetails1
      .props()
      .fields.filter((field) => field.label === 'Subject');

    let subjects2 = bibDetails2
      .props()
      .fields.filter((field) => field.label === 'Subject');

    expect(subjects1.length).to.equal(1);
    expect(subjects1[0].value).to.equal('subjectLiteral');
    expect(subjects2.length).to.equal(1);
    expect(subjects2[0].value).to.equal('subjectHeadingData');
  });
});
