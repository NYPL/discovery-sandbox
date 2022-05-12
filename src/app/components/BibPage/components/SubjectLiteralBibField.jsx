import PropTypes from 'prop-types';
import React from 'react';
import LinkableBibField from './LinkableField';

/**
 *
 * @typedef {Object} SubjectLiteralBibFieldProps
 * @property {!string} value
 * @property {!import('../TopBibDetails').FieldDefinition} field
 */

/**
 * @param {SubjectLiteralBibFieldProps} props
 * @returns {React.Node?}
 */
const SubjectLiteralBibField = ({ value, field }) => {
  if (!value || !field) return null;

  const initialValue = /** @type {React.Node[]} */ ([]);

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
            filterQuery={orgArr.slice(0, idx + 1).join(' -- ')}
          />,
          // Add span if there are additional literals
          idx < orgArr.length - 1 && (
            <span key={`divider-${idx}-${literal}`}> &gt; </span>
          ),
        ].filter(Boolean);
      }, initialValue)}
    </li>
  );
};

SubjectLiteralBibField.propTypes = {
  /** @type {string} */
  value: PropTypes.string.isRequired,
  /** @type {import('../TopBibDetails').FieldDefinition} */
  field: PropTypes.object.isRequired,
};

export default SubjectLiteralBibField;
