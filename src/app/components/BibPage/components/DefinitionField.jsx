import PropTypes from 'prop-types';
import React from 'react';
import { useBibParallel } from '../../../context/Bib.Provider';
import { normalizeLiteral } from '../../../utils/utils';
import ParallelsFields from '../../Parallels/ParallelsFields';
import IdentifierField from './IdentifierField';
import LinkableBibField from './LinkableField';

const DefinitionField = ({ field, bibValues = [], additional = false }) => {
  const { parallel } = useBibParallel(field.value);

  // BibValues is an array of various values
  // Set bibValues as a 2D array becuase parallels is also a 2D array
  // Keep things in sync.
  const list = parallel ?? [bibValues];

  return (
    <ul className={additional && 'additionalDetails'}>
      {list
        .flat()
        .map((value) => {
          if (field.value === 'subjectLiteral') {
            return normalizeLiteral(value);
          }

          return value;
        })
        .map((value, idx, list) => {
          if (!value) return null;

          if (field.value === 'identifier') {
            return <IdentifierField entity={value} />;
          }

          if (field.linkable) {
            return (
              <li key={`${value}-${idx}`}>
                <LinkableBibField
                  label={field.label}
                  field={field.value}
                  bibValue={value}
                  outbound={field.selfLinkable}
                />
              </li>
            );
          }

          const definition = value.prefLabel ?? value.label ?? value;

          return (
            <li key={`${value}-${idx}`}>
              <ParallelsFields content={definition} />
            </li>
          );
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionField.propTypes = {
  field: PropTypes.object,
  additional: PropTypes.bool,
  bibValues: PropTypes.array,
};

DefinitionField.default = {
  additional: false,
  bibValues: [],
};

export default DefinitionField;
