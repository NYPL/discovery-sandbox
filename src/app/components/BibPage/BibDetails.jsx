import PropTypes from 'prop-types';
import React from 'react';
import {
  combineBibDetailsData,
  extractParallels,
  groupNotesBySubject,
  setParallelToNote,
} from '../../utils/bibDetailsUtils';
import getOwner from '../../utils/getOwner';
import LibraryItem from '../../utils/item';
import { isArray, isEmpty } from '../../utils/utils';
import DefinitionField from './components/DefinitionField';
import DefinitionNoteField from './components/DefinitionNoteField';
import DefinitionList from './DefinitionList';

const BibDetails = ({ fields = [], resources = [], marcs, bib }) => {
  if (!bib || isEmpty(bib) || isArray(bib)) {
    return null;
  }

  // Make sure fields is a nonempty array
  if (isEmpty(fields) || !isArray(fields)) {
    return null;
  }

  // Loops through fields and builds the Definition Field Component
  const definitions = fields.reduce((store, field, fIdx) => {
    const values = buildValue(bib, field, resources);

    if (!values) return store;

    if (field.value === 'note') {
      // Due to notes potentially having multiple subjects
      // The store needs to be extended with all possible subjects
      // Extend the notes subjects with any parallels to keep index mapping
      const group = groupNotesBySubject(setParallelToNote(values, bib));

      return [
        ...store,
        // In order to get the noteType as a label
        // we need to process this here
        ...Object.entries(group).map(([label, notes], gIdx) => {
          // type notes = Note[]
          return {
            // term is the label of the field
            term: label,
            // definition is the value of the label
            definition: (
              <DefinitionNoteField
                key={`note_${label}_${gIdx}`}
                ulKey={`note_${label}_${gIdx}`}
                values={notes}
              />
            ),
          };
        }),
      ];
    }

    return [
      ...store,
      {
        term: field.label,
        definition: (
          <DefinitionField
            key={`${field.label}_${fIdx}`}
            values={values}
            field={field}
          />
        ),
      },
    ];
  }, []);

  const data = combineBibDetailsData(definitions, marcs);

  return <DefinitionList data={data} headings={bib.subjectHeadingData} />;
};

BibDetails.propTypes = {
  fields: PropTypes.array.isRequired,
  resources: PropTypes.array,
  marcs: PropTypes.array,
  bib: PropTypes.object,
};

BibDetails.defaultProps = {
  marcs: [],
  resources: [],
  fields: [],
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;

/**
 *
 * @param {FieldDefinition} field A Single Field Object Set in Bottom or Top Bib Details
 * @param {Identifier[]} value The Identifier Values from the Bib
 * @returns {Identifier[] | never} An Array with the appropriate Identifier Object or Null
 */
function validIdentifier(field, value) {
  return field.value === 'identifier'
    ? LibraryItem.getIdentifierEntitiesByType(value, field.identifier)
    : null;
}

/**
 *
 * @param {Bib} bib The Bib Object
 * @param {FieldDefinition} field A Single Field Object Set in Bottom or Top Bib Details
 * @param {Resource[]} resources The Resources plucked from the Bib
 * @returns {Array<string | BibDefinition | Note | Identifer | Resource> | undefined} An array of a mapped field to the bib value
 */
function buildValue(bib, field, resources) {
  if (field.label === 'Electronic Resource') {
    return resources.length ? resources : undefined;
  }

  if (field.label === 'Owning Institutions') {
    const owner = getOwner(bib);
    return owner ? [owner] : undefined;
  }

  if (field.value === 'note') {
    return bib[field.value];
  }

  const val = extractParallels(bib, field.value) || bib[field.value];

  if (field.value === 'identifier' && val) {
    const ident = validIdentifier(field, val);
    // To avoid adding a label with empty array for identifiers
    if (ident && !ident.length) return;

    return ident;
  }

  return val;
}
