import PropTypes from 'prop-types';
import { Heading } from '@nypl/design-system-react-components';
import React from 'react';
import { useBibParallel } from '../../context/Bib.Provider';

const ParallelsFields = ({
  field,
  children,
  fieldIndex = 0,
  headingLevel = undefined,
}) => {
  const { parallel } = useBibParallel(field);

  return (
    <Heading level={headingLevel}>
      <>
        {(parallel &&
          parallel[fieldIndex].map((value, idx) => (
            <span key={`${field}_${idx}`} style={{ display: 'block' }}>
              {value}
            </span>
          ))) ||
          children}
      </>
    </Heading>
  );
};

export default ParallelsFields;

ParallelsFields.propTypes = {
  pField: PropTypes.string.isRequired,
  fieldIndex: PropTypes.number,
  headingLevel: PropTypes.number,
  children: PropTypes.node,
};
