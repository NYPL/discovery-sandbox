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
      <ParallelsFields headingLevel={2} field={'title'}>
        {title[0]}
      </ParallelsFields>

      <BackToSearchResults result={searched} bibId={bibId} />
    </section>
  );
};

BibHeading.propTypes = {
  searched: PropTypes.object,
};

export default BibHeading;
