import PropTypes from 'prop-types';
import React from 'react';
import ParallelsFields from '../../Parallels/ParallelsFields';

const DefinitionNoteField = ({ values, ulKey }) => {
  // type value = Note[]
  return (
    <ul key={ulKey}>
      {values
        .map(({ prefLabel, parallel = [] } = {}) => {
          if (!prefLabel) return null;

          return (
            <React.Fragment key={ulKey + prefLabel}>
              {parallel[0] ? (
                <li>
                  <ParallelsFields content={parallel[0]} />
                </li>
              ) : null}
              <li>
                <ParallelsFields content={prefLabel} />
              </li>
            </React.Fragment>
          );
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionNoteField.propTypes = {
  values: PropTypes.array,
  ulKey: PropTypes.string,
};

export default DefinitionNoteField;
