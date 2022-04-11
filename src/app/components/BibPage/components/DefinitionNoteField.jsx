import PropTypes from 'prop-types';
import React from 'react';
import { useBibParallel } from '../../../context/Bib.Provider';

const DefinitionNoteField = ({ value }) => {
  const { parallel } = useBibParallel('note');

  const list = parallel ?? [value];

  return (
    <ul>
      {list
        .map((note, idx) => {
          // Check by object reference
          return note[1] === value ? (
            <>
              {note[0] ? <li key={(idx - 1).toString()}>{note[0]}</li> : null}
              <li key={idx.toString()}>{note[1].prefLabel ?? note[1]}</li>
            </>
          ) : null;
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionNoteField.propTypes = {
  value: PropTypes.object,
};

export default DefinitionNoteField;
