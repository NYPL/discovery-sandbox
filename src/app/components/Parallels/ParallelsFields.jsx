import PropTypes from 'prop-types';
import { Heading } from '@nypl/design-system-react-components';
import React from 'react';
import { useBibParallel } from '../../context/Bib.Provider';

const ParallelsFields = ({
  pfield,
  children,
  fieldIndex = 0,
  headingLevel = undefined,
}) => {
  const { field = [], parallel = [] } = useBibParallel(pfield);

  return (
    <Heading level={headingLevel}>
      {(parallel[fieldIndex] ?? field[fieldIndex]) || children}
    </Heading>
  );
};

export default ParallelsFields;

ParallelsFields.propTypes = {
  pfield: PropTypes.string.isRequired,
  fieldIndex: PropTypes.number.isRequired,
  bib: PropTypes.object.isRequired,
  headingLevel: PropTypes.number,
  children: PropTypes.node,
};

ParallelsFields.default = {
  fieldIndex: 0,
  headingLevel: undefined,
};
