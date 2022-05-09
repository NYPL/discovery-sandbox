import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import DefinitionList from './DefinitionList';

const LibraryHoldings = ({ holdings }) => {
  if (!holdings) {
    return null;
  }

  const liForEl = (el, idx) => {
    if (typeof el === 'string') return <li key={`holding_${idx}`}>{el}</li>;
    if (!el.url) return <li key={`holding_${idx}`}>{el.label}</li>;
    return (
      <li key={`holding_${idx}`}>
        <a href={el.url}>{el.label}</a>
      </li>
    );
  };

  const htmlDefinitions = (holding) =>
    holding.holdingDefinition.map((definition) => ({
      term: definition.term,
      definition: <ul>{definition.definition.map(liForEl)}</ul>,
    }));

  return (
    // TODO: [SCC-3126] Replace Styles with ClassName or Constant
    <section style={{ marginTop: '20px' }}>
      <Heading level={3}>Holdings</Heading>
      {holdings.map((holding) => (
        <DefinitionList
          data={htmlDefinitions(holding)}
          key={holding.holdingDefinition}
        />
      ))}
    </section>
  );
};

LibraryHoldings.propTypes = {
  holdings: PropTypes.array,
};

export default LibraryHoldings;
