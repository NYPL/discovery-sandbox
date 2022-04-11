import PropTypes from 'prop-types';
import { Heading } from '@nypl/design-system-react-components';
import React from 'react';
import { useBibParallel } from '../../context/Bib.Provider';

const ParallelsFields = ({
  pField,
  children,
  fieldIndex = 0,
  headingLevel = undefined,
}) => {
  const { field = [], parallel = [] } = useBibParallel(pField);

  return (
    <Heading level={headingLevel}>
      {(parallel[fieldIndex] ?? field[fieldIndex]) || children}
    </Heading>
  );
};

export default ParallelsFields;

ParallelsFields.propTypes = {
  pField: PropTypes.string.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  bib: PropTypes.object.isRequired,
  headingLevel: PropTypes.number,
  children: PropTypes.node,
};

ParallelsFields.default = {
  fieldIndex: 0,
  headingLevel: undefined,
};
