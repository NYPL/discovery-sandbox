import PropTypes from 'prop-types';
import React from 'react';
import { extractParallels } from '../../utils/bibDetailsUtils';

const ParallelsFields = ({ field, content = '', fieldIndex = 0, bib }) => {
  if (!content) return null;

  const parallel = extractParallels(bib, field);

  return (
    <>
      {(parallel &&
        parallel[fieldIndex] &&
        parallel[fieldIndex]
          .map((value, idx) => {
            if (!value) return null;

            return (
              <span
                key={`${idx}_${fieldIndex}_${value}`}
                dir={unicodeDirection(value)}
                style={{ display: 'block' }}
              >
                {value}
              </span>
            );
          })
          .filter(Boolean)) || (
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
  bib: PropTypes.object,
};

function unicodeDirection(text = '') {
  return text[0] === '\u200F' ? 'rtl' : 'ltr';
}
