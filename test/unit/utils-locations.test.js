import { locationSlugForLocation } from './../../src/app/utils/locations';
import { expect } from 'chai';

describe('utils/locations', () => {
  it('returns undefined if invalid location entity passed in', () => {
    expect(locationSlugForLocation(null)).to.be.a('null');
    expect(locationSlugForLocation('hmm')).to.be.a('null');
    expect(locationSlugForLocation({ })).to.be.a('null');
    expect(locationSlugForLocation({ })).to.be.a('null');
  })

  it('returns relevant slug for locations', () => {
    expect(locationSlugForLocation({ '@id': 'loc:lpa' })).to.equal('lpa');
    expect(locationSlugForLocation({ '@id': 'loc:lpj0i' })).to.equal('lpa');
    expect(locationSlugForLocation({ '@id': 'loc:par' })).to.equal('lpa');
    expect(locationSlugForLocation({ '@id': 'loc:pat11' })).to.equal('lpa');
    expect(locationSlugForLocation({ '@id': 'loc:mya' })).to.equal('lpa');

    expect(locationSlugForLocation({ '@id': 'loc:mab' })).to.equal('schwarzman');
    expect(locationSlugForLocation({ '@id': 'loc:maf' })).to.equal('schwarzman');

    expect(locationSlugForLocation({ '@id': 'loc:sc' })).to.equal('schomburg');
    expect(locationSlugForLocation({ '@id': 'loc:sce' })).to.equal('schomburg');
  })
})
