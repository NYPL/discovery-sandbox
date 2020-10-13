import React from 'react';
import PropTypes from 'prop-types';
import DefinitionList from './DefinitionList';

const LibraryHoldings = ({ holdings }) => {
  if (!holdings) {
    return null;
  }

  return (
    <React.Fragment>
      {
        holdings
        .map(holding =>
          (
            <React.Fragment>
              <DefinitionList
                data={holding.holdingDefinition}
              />
              <br />
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
