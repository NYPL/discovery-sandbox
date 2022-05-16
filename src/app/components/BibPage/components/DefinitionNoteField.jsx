import PropTypes from 'prop-types';
import React from 'react';
import DirectionalText from './DirectionalText';

/**
 * @typedef {(string | null)=} Parallel
 */

/**
 * A note object formated as a JSON_LD object
 *
 * ** The type property is prefixed with an "@" symbol.
 * JSDoc does not handle this
 * @typedef {Object} Note
 * @property {string} noteType The "Subject" type of the note
 * @property {string} type A JSON_LD property **prefixed with "@"**
 * @property {string} prefLabel The actual note value
 * @property {[Parallel, Note]=} parallel A Tuple of the Parallel value and the original Note
 */

/**
 * @typedef {Object} DefinitionNoteFieldProps
 * @property {Note[]} values
 */

/**
 * @param {DefinitionNoteFieldProps} props
 * @return {React.Node}
 */
const DefinitionNoteField = ({ values }) => {
  return (
    <ul>
      {values
        .map(({ prefLabel, parallel = [] } = {}, idx) => {
          if (!prefLabel) return null;

          return (
            <React.Fragment key={idx + '_' + prefLabel}>
              {parallel[0] ? (
                <li>
                  <DirectionalText text={parallel[0]} />
                </li>
              ) : null}
              <li>
                <DirectionalText text={prefLabel} />
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
