import React from 'react';
import LibraryItem from './item';

// `linkable` means that those values are links inside the app.
// `selfLinkable` means that those values are external links and should be self-linked,
// e.g. the prefLabel is the label and the URL is the id.
const allFields = {
  top: [
    { label: 'Title', value: 'titleDisplay' },
    { label: 'Author', value: 'creatorLiteral', linkable: true },
    { label: 'Publication', value: 'publicationStatement' },
    { label: 'Electronic Resource', value: 'React Component' },
    {
      label: 'Supplementary Content',
      value: 'supplementaryContent',
      selfLinkable: true,
    },
  ],
  bottom: (bib) => [
    {
      label: 'Additional Authors',
      value: 'contributorLiteral',
      linkable: true,
    },
    { label: 'Found In', value: 'partOf' },
    { label: 'Publication Date', value: 'serialPublicationDates' },
    { label: 'Description', value: 'extent' },
    { label: 'Donor/Sponsor', value: 'donor' },
    { label: 'Series Statement', value: 'seriesStatement' },
    { label: 'Uniform Title', value: 'uniformTitle' },
    { label: 'Alternative Title', value: 'titleAlt' },
    { label: 'Former Title', value: 'formerTitle' },
    // if the subject heading API call failed for some reason,
    bib.subjectHeadingData ? { label: 'Subject', value: 'subjectHeadingData' } : { label: 'Subject', value: 'subjectLiteral', linkable: true },
    { label: 'Genre/Form', value: 'genreForm' },
    { label: 'Notes', value: 'React Component' },
    { label: 'Contents', value: 'tableOfContents' },
    { label: 'Bibliography', value: '' },
    { label: 'Call Number', value: 'identifier', identifier: 'bf:ShelfMark' },
    { label: 'ISBN', value: 'identifier', identifier: 'bf:Isbn' },
    { label: 'ISSN', value: 'identifier', identifier: 'bf:Issn' },
    { label: 'LCCN', value: 'identifier', identifier: 'bf:Lccn' },
    { label: 'OCLC', value: 'identifier', identifier: 'nypl:Oclc' },
    { label: 'GPO', value: '' },
    { label: 'Other Titles', value: '' },
    { label: 'Owning Institutions', value: '' },
  ],
};

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

const annotatedMarcDetails = (bib) =>
  bib.annotatedMarc.bib.fields.map((field) => ({
    term: field.label,
    definition: field.values.map(definitionItem),
  }));

const combineBibDetailsData = (bibDetails, additionalData) => {
  const bibDetailsTerms = new Set(bibDetails.map((item) => item.term));
  const filteredAdditionalData = additionalData.filter(
    (item) => !bibDetailsTerms.has(item.term),
  );
  return bibDetails.concat(filteredAdditionalData);
};

const getGroupedNotes = (bib) => {
  const note = bib?.note?.length ? bib.note : null;
  let notesGroupedByNoteType = {};

  /**
   * getNoteType(note)
   * Construct label for a note by adding the word 'Note'
   *
   * @param {object} note
   * @return {string}
   */
  const getNoteType = (note) => {
    const type = note.noteType || '';
    return type.toLowerCase().includes('note') ? type : `${type} (note)`;
  }

  if (!note) {
    return notesGroupedByNoteType;
  }
  // Make sure we have at least one note
  if (note && Array.isArray(note)) {
    // Group notes by noteType:
    notesGroupedByNoteType = note
      // Make sure all notes are blanknodes:
      .filter((note) => typeof note === 'object')
      .reduce((groups, note) => {
        const noteType = getNoteType(note);
        if (!groups[noteType]) {
          groups[noteType] = [];
        }
        groups[noteType].push(note);
        return groups;
      }, {});
  }
  return notesGroupedByNoteType;
};

/**
 * * Given an array of identifier entities and an rdf:type, returns markup to
   * render the values - if any - for the requested type.
   * 
 * @param {*} bib 
 * @param {*} detailsFields 
 * @returns 
 */
const getIdentifiers = (bib, detailsFields = []) => {
  const bibValues = bib?.identifier;
  const newIdentifiers = {};
  bibValues && detailsFields.forEach(fieldObject => {
    if (fieldObject.value === 'identifier') {
      const entities = LibraryItem.getIdentifierEntitiesByType(
        [...bibValues],
        fieldObject.identifier,
      );
      if (Array.isArray(entities) && entities.length > 0) {
        const markup = entities.map((ent, index) => (
          <span key={index}>
            {ent['@value']}
            {ent.identifierStatus ? (
              <em> ({ent.identifierStatus})</em>
            ) : null}
          </span>
        ));
        newIdentifiers[fieldObject.label] = markup;
      }
    }
  });
  return newIdentifiers;
};

export {
  allFields,
  annotatedMarcDetails,
  combineBibDetailsData,
  definitionItem,
  getGroupedNotes,
  getIdentifiers,
};
