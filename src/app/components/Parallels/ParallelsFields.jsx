import PropTypes from 'prop-types';
import React from 'react';
import { useBibParallel } from '../../context/Bib.Provider';

const ParallelsFields = ({ field, content = '', fieldIndex = 0 }) => {
  const { parallel } = useBibParallel(field);

  return (
    <>
      {(parallel &&
        parallel[fieldIndex].map((value, idx) => (
          <span
            dir={unicodeDirection(value)}
            key={`${field}_${idx}_para`}
            style={{ display: 'block' }}
          >
            {value}
          </span>
        ))) || (
        <span dir={unicodeDirection(content)} style={{ display: 'block' }}>
          {content}
        </span>
      )}
    </>
  );
};

export default ParallelsFields;

ParallelsFields.propTypes = {
  content: PropTypes.string,
  field: PropTypes.string,
  fieldIndex: PropTypes.number,
  headingLevel: PropTypes.number,
};

function unicodeDirection(text) {
  return text[0] === '\u200F' ? 'rtl' : 'ltr';
}
