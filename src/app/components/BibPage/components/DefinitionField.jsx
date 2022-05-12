import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isEmpty, normalizeLiteral } from '../../../utils/utils';
import DirectionalText from './DirectionalText';
import IdentifierField from './IdentifierField';
import LinkableBibField from './LinkableField';

const DefinitionField = ({ values, field }) => {
  if (!isArray(values) || isEmpty(values)) {
    return null;
  }

  return (
    <ul>
      {values
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
            return <IdentifierField key={`${value}-${idx}`} entity={value} />;
          }

          if (field.linkable) {
            if (field.value === 'subjectLiteral') {
              // Process if Bib.subjectHeadingData is undefined & Bib.subjectLiterals is defined
              return (
                <SubjectLiteralField
                  key={`${value}-${idx}`}
                  value={value}
                  field={field}
                />
              );
            }

            return (
              <li key={`${value}-${idx}`}>
                <LinkableBibField
                  value={value}
                  field={field.value}
                  label={field.label}
                  outbound={field.selfLinkable}
                />
              </li>
            );
          }

          const definition = value.prefLabel ?? value.label ?? value;

          return (
            <li key={`${value}-${idx}`}>
              <DirectionalText text={definition} />
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

function SubjectLiteralField(value, field) {
  return (
    <li>
      {value.split(' > ').reduce((literalList, literal, idx, orgArr) => {
        return [
          ...literalList,
          <LinkableBibField
            key={`${literal}-${idx}`}
            value={literal}
            field={field.value}
            label={field.label}
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
