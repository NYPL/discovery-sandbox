import PropTypes from 'prop-types';
import React from 'react';

const ParallelsFields = ({ field, content = '', fieldIndex = 0, bib }) => {
  const parallel = bib.parallels && bib.parallels[field];

  return (
    <>
      {(parallel &&
        parallel.mapping &&
        parallel.mapping[fieldIndex]
          .map((value, idx) => {
            if (!value) return;

            return (
              <span
                key={`${field}_${idx}_para`}
                dir={unicodeDirection(value)}
                style={{ display: 'block' }}
              >
                {value}
              </span>
            );
          })
          .filter(Boolean)) ||
        (content && (
          <span dir={unicodeDirection(content)} style={{ display: 'block' }}>
            {content}
          </span>
        )) ||
        null}
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
