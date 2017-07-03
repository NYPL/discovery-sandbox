import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'underscore';

const BibMainInfo = ({ bib = {} }) => {
  if (_isEmpty(bib)) return null;

  const title = bib.title && bib.title.length ? bib.title[0] : '';
  const yearPublished = bib && bib.dateStartYear ? bib.dateStartYear : null;
  const author = bib.creatorLiteral && bib.creatorLiteral.length ?
    ` / ${bib.creatorLiteral[0]}` : '';
  const materialType = bib && bib.materialType && bib.materialType[0] ?
    bib.materialType[0].prefLabel : null;

    const fields = [
      { label: 'Format', value: 'materialType' },
      { label: 'Author', value: 'contributor' },
      { label: 'Contributors', value: 'contributor' },
      // {bib.placeOfPublication} {bib.publisher} {yearPublished}
      { label: 'Title (alternative)', value: 'titleAlt' },
    ];

  return (
    <span>
      <dt>FORMAT</dt>
      <dd>{materialType}</dd>
      <dt>AUTHOR</dt>
      <dd>{author}</dd>
      <dt>CONTRIBUTORS</dt>
      <dd>{bib.contributor}</dd>
      <dt>BIBLIOGRAPHY</dt>
      <dd>{bib.placeOfPublication} {bib.publisher} {yearPublished}</dd>
      <dt>ALTERNATIVE TITLES</dt>
      <dd>{bib.titleAlt}</dd>
    </span>
  );
};

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
