import PropTypes from 'prop-types';
import React from 'react';
import LinkableBibField from './LinkableField';

/**
 *
 * @typedef {Object} SubjectLiteralBibFieldProps
 * @property {!string} value
 * @property {!FieldDefinition} field
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
  /** @type {FieldDefinition} */
  field: PropTypes.object.isRequired,
};

export default SubjectLiteralBibField;

/**
 * - The type definition of the field objects used to define the displayed field in BibDetails
 * @typedef {Object} FieldDefinition
 * @property {string} label - The label to display in the Dom for a particular Bib Field
 * @property {string} value - The Bib field property to map to
 * @property {true=} linkable - Whether or not the bib field value is linkable
 * @property {true=} selfLinkable - Whether or not a linkable field directs to an internal page
 */
