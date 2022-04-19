import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { useBib } from '../../context/Bib.Provider';
import ParallelsFields from '../Parallels/ParallelsFields';
import BackToSearchResults from './BackToSearchResults';

const BibHeading = ({ searched }) => {
  const {
    bib: { title = ' ' },
    bibId,
  } = useBib();

  return (
    <section className='nypl-item-details__heading'>
      <Heading level={2}>
        <ParallelsFields field={'title'} content={title[0]} />
      </Heading>

      <BackToSearchResults result={searched} bibId={bibId} />
    </section>
  );
};

BibHeading.propTypes = {
  searched: PropTypes.object,
};

export default BibHeading;
