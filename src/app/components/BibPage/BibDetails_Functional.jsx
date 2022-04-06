import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';
import { useBib } from '../../context/Bib.Provider';
import { combineBibDetailsData } from '../../utils/bibDetailsUtils';
import DefinitionField from './components/DefinitionField';
import DefinitionList from './DefinitionList';

const BibDetails_Functional = ({ fields = [], additionalData, resources }) => {
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

      if (origin) {
        return [
          ...store,
          {
            term: field.label,
            definition: (
              <DefinitionField
                bibValues={origin}
                field={field}
                additional={additionalData}
              />
            ),
          },
        ];
      }

      return store;
    }, []);
  }, [additionalData, bib, fields, resources]);

  // Make sure fields is a nonempty array
  if (_isEmpty(fields) || !_isArray(fields)) {
    return null;
  }

  const data =
    (!additionalData.length && definitions) ||
    combineBibDetailsData(definitions, additionalData);

  return <DefinitionList data={data} headings={subjectHeadingData} />;
};

BibDetails_Functional.propTypes = {
  fields: PropTypes.array.isRequired,
  resources: PropTypes.array,
  additionalData: PropTypes.array,
};

BibDetails_Functional.defaultProps = {
  additionalData: [],
};

BibDetails_Functional.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails_Functional;
