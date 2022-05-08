import React from 'react';
import { capitalize, isNyplBnumber } from './utils';

const definitionItem = (value, index = 0) => {
  const link = (
    <a href={value.content} title={JSON.stringify(value.source, null, 2)}>
      {value.label}
    </a>
  );

  return (
    <div key={index}>
      {value.label ? link : value.content}
      {value.parallels ? value.parallels : null}
    </div>
  );
};

const definitionMarcs = (bib = {}) => {
  return isNyplBnumber(bib.uri) && bib.annotatedMarc
    ? bib.annotatedMarc.bib.fields.map((field) => ({
        term: field.label,
        definition: field.values.map(definitionItem),
      }))
    : [];
};

const combineBibDetailsData = (bibDetails, additionalData) => {
  if (!additionalData || !additionalData.length) return bibDetails;

  const bibDetailsTerms = new Set(bibDetails.map((item) => item.term));
  const filteredAdditionalData = additionalData.filter(
    (item) => !bibDetailsTerms.has(item.term),
  );
  return bibDetails.concat(filteredAdditionalData);
};

/**
 *
 * Extract the noteType from the note and post fix it with "(note)"
 * @param note Note object
 * @return The noteType field postfixed with "(note)"
 *
 */
const getNoteType = (note) => {
  const type = note.noteType || '';
  return type.toLowerCase().includes('note') ? type : `${type} (note)`;
};

/**
 *
 * @param {Bib} bib object
 * @param {string} field string
 * @returns {ParallelMatrix} Array<string | undefined | never>[ ]
 *
 * ex: [ ['parallel', 'original'] ]
 */
const extractParallels = (bib = {}, field = '') => {
  const literal = bib[field];
  const parallel = bib['parallel' + capitalize(field)];
  if (!literal || !parallel) return undefined;

  // Set Parallel Matrix
  return literal.reduce((acc, lit, idx) => {
    acc.push([parallel[idx], lit]);
    return acc;
  }, []);
};

/**
 *
 * Set a new Notes object with a parallel property
 * @param note Note(object)[ ]
 * @param parallels string[ ]
 * @return A list of notes with a parallel property
 *
 */
const setParallelToNote = (note = [], bib) => {
  const parallels = extractParallels(bib, 'note');
  if (!parallels) return note;

  return note.map((note, idx) => {
    // Set new note object to avoid mutation
    const outNote = { ...note, parallel: null };
    // The index of note matches the index of parallels
    if (parallels[idx]) outNote.parallel = parallels[idx];
    return outNote;
  });
};

/**
 *
 * Group the notes by their noteType
 * @param note Note(object)[ ]
 * @return An object with properties from each noteType with their values set to the list of notes related to noteType
 * @return ex: { 'Biography (note)' : Note(object)[ ] }
 */
const groupNotesBySubject = (note = []) => {
  return (
    note
      // Make sure all notes are blanknodes:
      .filter((note) => typeof note === 'object')
      .reduce((groups, note) => {
        const noteType = getNoteType(note);
        if (!groups[noteType]) groups[noteType] = [];
        groups[noteType].push(note);
        return groups;
      }, {})
  );
};

export {
  combineBibDetailsData,
  definitionItem,
  definitionMarcs,
  extractParallels,
  getNoteType,
  groupNotesBySubject,
  setParallelToNote,
};
