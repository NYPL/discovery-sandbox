import { expect } from 'chai';
import { appendDimensionsToExtent } from '../../src/app/utils/appendDimensionsToExtent';

describe('appendDimensionsToExtent', () => {
  it('should add a semicolon after extent if there is not one already', () => {
    const bib = { extent: ['99 bottles of beer'], dimensions: ['99 x 99 cm'] };
    appendDimensionsToExtent(bib);
    expect(bib.extent[0]).to.include('; ');
  });
  it('should append dimensions to extent', () => {
    const bib = { extent: ['99 bottles of beer'], dimensions: ['99 x 99 cm'] };
    appendDimensionsToExtent(bib);
    expect(bib.extent[0]).to.equal('99 bottles of beer; 99 x 99 cm');
  });
  it('should not add semicolon if it already is in extent', () => {
    const bib = appendDimensionsToExtent({
      extent: ['700 sheets of woven gold; '],
      dimensions: ['1 x 1 in.'],
    });
    expect(bib.extent[0]).to.equal('700 sheets of woven gold; 1 x 1 in.');
  });
  it('should remove semicolon if there is no dimensions', () => {
    const bib = appendDimensionsToExtent({
      extent: ['700 sheets of woven gold; '],
    });
    const anotherBib = appendDimensionsToExtent({
      extent: ['700 sheets of woven gold;'],
    });
    expect(bib.extent[0]).to.equal('700 sheets of woven gold');
    expect(anotherBib.extent[0]).to.equal('700 sheets of woven gold');
  });
  it('should display dimensions if there are dimensions and no extent', () => {
    const bib = appendDimensionsToExtent({ dimensions: ['1,000,000mm x 7ft'] });
    expect(bib.extent[0]).to.equal('1,000,000mm x 7ft');
  });
  it('should do nothing if there are no dimensions or extent', () => {
    const bib = appendDimensionsToExtent({});
    expect(bib).to.not.have.keys('extent');
  });
});
