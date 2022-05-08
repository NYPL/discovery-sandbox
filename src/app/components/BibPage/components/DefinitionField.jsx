import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isEmpty, normalizeLiteral } from '../../../utils/utils';
import ParallelsFields from '../../Parallels/ParallelsFields';
import IdentifierField from './IdentifierField';
import LinkableBibField from './LinkableField';

const DefinitionField = ({ values, field, bib }) => {
  if (!isArray(values) || isEmpty(values)) {
    return null;
  }

  return (
    <ul>
      {values
        .map((value) => {
          if (field.value === 'subjectLiteral') {
            return normalizeLiteral(value);
          }

          return value;
        })
        .map((value, idx) => {
          if (!value) return null;

          if (field.value === 'identifier') {
            return <IdentifierField key={`${value}-${idx}`} entity={value} />;
          }

          if (field.linkable) {
            if (field.value === 'subjectLiteral') {
              // This will only be processed if SubjectHeadingData on Bib is undefined
              // and if subjectLiterals is defined.
              return (
                <li key={`${value}-${idx}`}>
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
                          bib={bib}
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
                  data={{ name: field.value, value, position: idx }}
                  field={field.value}
                  bibValue={value}
                  outbound={field.selfLinkable}
                  bib={bib}
                />
              </li>
            );
          }

          const definition = value.prefLabel ?? value.label ?? value;

          return (
            <li key={`${value}-${idx}`}>
              <ParallelsFields
                content={definition}
                field={field.value}
                fieldIndex={idx}
                bib={bib}
              />
            </li>
          );
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionField.propTypes = {
  field: PropTypes.object,
  bib: PropTypes.object,
  values: PropTypes.array,
};

DefinitionField.default = {
  additional: false,
  values: [],
};

export default DefinitionField;
