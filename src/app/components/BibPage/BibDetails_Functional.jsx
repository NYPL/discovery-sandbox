import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';
import { useBib } from '../../context/Bib.Provider';
import { combineBibDetailsData } from '../../utils/bibDetailsUtils';
import getOwner from '../../utils/getOwner';
import { trackDiscovery } from '../../utils/utils';
import DefinitionField from './components/DefinitionField';
import NoteList from './components/NoteList';
import DefinitionList from './DefinitionList';

const buildDefiniions = (bib, fields = []) => {
  return fields
    .filter(({ value }) => _isArray(bib[value]) && !_isEmpty(bib[value]))
    .reduce((store, field, idx, fieldsArr) => {
      const origin = bib[field.value];
      fields;
      return [
        ...store,
        {
          term: field.label,
          definition: <DefinitionField bibValues={origin} field={field} />,
        },
      ];
    }, []);

  // .forEach((field) => {
  //   let bibValues = bib[field.value];

  //   if (field.value === 'subjectLiteral') {
  //     bibValues = this.compressSubjectLiteral(bib[field.value]);
  //   }

  //   // skip absent fields
  //   if (bibValues && bibValues.length && _isArray(bibValues)) {
  //     fieldsToRender.push({
  //       term: field.label,
  //       definition: <DefinitionObject bibValues={bibValues} field={field} />,
  //       // transaltions: (
  //       //   <DefinitionObject bibValues={bibValues} field={field} />
  //       // ),
  //       // definition: this.getDefinition(bibValues, field),
  //       // transaltions: this.getDefinition(bibValues, field),
  //     });
  //   }

  //   // The Owner is complicated too.
  //   if (field.label === 'Owning Institutions') {
  //     const owner = getOwner(this.props.bib);
  //     if (owner) {
  //       fieldsToRender.push({
  //         term: field.label,
  //         definition: owner,
  //       });
  //     }
  //   }

  //   // Note field rendering as array of objects instead of an array of strings.
  //   // Parse the original and new note format.
  //   // Original format: ['string1', 'string2']
  //   // 2018 format:
  //   //    [{'noteType': 'string',
  //   //     'prefLabel': 'string',
  //   //     '@type': 'bf:Note'},
  //   //    {...}]
  //   if (field.label === 'Notes') {
  //     const note = bib.note && bib.note.length ? bib.note : null;

  //     // Make sure we have at least one note
  //     if (Array.isArray(note)) {
  //       // Group notes by noteType:
  //       const notesGroupedByNoteType = note
  //         // Make sure all notes are blanknodes:
  //         .filter((note) => typeof note === 'object')
  //         .reduce((groups, note) => {
  //           const noteType = this.getNoteType(note);
  //           if (!groups[noteType]) groups[noteType] = [];
  //           groups[noteType].push(note);
  //           return groups;
  //         }, {});

  //       // For each group of notes, add a fieldToRender:
  //       Object.keys(notesGroupedByNoteType).forEach((noteType) => {
  //         fieldsToRender.push({
  //           term: noteType,
  //           definition: (
  //             <NoteList group={notesGroupedByNoteType} type={noteType} />
  //           ),
  //         });
  //       });
  //     }
  //   }

  //   if (
  //     field.label === 'Electronic Resource' &&
  //     this.props.electronicResources.length
  //   ) {
  //     const electronicResources = this.props.electronicResources;
  //     let electronicElem;

  //     if (electronicResources.length === 1) {
  //       const electronicItem = electronicResources[0];
  //       electronicElem = (
  //         <a
  //           href={electronicItem.url}
  //           target='_blank'
  //           onClick={() =>
  //             trackDiscovery(
  //               'Bib fields',
  //               `Electronic Resource - ${electronicItem.label} - ${electronicItem.url}`,
  //             )
  //           }
  //           rel='noreferrer'
  //         >
  //           {electronicItem.label || electronicItem.url}
  //         </a>
  //       );
  //     } else {
  //       electronicElem = (
  //         <ul>
  //           {electronicResources.map((resource) => (
  //             <li key={resource.label}>
  //               <a
  //                 href={resource.url}
  //                 target='_blank'
  //                 onClick={() =>
  //                   trackDiscovery(
  //                     'Bib fields',
  //                     `Electronic Resource - ${resource.label} - ${resource.url}`,
  //                   )
  //                 }
  //                 rel='noreferrer'
  //               >
  //                 {resource.label || resource.url}
  //               </a>
  //             </li>
  //           ))}
  //         </ul>
  //       );
  //     }

  //     fieldsToRender.push({
  //       term: field.label,
  //       definition: electronicElem,
  //     });
  //   }
  // }); // End of the forEach loop

  return fieldsToRender;
};

const BibDetails_Functional = ({ fields, additionalData }) => {
  const {
    bib,
    bib: { subjectHeadingData },
  } = useBib();

  const listItems = useMemo(() => {
    return;
  }, []);

  // Make sure fields is a nonempty array:
  if (_isEmpty(fields) || !_isArray(fields)) {
    return null;
  }
  const definitions = buildDefiniions(bib, fields);
  const data = combineBibDetailsData(definitions, additionalData);

  return <DefinitionList data={data} headings={subjectHeadingData} />;
};

BibDetails_Functional.propTypes = {
  fields: PropTypes.array.isRequired,
  electronicResources: PropTypes.array,
  additionalData: PropTypes.array,
};

BibDetails_Functional.defaultProps = {
  electronicResources: [],
  additionalData: [],
};

BibDetails_Functional.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails_Functional;
