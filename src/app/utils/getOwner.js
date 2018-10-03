import {
  every as _every,
} from 'underscore';
/*
* getOwner(bib)
* This is currently only for non-NYPL partner items. If it's NYPL, it should return undefined.
* Requirement: Look at all the owners of all the items and if they were all the same and
* not NYPL, show that as the owning institution and otherwise show nothing.
* @param {object} bibId
* @return {string}
*/


export default function getOwner(bib) {
  if (!bib) return null;

  const items = bib.items;
  const ownerArr = [];
  let owner;

  if (!items || !items.length) {
    return null;
  }

  items.forEach((item) => {
    const ownerObj = item.owner && item.owner.length ? item.owner[0].prefLabel : undefined;

    ownerArr.push(ownerObj);
  });

  // From above, check to see if all the owners are the same, and if so, proceed if the owner
  // is either Princeton or Columbia.
  if (_every(ownerArr, o => (o === ownerArr[0]))) {
    if ((ownerArr[0] === 'Princeton University Library') ||
    (ownerArr[0] === 'Columbia University Libraries')) {
      owner = ownerArr[0];
    }
  }

  return owner;
}
