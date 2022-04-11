import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';
import { useBib } from '../../context/Bib.Provider';
import { combineBibDetailsData, groupNotes } from '../../utils/bibDetailsUtils';
import DefinitionField from './components/DefinitionField';
import DefinitionNoteField from './components/DefinitionNoteField';
import DefinitionList from './DefinitionList';

const BibDetails_Functional = ({ fields = [], marcs, resources }) => {
  const {
    bib,
    bib: { subjectHeadingData },
  } = useBib();

  // This does not Memoize due to Redux setting a New Bib Item
  // Potential for Improvement
  // TODO: Make ticket
  const definitions = useMemo(() => {
    // Loops through fields and builds the Definition Field Component
    return fields.reduce((store, field) => {
      const origin =
        bib[field.value] ??
        // Allow origin to be resources
        (field.label === 'Electronic Resource' &&
          resources.length &&
          resources);

      if (field.value === 'note') {
        // INVESTIGATE:
        // Can we avoid having to loop here?
        // Although unlikely what happens at groups of 10, 20, ...100
        const group = groupNotes(origin);

        return [
          ...store,
          // In order to get the noteType as a label
          // we need to process this here
          ...Object.entries(group).map(([label, [note]]) => {
            return {
              // term is the label of the feild
              term: label,
              // definition is the value of the label
              definition: <DefinitionNoteField value={note} />,
            };
          }),
        ];
      }

      if (origin) {
        return [
          ...store,
          {
            term: field.label,
            definition: (
              <DefinitionField
                bibValues={origin}
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
  }, [marcs, bib, fields, resources]);

  // Make sure fields is a nonempty array
  if (_isEmpty(fields) || !_isArray(fields)) {
    return null;
  }

  const data = combineBibDetailsData(definitions, marcs);

  return <DefinitionList data={data} headings={subjectHeadingData} />;
};

BibDetails_Functional.propTypes = {
  fields: PropTypes.array.isRequired,
  resources: PropTypes.array,
  marcs: PropTypes.array,
};

BibDetails_Functional.defaultProps = {
  marcs: [],
};

BibDetails_Functional.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails_Functional;
