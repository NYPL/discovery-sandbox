import { expect } from 'chai';
import { appendDimensionsToExtent } from '../../src/app/utils/appendDimensionsToExtent'

describe('appendDimensionsToExtent', () => {
  const mockBib = { extent: ['99 bottles of beer'], dimensions: ['99 x 99 cm']}
  it('should add a semicolon after extent if there is not one already', () => {
    const [newExtent] = appendDimensionsToExtent(mockBib)
    expect(newExtent).to.include('; ')
  })
  it('should append dimensions to extent', () => {
    const [newExtent] = appendDimensionsToExtent(mockBib)
    expect(newExtent).to.equal('99 bottles of beer; 99 x 99 cm')
  })
  it('should not add semicolon if it already is in extent', () => {
    const [newExtent] = appendDimensionsToExtent({ extent: ['700 sheets of woven gold; '], dimensions: ['1 x 1 in.'] })
    expect(newExtent).to.equal('700 sheets of woven gold; 1 x 1 in.')
  })
  it('should remove semicolon if there is no dimensions', () => {
    const [newExtent] = appendDimensionsToExtent({ extent: ['700 sheets of woven gold; '] })
    const [anotherExtent] = appendDimensionsToExtent({ extent: ['700 sheets of woven gold;'] })
    expect(newExtent).to.equal('700 sheets of woven gold')
    expect(anotherExtent).to.equal('700 sheets of woven gold')
  })
  it('should return undefined if there is no extent', () => {
    const nullExtent = appendDimensionsToExtent({})
    expect(nullExtent).to.equal(undefined)
  })
})