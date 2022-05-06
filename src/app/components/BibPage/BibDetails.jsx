import PropTypes from 'prop-types';
import React from 'react';
import {
  combineBibDetailsData,
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
  // Loops through fields and builds the Definition Field Component
  const definitions = fields.reduce((store, field) => {
    const value = buildValue();

    if (field.value === 'note' && value) {
      // Due to notes potentially having multiple subjects
      // The store needs to be extended with all the subjects
      const paras =
        (bib.parallels &&
          bib.parallels['note'] &&
          bib.parallels['note'].parallel) ||
        [];
      // Extend the notes subjects with any parallels to keep index mapping
      const group = groupNotesBySubject(setParallelToNote(value, paras));

      return [
        ...store,
        // In order to get the noteType as a label
        // we need to process this here
        ...Object.entries(group).map(([label, notes]) => {
          // type notes = Note[]
          return {
            // term is the label of the feild
            term: label,
            // definition is the value of the label
            definition: <DefinitionNoteField values={notes} bib={bib} />,
          };
        }),
      ];
    }

    if (value) {
      const ident = validIdentifier(field, value);
      // To avoid adding a label with empty array for identifiers
      if (ident && !ident.length) return store;

      return [
        ...store,
        {
          term: field.label,
          definition: (
            <DefinitionField
              bibValues={ident ?? value}
              field={field}
              bib={bib}
            />
          ),
        },
      ];
    }

    return store;

    function buildValue() {
      const val = bib[field.value];

      if (field.label === 'Electronic Resource' && resources.length) {
        return resources;
      }

      if (field.label === 'Owning Institutions') {
        return getOwner(bib);
      }

      return val;
    }
  }, []);

  // Make sure fields is a nonempty array
  if (isEmpty(fields) || !isArray(fields)) {
    return null;
  }

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
 * @param {object} field A Single Field Object Set in Bottom or Top Bib Details
 * @param {array} value The Identifier Values from the Bib
 * @returns An Array with the appropriate Identifier Object
 */
function validIdentifier(field, value) {
  return field.value === 'identifier'
    ? LibraryItem.getIdentifierEntitiesByType(value, field.identifier)
    : null;
}
