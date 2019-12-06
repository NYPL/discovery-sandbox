import React from 'react';
import PropTypes from 'prop-types';
import SubjectHeadings from './SubjectHeadings';

/*
 * DefinitionList
 * Expects data in the form of [{ term: '', definition: '' }, {...}, ...].
 */
const DefinitionList = ({ data, headings }) => {
  const getDefinitions = (definitions) => {

    return definitions.map((item, i) => {
      if (!item || (!item.term && !item.definition)) {
        return null;
      }

      if (item.term === "Subject") {
        return <SubjectHeadings i={i} key='subjects' headings={headings}/>
      }

      return ([
        (<dt key={`term-${i}`}>{item.term}</dt>),
        (<dd data={`definition-${i}`} key={`definition-${i}`}>{item.definition}</dd>),
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
