import React from 'react';
import PropTypes from 'prop-types';
import DefinitionList from './DefinitionList';

const LibraryHoldings = ({ holdings }) => {
  if (!holdings) {
    return null;
  }

  const htmlDefinitions = holding => holding
    .holdingDefinition
    .map(definition => (
      {
        term: definition.term,
        definition: (
          <ul>
            {
              definition.definition.map(el => <li key={el}>{el}</li>)
            }
          </ul>
        ),
      }
    ));

  return (
    <React.Fragment>
      {
        holdings
        .map(holding =>
          (
            <React.Fragment>
              <DefinitionList
                data={htmlDefinitions(holding)}
              />
              <hr />
            </React.Fragment>
          ),
        )
      }
    </React.Fragment>
  );
};

LibraryHoldings.propTypes = {
  holdings: PropTypes.array,
};

export default LibraryHoldings;
