import {
  every as _every,
} from 'underscore';
/*
* getOwner(bib)
* This is currently only for non-NYPL partner items. If it's NYPL, it should return undefined.
* @param {object} bib
* @return {string}
*/


export default function getOwner(bib) {
  if (!bib || !bib.items) return null;

  return bib.items
    // Only consider items with a Recap source id
    .filter((item) => item.idNyplSourceId && item.idNyplSourceId['@type'] && /^Recap/.test(item.idNyplSourceId['@type']))
    // Only consider items with an `owner` (should be all, in practice)
    .filter((item) => item.owner && item.owner.length && item.owner[0] && item.owner[0].prefLabel)
    // Map to owner `prefLabel`
    .map((item) => item.owner[0].prefLabel)
    [0];
}
