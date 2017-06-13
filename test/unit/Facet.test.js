/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import Facet from './../../src/app/components/FacetSidebar/Facet.jsx';
// import Actions from './../../src/app/actions/Actions.js';

describe('Facet', () => {
  describe('Should redner facet labels based on facet fields.', () => {
    let component;
    let getFacetLabel;

    before(() => {
      getFacetLabel = sinon.spy(Facet.prototype, 'getFacetLabel');
      component = mount(<Facet />);
    });

    after(() => {
      getFacetLabel.restore();
      component.unmount();
    });

    it('should render the label "Format" if the field is "materialType"', () => {});

    it('should render the label "Subject" if the field is "subjectLiteral"', () => {});

    it('should render the label "Owning Location/Division" if the field is "owner"', () => {});

    it('should render the label as the field with first character uppercase, ' +
      'other than the three cases above, ', () => {});

  });
});
