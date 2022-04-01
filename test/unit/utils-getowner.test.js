import getOwner from './../../src/app/utils/getOwner';
import { expect } from 'chai';

describe('utils/getOwner', () => {
  it('returns undefined if owner is NYPL', () => {
    // Make a SASB bib:
    const bib = {
      items: [
        {
          owner: [{
            '@id': 'orgs:1000',
            prefLabel: 'Stephen A. Schwarzman Building',
          }],
          idNyplSourceId: {
            '@type': 'SierraNypl'
          },
        }
      ]
    }

    expect(getOwner(bib)).to.be.a('undefined')
  })

  it('returns Princeton if owner is PUL', () => {
    // Make a PUL bib:
    const bib = {
      items: [
        {
          owner: [{
            '@id': 'orgs:0003',
            prefLabel: 'Princeton University Library',
          }],
          idNyplSourceId: {
            '@type': 'RecapPul'
          },
        }
      ]
    }

    expect(getOwner(bib)).to.eq('Princeton University Library')
  })

  it('returns Columbia if owner is CUL', () => {
    // Make a CUL bib:
    const bib = {
      items: [
        {
          owner: [{
            '@id': 'orgs:0002',
            prefLabel: 'Columbia University Libraries',
          }],
          idNyplSourceId: {
            '@type': 'RecapCul'
          },
        }
      ]
    }

    expect(getOwner(bib)).to.eq('Columbia University Libraries')
  })


  it('returns Harvard if owner is HL', () => {
    // Make a HL bib:
    const bib = {
      items: [
        {
          owner: [{
            '@id': 'orgs:0004',
            prefLabel: 'Harvard Library',
          }],
          idNyplSourceId: {
            '@type': 'RecapHl'
          },
        }
      ]
    }

    expect(getOwner(bib)).to.eq('Harvard Library')
  })
})
