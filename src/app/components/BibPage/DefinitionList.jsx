import React from 'react';
import PropTypes from 'prop-types';
import SubjectHeadings from './SubjectHeadings';

/*
 * DefinitionList
 * Expects data in the form of [{ term: '', definition: '' }, {...}, ...].
 */
const DefinitionList = ({ data, headings }) => {
  const getDefinitions = definitions => definitions.map((item) => {
    if (!item || (!item.term && !item.definition)) {
      return null;
    }

    if (item.term === 'Subject') return <SubjectHeadings key="subjects" headings={headings} />;

    return ([
      (<dt key={`term-${item.term}`}>{item.term}</dt>),
      (<dd data={`definition-${item.term}`} key={`definition-${item.term}`}>{item.definition}</dd>),
    ]);
  });

  if (!data || !data.length) {
    return null;
  }

  return (<dl>{getDefinitions(data)}</dl>);
};

DefinitionList.propTypes = {
  data: PropTypes.array,
  headings: PropTypes.array,
};

export default DefinitionList;
