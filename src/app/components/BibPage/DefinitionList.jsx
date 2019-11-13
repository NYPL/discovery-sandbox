import React from 'react';
import PropTypes from 'prop-types';

/*
 * DefinitionList
 * Expects data in the form of [{ term: '', definition: '' }, {...}, ...].
 */
const DefinitionList = ({ data }) => {
  const getDefinitions = (definitions) => {

    return definitions.map((item, i) => {
      if (!item || (!item.term && !item.definition)) {
        return null;
      }

      return ([
        (<dt key={`term-${i}`}>{item.term}</dt>),
        (<dd className={`bib-detail ${item.term}`} key={`definition-${i}`}>{item.definition}</dd>),
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
