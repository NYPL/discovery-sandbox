import PropTypes from 'prop-types';
import React from 'react';

const IdentifierNode = ({ values }) => {
  return (
    <ul>
      {values.map((ent) => {
        const mark = ent['@value'];
        const status = ent.identifierStatus;

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
      })}
    </ul>
  );
};

IdentifierNode.propTypes = {
  values: PropTypes.array,
  type: PropTypes.string,
};

export default IdentifierNode;
