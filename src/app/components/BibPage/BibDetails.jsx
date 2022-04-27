import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';
import { useBibParallel } from '../../context/Bib.Provider';
import {
  combineBibDetailsData,
  groupNotesBySubject,
  setParallelToNote,
} from '../../utils/bibDetailsUtils';
import LibraryItem from '../../utils/item';
import DefinitionField from './components/DefinitionField';
import DefinitionNoteField from './components/DefinitionNoteField';
import DefinitionList from './DefinitionList';

const BibDetails = ({ fields = [], marcs, resources }) => {
  const {
    bib,
    bib: { subjectHeadingData },
    parallels,
  } = useBibParallel();

  // This does not Memoize due to Redux setting a New Bib Item
  // Potential for Improvement
  // TODO: Make ticket
  const definitions = useMemo(() => {
    // Loops through fields and builds the Definition Field Component
    return fields.reduce((store, field) => {
      const value =
        bib[field.value] ??
        // Allow origin to be resources
        (field.label === 'Electronic Resource' &&
          resources.length &&
          resources);

      if (field.value === 'note' && value) {
        // INVESTIGATE:
        // Can we avoid having to loop here?
        // Although unlikely what happens at groups of 10, 20, ...100
        const paras = (parallels['note'] && parallels['note'].parallel) || [];
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
              definition: <DefinitionNoteField values={notes} />,
              // TODO: Can we use the DefinitionField instead of DefinitionNoteField?
              // definition: <DefinitionField bibValues={notes} field={field} />,
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
                // TODO: This is not correct
                // Additional checks for stying changes
                // It is suppose to style additional marcs
                // We do not apply the marcs here
                additional={!!marcs.length}
              />
            ),
          },
        ];
      }

      return store;
    }, []);
  }, [bib, fields, marcs.length, parallels, resources]);

  // Make sure fields is a nonempty array
  if (_isEmpty(fields) || !_isArray(fields)) {
    return null;
  }

  const data = combineBibDetailsData(definitions, marcs);

  return <DefinitionList data={data} headings={subjectHeadingData} />;
};

BibDetails.propTypes = {
  fields: PropTypes.array.isRequired,
  resources: PropTypes.array,
  marcs: PropTypes.array,
};

BibDetails.defaultProps = {
  marcs: [],
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;

function validIdentifier(field, value) {
  return field.value === 'identifier'
    ? LibraryItem.getIdentifierEntitiesByType(value, field.identifier)
    : null;
}
