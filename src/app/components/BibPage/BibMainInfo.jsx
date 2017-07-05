import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

const BibMainInfo = ({ bib = {} }) => {
  if (_isEmpty(bib)) return null;

  const materialType = bib && bib.materialType && bib.materialType[0] ?
    bib.materialType[0].prefLabel : null;
  const author = bib.creatorLiteral && bib.creatorLiteral.length ?
    `${bib.creatorLiteral[0]}` : '';
  const contributor = bib.contributorLiteral && bib.contributorLiteral.length ?
    bib.contributorLiteral : null;
  const yearPublished = bib && bib.dateStartYear ? bib.dateStartYear : null;
  const placeOfPublication = bib && bib.placeOfPublication ? bib.placeOfPublication : null;
  const publisher = bib && bib.publisher ? bib.publisher : null;
  const language = bib && bib.language && bib.language[0] ?
    bib.language[0].prefLabel : null;

  return (
    <span>
      <dt>FORMAT</dt>
      <dd>
        {materialType}
        {language && ` in ${language}`}
      </dd>
      <dt>AUTHOR</dt>
      <dd>
        <Link
          onClick={e => this.newSearch(e, author)}
          title={`Make a new search for: ${author}`}
          to={`/search?${author}`}
        >
          {author}
        </Link>
      </dd>
      <dt>CONTRIBUTORS</dt>
      <dd>
        {
          contributor ? contributor.map((valueObj, i) => {
            return (
              <span key={i}>
                <Link
                  onClick={e => this.newSearch(e, valueObj)}
                  title={`Make a new search for: ${valueObj}`}
                  to={`/search?${valueObj}`}
                >
                  {valueObj}
                </Link>,&nbsp;
              </span>
            );
          }) : null
        }
      </dd>
      <dt>DESCRIPTION</dt>
      <dd>{bib.extent} {bib.dimensions}</dd>
      <dt>BIBLIOGRAPHY</dt>
      <dd>{placeOfPublication} {publisher} {yearPublished}</dd>
      <dt>ALTERNATIVE TITLES</dt>
      <dd>
        {
          bib.titleAlt ? bib.titleAlt.map((valueObj, i) => {
            return (
              <li key={i}>
                {valueObj}
              </li>
            );
          }) : null
        }
      </dd>
    </span>
  );
};

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
