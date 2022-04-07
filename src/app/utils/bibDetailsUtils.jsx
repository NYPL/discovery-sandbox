import React from 'react';
import { isNyplBnumber } from './utils';

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

const getNoteType = (note) => {
  const type = note.noteType || '';
  return type.toLowerCase().includes('note') ? type : `${type} (note)`;
};

const groupNotes = (note = []) => {
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
  definitionItem,
  definitionMarcs,
  combineBibDetailsData,
  getNoteType,
  groupNotes,
};
