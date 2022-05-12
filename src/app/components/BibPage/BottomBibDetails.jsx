import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { definitionMarcs } from '../../utils/bibDetailsUtils';
import BibDetails from './BibDetails';

/**
 * - The type definition of the field objects used to define the displayed field in BibDetails
 * - `linkable` means that those values are links inside the app.
 * - `selfLinkable` means that those values are external links and should be self-linked,
 * - e.g. the prefLabel is the label and the URL is the id.
 * @typedef {Object} FieldDefinition
 * @property {string} label - The label to display in the Dom for a particular Bib Field
 * @property {string} value - The Bib field property to map to
 * @property {true=} linkable - Whether or not the bib field value is linkable
 * @property {true=} selfLinkable - Whether or not a linkable field directs to an internal page
 */

const BottomBibDetails = ({ bib }) => {
  /** @type {FieldDefinition[]} */
  const fields = [
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
    bib.subjectHeadingData
      ? { label: 'Subject', value: 'subjectHeadingData' }
      : { label: 'Subject', value: 'subjectLiteral', linkable: true },
    { label: 'Genre/Form', value: 'genreForm' },
    { label: 'Notes', value: 'note' },
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

  // TODO: [SCC-3125] Move marcs inside BibDetails
  return (
    // TODO: [SCC-3124] Replace Styles with ClassName or Constant
    <section style={{ marginTop: '20px' }}>
      <Heading level={3}>Details</Heading>
      <BibDetails fields={fields} marcs={definitionMarcs(bib)} bib={bib} />
    </section>
  );
};

BottomBibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  resources: PropTypes.array.isRequired,
};

BottomBibDetails.defaultProps = {
  resources: [],
};

export default BottomBibDetails;

BottomBibDetails.propTypes = {
  bib: PropTypes.object,
};
