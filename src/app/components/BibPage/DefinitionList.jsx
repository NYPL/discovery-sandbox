import React from 'react';
import PropTypes from 'prop-types';

/*
 * DefinitionList
 * Expects data in the form of [{ term: '', definition: '' }, {...}, ...].
 */
const DefinitionList = ({ data }) => {
  const getDefinitions = (definitions) => {
    if (!definitions && !definitions.length) {
      return null;
    }

    return definitions.map((item) => {
      if (!item || (!item.term && !item.definition)) {
        return null;
      }
      return ([
        (<dt>{item.term}</dt>),
        (<dd>{item.definition}</dd>),
      ]);
    });
  };

  if (!data && !data.length) {
    return null;
  }

  return (<dl>{getDefinitions(data)}</dl>);
};

DefinitionList.propTypes = {
  data: PropTypes.array,
};

export default DefinitionList;
