import PropTypes from 'prop-types';
import React from 'react';
import { useBib } from '../../context/Bib.Provider';
import LibraryItem from '../../utils/item';
import {
  getAggregatedElectronicResources,
  pluckAeonLinksFromResource,
} from '../../utils/utils';
import LegacyCatalogLink from '../LegacyCatalog/LegacyCatalogLink';
import BibHeading from './BibHeading';
import BottomBibDetails from './BottomBibDetails';
import BibHoldings from './components/BibHoldings';
import BibItems from './components/BibItems';
import TopBibDetails from './TopBibDetails';

const BibContainer = ({ location, selection, keywords }) => {
  const { bib, bibId } = useBib();

  const items = (bib.checkInItems || []).concat(LibraryItem.getItems(bib));
  const resources = getAggregatedElectronicResources(items);

  return (
    <>
      <BibHeading searched={selection} />

      <TopBibDetails resources={pluckAeonLinksFromResource(resources, items)} />

      <BibItems items={items} location={location} keywords={keywords} />

      <BibHoldings />

      <BottomBibDetails bib={bib} resources={resources} />

      <LegacyCatalogLink recordNumber={bibId} />
    </>
  );
};

BibContainer.propTypes = {
  location: PropTypes.object,
  keywords: PropTypes.object,
  selection: PropTypes.object,
};

export default BibContainer;
