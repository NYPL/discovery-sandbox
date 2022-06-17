import PropTypes from 'prop-types';
import React from 'react';
import BibDetails from './BibDetails';

// `linkable` means that those values are links inside the app.
// `selfLinkable` means that those values are external links and should be self-linked,
// e.g. the prefLabel is the label and the URL is the id.
const topFields = [
  { label: 'Title', value: 'titleDisplay' },
  { label: 'Author', value: 'creatorLiteral', linkable: true },
  { label: 'Publication', value: 'publicationStatement' },
  { label: 'Electronic Resource', value: 'React Component' },
  {
    label: 'Supplementary Content',
    value: 'supplementaryContent',
    selfLinkable: true,
  },
];

const TopBibDetails = ({ bib, electronicResources }) => {
  return (
    <section style={{ marginTop: '20px' }}>
      <BibDetails
        bib={bib}
        fields={topFields}
        electronicResources={electronicResources}
      />
    </section>
  );
};

TopBibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  electronicResources: PropTypes.array.isRequired,
};

TopBibDetails.defaultProps = {
  electronicResources: [],
};

export default TopBibDetails;
