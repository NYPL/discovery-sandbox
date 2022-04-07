import PropTypes from 'prop-types';
import React from 'react';
import { useBibParallel } from '../../../context/Bib.Provider';

const NoteList = ({ notes, type }) => {
  const {
    hasParallels,
    field: { mapping = [] },
  } = useBibParallel('note');

  const list = (hasParallels && mapping) || notes;

  return (
    <ul>
      {list
        .map((note, idx, ogArr) => {
          // Check by object reference
          if (note === notes[0] || type === 'Note') {
            return (
              <>
                {(typeof ogArr[idx - 1] === 'string' && (
                  <li key={(idx - 1).toString()}>{ogArr[idx - 1]}</li>
                )) ||
                  null}
                <li key={idx.toString()}>{note.prefLabel ?? note}</li>
              </>
            );
          }

          return null;
        })
        .filter(Boolean)}
    </ul>
  );
};

NoteList.propTypes = {
  notes: PropTypes.array,
  type: PropTypes.string,
};

export default NoteList;
