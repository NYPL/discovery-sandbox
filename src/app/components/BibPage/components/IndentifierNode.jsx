import PropTypes from 'prop-types';
import React from 'react';

const IdentifierNode = ({ value }) => {
  const mark = value['@value'];
  const status = value.identifierStatus;

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

IdentifierNode.propTypes = {
  value: PropTypes.array,
  type: PropTypes.string,
};

export default IdentifierNode;
