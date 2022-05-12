import PropTypes from 'prop-types';
import React from 'react';
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

/** @type {FieldDefinition[]} */
const topFields = [
  { label: 'Title', value: 'titleDisplay' },
  { label: 'Author', value: 'creatorLiteral', linkable: true },
  { label: 'Publication', value: 'publicationStatement' },
  {
    label: 'Electronic Resource',
    value: 'React Component',
    linkable: true,
    selfLinkable: true,
  },
  {
    label: 'Supplementary Content',
    value: 'supplementaryContent',
    linkable: true,
    selfLinkable: true,
  },
];

const TopBibDetails = ({ resources = [], bib }) => {
  return (
    // TODO: [SCC-3128] Replace Styles with ClassName or Constant
    <section style={{ marginTop: '20px' }}>
      <BibDetails fields={topFields} resources={resources} bib={bib} />
    </section>
  );
};

TopBibDetails.propTypes = {
  resources: PropTypes.array.isRequired,
  bib: PropTypes.object,
};

TopBibDetails.defaultProps = {
  resources: [],
};

export default TopBibDetails;
