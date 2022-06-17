import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import {
  annotatedMarcDetails,
  getGroupedNotes,
  getIdentifiers,
} from '../../utils/bibDetailsUtils';
import { isNyplBnumber } from '../../utils/utils';
import getOwner from '../../utils/getOwner';
import BibDetails from './BibDetails';

const BottomBibDetails = ({ bib, electronicResources }) => {
  // `linkable` means that those values are links inside the app.
  // `selfLinkable` means that those values are external links and should be self-linked,
  // e.g. the prefLabel is the label and the URL is the id.
  const detailsFields = [
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
  ];

  const newBibModel = { ...bib };
  newBibModel["notesGroupedByNoteType"] = getGroupedNotes(bib);
  newBibModel["owner"] = getOwner(bib);
  newBibModel["updatedIdentifiers"] = getIdentifiers(newBibModel, detailsFields);

  return (
    <section style={{ marginTop: '20px' }}>
      <Heading level={3}>Details</Heading>
      <BibDetails
        bib={newBibModel}
        fields={detailsFields}
        electronicResources={electronicResources}
        additionalData={
          isNyplBnumber(bib.uri) && bib.annotatedMarc
            ? annotatedMarcDetails(bib)
            : []
        }
      />
    </section>
  );
};

BottomBibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  electronicResources: PropTypes.array.isRequired,
};

BottomBibDetails.defaultProps = {
  electronicResources: [],
};

export default BottomBibDetails;
