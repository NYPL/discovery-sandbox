import PropTypes from 'prop-types';
import React from 'react';

const NoteList = ({ group, type }) => {
  return (
    <ul>
      {group[type].map((note, idx) => (
        <li key={idx.toString()}>{note.prefLabel}</li>
      ))}
    </ul>
  );
};

NoteList.propTypes = {
  group: PropTypes.object,
  type: PropTypes.string,
};

export default NoteList;
