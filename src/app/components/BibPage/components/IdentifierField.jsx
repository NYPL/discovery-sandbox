import PropTypes from 'prop-types';
import React from 'react';

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
  entity: PropTypes.object,
};

export default IdentifierField;
