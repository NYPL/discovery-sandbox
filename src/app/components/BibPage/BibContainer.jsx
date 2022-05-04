import PropTypes from 'prop-types';
import React from 'react';
import LibraryItem from '../../utils/item';
import { getBibId, getElectronics, pluckAeonLinks } from '../../utils/utils';
import LegacyCatalogLink from '../LegacyCatalog/LegacyCatalogLink';
import BibHeading from './BibHeading';
import BottomBibDetails from './BottomBibDetails';
import BibItems from './components/BibItems';
import LibraryHoldings from './LibraryHoldings';
import TopBibDetails from './TopBibDetails';

const BibContainer = ({ location, keywords, selection, bib }) => {
  const items = (bib.checkInItems || []).concat(LibraryItem.getItems(bib));
  const resources = getElectronics(items);

  return (
    <>
      <BibHeading searched={selection} bib={bib} />

      <TopBibDetails resources={pluckAeonLinks(resources, items)} bib={bib} />

      <BibItems
        items={items}
        keywords={keywords}
        location={location}
        bib={bib}
      />

      <LibraryHoldings holdings={bib.holdings} />

      <BottomBibDetails bib={bib} resources={resources} />

      <LegacyCatalogLink recordNumber={getBibId(bib)} />
    </>
  );
};

BibContainer.propTypes = {
  location: PropTypes.object,
  keywords: PropTypes.string,
  selection: PropTypes.object,
  bib: PropTypes.object,
};

export default BibContainer;
