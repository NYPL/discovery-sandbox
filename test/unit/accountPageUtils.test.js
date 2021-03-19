/* eslint-env mocha */
import { expect } from 'chai';

import { isClosed } from './../../src/app/utils/accountPageUtils';

describe('isClosed', () => {
  it('should return true for string with "CLOSED"', () => {
    expect(isClosed('Andrew Heiskell (CLOSED)')).to.equal(true);
  });
  it('should return true for string with "STAFF ONLY"', () => {
    expect(isClosed('STAFF ONLY-SASB Rare Book Rm324')).to.equal(true);
  });
  it('should return true for string with "Performing Arts"', () => {
    expect(isClosed('Performing Arts - Spec Col Desk')).to.equal(true);
  });
  it('should return false for string without above cases', () => {
    expect(isClosed('53rd Street')).to.equal(false);
  });
});
