import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'underscore';

const BibMainInfo = ({ bib = {} }) => {
  if (_isEmpty(bib)) return null;

  const title = bib.title && bib.title.length ? bib.title[0] : '';
  const materialType = bib && bib.materialType && bib.materialType[0] ?
    bib.materialType[0].prefLabel : null;
  const language = bib && bib.language && bib.language[0] ?
    bib.language[0].prefLabel : null;
  const yearPublished = bib && bib.dateStartYear ? bib.dateStartYear : null;
  const usageType = bib && bib.actionType && bib.actionType[0] ?
    bib.actionType[0].prefLabel : null;

  return (
    <span>
      <dt>FORMAT</dt>
      <dd>{materialType}</dd>
      <dt>BIBLIOGRAPHY</dt>
      <dd>{bib.placeOfPublication} {bib.publisher} {yearPublished}</dd>
    </span>
  );
};

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
