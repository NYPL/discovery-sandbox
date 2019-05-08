import React from 'react';
import PropTypes from 'prop-types';

/*
 * DefinitionList
 * Expects data in the form of [{ term: '', definition: '' }, {...}, ...].
 */
const DefinitionList = ({ data }) => {
  const getDefinitions = (definitions) => {

    return definitions.map((item) => {
      if (!item || (!item.term && !item.definition)) {
        return null;
      }
      return ([
        (<dt key={item.term}>{item.term}</dt>),
        (<dd key={item.definition}>{item.definition}</dd>),
      ]);
    });
  };

  if (!data || !data.length) {
    return null;
  }

  return (<dl>{getDefinitions(data)}</dl>);
};

DefinitionList.propTypes = {
  data: PropTypes.array,
};

export default DefinitionList;
