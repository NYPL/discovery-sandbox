import React from 'react';

const definitionItem = (value, index = 0) => {
  const link = (
    <a href={value.content} title={JSON.stringify(value.source, null, 2)}>
      {value.label}
    </a>
  );

  return (
    <div key={index}>
      {value.label ? link : value.content}
      {value.parallels ? value.parallels : null}
    </div>
  );
};

const annotatedMarcDetails = (bib) =>
  bib.annotatedMarc.bib.fields.map((field) => ({
    term: field.label,
    definition: field.values.map(definitionItem),
  }));

const combineBibDetailsData = (bibDetails, additionalData) => {
  const bibDetailsTerms = new Set(bibDetails.map((item) => item.term));
  const filteredAdditionalData = additionalData.filter(
    (item) => !bibDetailsTerms.has(item.term),
  );
  return bibDetails.concat(filteredAdditionalData);
};


/**
 * isRtl(string)
 * Returns true (or false) depending on whether the string needs to be read right to left
 * @param {string} string
 * @return  {boolean}
 */
const isRtl  = (string) => {
  if (typeof string !== 'string') { return null }
  return string.substring(0, 1) === '\u200F'
}

/**
 * stringDirection(string)
 * 'rtl' if the string needs to be read right to left, otherwise ltr
 * @param {string} string
 * @return {string}
 */
const stringDirection = (string) => {
  return isRtl(string) ? 'rtl' : 'ltr'
}



/**
 * interleave(arr1, arr2)
 * Given two arrays, returns the elements interleaved, with falsey elements removed.
 * Example: interleave ([1, 2, null, 3], [5,6,7,8,9]) =>
 * [1,5,2,6,7,3,8,9].
 * Assumes that arr2 is at least as long as arr1.
 *
 * @param {array} arr1
 * @param {array} arr2
 * @return {array}
 */
const interleave = (arr1, arr2) => arr2.reduce((acc, el, id) => (arr1[id] && acc.push(arr1[id]), el && acc.push(el), acc), [])


/**
 * matchParallels(bib)
 * Given a bib object returns a new copy of the bib in which fields with parallels have been rewritten
 * The new rewritten field interleaves the parallel field and the paralleled (i.e. original) field together.
 * Skips over subject fields since these require changes to SHEP
 * @param {object} bib
 * @return {object}
 */
const matchParallels = (bib) => {
  const parallelFieldMatches = Object.keys(bib).map((key) => {
    if (key.match(/subject/)) { return null }
    const match = key.match(/parallel(.)(.*)/)
    const paralleledField = match && `${match[1].toLowerCase()}${match[2]}`
    const paralleledValues = paralleledField && bib[paralleledField]
    return paralleledValues && { [paralleledField] : interleave(bib[key], paralleledValues)}
  })

  return Object.assign({}, bib, ...parallelFieldMatches)
}

export { definitionItem, annotatedMarcDetails, combineBibDetailsData, isRtl, stringDirection, interleave, matchParallels };
