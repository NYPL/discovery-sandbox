import PropTypes from 'prop-types';
import React from 'react';

const DefinitionNoteField = ({ values }) => {
  // type value = Note[]
  return (
    <ul>
      {values
        .map((note, idx) => {
          return note && note.prefLabel ? (
            <>
              {note.parallel ? (
                <li key={`${note.noteType}_${idx}`}>{note.parallel}</li>
              ) : null}
              <li key={idx.toString()}>{note.prefLabel}</li>
            </>
          ) : null;
        })
        .filter(Boolean)}
    </ul>
  );
};

DefinitionNoteField.propTypes = {
  values: PropTypes.array,
};

export default DefinitionNoteField;
