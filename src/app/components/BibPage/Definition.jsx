import React from 'react';
import PropTypes from 'prop-types';

/*
 * Definition
 * Expects data in the form of [{ term: '', definition: ''}, {...}, ...].
 */
const Definition = ({ definitions }) => {
  const getDefinitions = (defs) => {
    if (!defs && !defs.length) {
      return null;
    }

    return defs.map((item) => {
      if (!item.term && !item.definition) {
        return null;
      }
      return ([
        (<dt>{item.term}</dt>),
        (<dd>{item.definition}</dd>),
      ]);
    });
  };

  if (!definitions || !definitions.length) {
    return null;
  }

  return (<span>{getDefinitions(definitions)}</span>);
};

Definition.propTypes = {
  definitions: PropTypes.array,
};

export default Definition;
