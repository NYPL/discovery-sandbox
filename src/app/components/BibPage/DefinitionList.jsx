import React from 'react';
import PropTypes from 'prop-types';

/*
 * DefinitionList
 * Expects data in the form of [
 *  { term: '', definition: '', termClass: '', definitionClass: ''},
 *  {...}, {...}, ...].
 * termClass and definitionClass are optional properties.
 */
const DefinitionList = ({ data }) => {
  const getDefinitions = (definitions) => {
    if (!definitions && !definitions.length) {
      return null;
    }

    return definitions.map((item) => {
      if (!item.term && !item.definition) {
        return null;
      }
      return ([
        (<dt className={item.termClass || null}>{item.term}</dt>),
        (<dd className={item.definitionClass || null}>{item.definition}</dd>),
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
