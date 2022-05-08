import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { getBibId } from '../../utils/utils';
import ParallelsFields from '../Parallels/ParallelsFields';
import BackToSearchResults from './BackToSearchResults';

const BibHeading = ({ searched, bib }) => {
  if (!bib) return null;

  return (
    <section className='nypl-item-details__heading'>
      <Heading level={2}>
        <ParallelsFields content={bib.title[0]} field={'title'} bib={bib} />
      </Heading>

      <BackToSearchResults result={searched} bibId={getBibId(bib)} />
    </section>
  );
};

BibHeading.propTypes = {
  searched: PropTypes.object,
  bib: PropTypes.object,
};

export default BibHeading;
