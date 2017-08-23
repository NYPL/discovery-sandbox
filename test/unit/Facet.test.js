// /* eslint-env mocha */
// import React from 'react';
// import sinon from 'sinon';
// import { expect } from 'chai';
// import { mount } from 'enzyme';
// // Import the component that is going to be tested
// import Facet from './../../src/app/components/FacetSidebar/Facet.jsx';
//
// describe('Facet', () => {
//   describe('renders facet labels based on facet fields.', () => {
//     let component;
//     let getFacetLabel;
//
//     before(() => {
//       const testFacet = {
//         field: 'language',
//         values: [],
//       };
//
//       getFacetLabel = sinon.spy(Facet.prototype, 'getFacetLabel');
//       component = mount(<Facet facet={testFacet} />);
//     });
//
//     after(() => {
//       getFacetLabel.restore();
//       component.unmount();
//     });
//
//     it('should call getFacetLabel() once to render the label.', () => {
//       expect(getFacetLabel.calledOnce).to.equal(true);
//     });
//
//     it('should render the label as the field with first character uppercase, ', () => {
//       expect(getFacetLabel.returnValues[0]).to.equal('Language');
//     });
//   });
//
//   describe('If the facet field is "subjectLiteral", ', () => {
//     let component;
//     let getFacetLabel;
//
//     before(() => {
//       const testFacet = {
//         field: 'subjectLiteral',
//         values: [],
//       };
//
//       getFacetLabel = sinon.spy(Facet.prototype, 'getFacetLabel');
//       component = mount(<Facet facet={testFacet} />);
//     });
//
//     after(() => {
//       getFacetLabel.restore();
//       component.unmount();
//     });
//
//     it('should render the label "Subject".', () => {
//       expect(getFacetLabel.returnValues[0]).to.equal('Subject');
//     });
//   });
//
//   describe('If the facet field is "materialType", ', () => {
//     let component;
//     let getFacetLabel;
//
//     before(() => {
//       const testFacet = {
//         field: 'materialType',
//         values: [],
//       };
//
//       getFacetLabel = sinon.spy(Facet.prototype, 'getFacetLabel');
//       component = mount(<Facet facet={testFacet} />);
//     });
//
//     after(() => {
//       getFacetLabel.restore();
//       component.unmount();
//     });
//
//     it('should render the label "Format".', () => {
//       expect(getFacetLabel.returnValues[0]).to.equal('Format');
//     });
//   });
//
//   describe('If the facet field is "owner", ', () => {
//     let component;
//     let getFacetLabel;
//
//     before(() => {
//       const testFacet = {
//         field: 'owner',
//         values: [],
//       };
//
//       getFacetLabel = sinon.spy(Facet.prototype, 'getFacetLabel');
//       component = mount(<Facet facet={testFacet} />);
//     });
//
//     after(() => {
//       getFacetLabel.restore();
//       component.unmount();
//     });
//
//     it('should render the label "Owning Location/Division".', () => {
//       expect(getFacetLabel.returnValues[0]).to.equal('Owning Location/Division');
//     });
//   });
// });
