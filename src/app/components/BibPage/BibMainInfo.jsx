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
    <div className="nypl-item-details">
      <h1>{title}</h1>
      <div className="nypl-item-info">
        <p>
          <span className="nypl-item-media">{materialType}</span>
          {language && ` in ${language}`}
        </p>
        <p>{bib.extent} {bib.dimensions}</p>
        <p>
          {bib.placeOfPublication} {bib.publisher} {yearPublished}
        </p>
        <p className="nypl-item-use">{usageType}</p>
      </div>
    </div>
  );
};

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
