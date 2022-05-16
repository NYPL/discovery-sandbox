import PropTypes from 'prop-types';
import React from 'react';
import { isArray, isEmpty, normalizeLiteral } from '../../../utils/utils';
import DirectionalText from './DirectionalText';
import IdentifierField from './IdentifierField';
import LinkableBibField from './LinkableField';
import SubjectLiteralBibField from './SubjectLiteralBibField';

/**
 * @typedef {Object} DefinitionFieldProps
 * @property {Array<string | object | string[] | object[] | Array<string | object>>} values
 * @property {import('../TopBibDetails').FieldDefinition} field
 */

/**
 * @param {DefinitionFieldProps} props
 * @return {React.Node?}
 */
const DefinitionField = ({ values = [], field = {} }) => {
  if (!isArray(values) || isEmpty(values)) {
    return null;
  }

  if (!field || isArray(field) || isEmpty(field)) {
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
                <SubjectLiteralBibField
                  key={`${value}-${idx}`}
                  value={value}
                  field={field}
                />
              );
            }

            return (
              <li key={`${value}-${idx}`}>
                <LinkableBibField
                  displayText={
                    (field.selfLinkable &&
                      (value.prefLabel || value.label || value.url)) ||
                    value
                  }
                  field={field.value}
                  label={field.label}
                  searchQuery={value['@id'] ?? value}
                  url={(field.selfLinkable && value['@id']) || value.url}
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
  values: PropTypes.array,
  field: PropTypes.object,
};

DefinitionField.default = {
  values: [],
  field: {},
};

export default DefinitionField;
