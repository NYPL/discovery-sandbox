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
        .map((value, idx) => {
          if (!value) return null;

          if (field.value === 'identifier') {
            return <IdentifierField entity={value} />;
          }

          if (field.linkable) {
            if (field.value === 'subjectLiteral') {
              // This will only be processed if SubjectHeadingData on Bib is undefined
              // and if subjectLiterals is defined.
              return (
                <li>
                  {value
                    .split(' > ')
                    .reduce((literalList, literal, idx, orgArr) => {
                      return [
                        ...literalList,
                        <LinkableBibField
                          key={`${literal}-${idx}`}
                          label={field.label}
                          field={field.value}
                          bibValue={literal}
                          outbound={field.selfLinkable}
                          filterPath={orgArr.slice(0, idx + 1).join(' -- ')}
                        />,
                        // Add span if there are additional literals
                        idx < orgArr.length - 1 && (
                          <span key={`divider-${idx}-${literal}`}> &gt; </span>
                        ),
                      ].filter(Boolean);
                    }, [])}
                </li>
              );
            }

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
