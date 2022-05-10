import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React from 'react';
import { extractParallels } from '../../utils/bibDetailsUtils';
import { getBibId } from '../../utils/utils';
import BackToSearchResults from './BackToSearchResults';
import DirectionalText from './components/DirectionalText';

const BibHeading = ({ searched, bib }) => {
  if (!bib) return null;

  const titles = extractParallels(bib, 'title') || bib.title;

  return (
    <section className='nypl-item-details__heading'>
      <Heading level={2}>
        <>
          {titles.flat().map((title, idx) => (
            <DirectionalText key={`Heading_${title}:${idx}`} text={title} />
          ))}
        </>
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
