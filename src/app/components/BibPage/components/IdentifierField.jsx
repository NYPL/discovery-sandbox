import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {Object} Identifier
 * @property {string} type The type of Identifier
 * @property {string} value The value of the Identifier
 * @property {string=} identifierStatus The status of the identifier
 */

/**
 * @typedef {Object} IdentifierFieldProps
 * @property {Identifier} entity The type of Identifier
 */

/**
 * @param {IdentifierFieldProps} props
 * @returns
 */
const IdentifierField = ({ entity }) => {
  const mark = entity['@value'];
  const status = entity.identifierStatus;

  return (
    <li key={mark}>
      <span>
        {mark}
        {(status && (
          <>
            {' '}
            <em>{status}</em>
          </>
        )) ||
          null}
      </span>
    </li>
  );
};

IdentifierField.propTypes = {
  /** @type {Identifier}  */
  entity: PropTypes.object,
};

export default IdentifierField;
