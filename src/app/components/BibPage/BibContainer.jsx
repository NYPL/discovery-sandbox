import PropTypes from 'prop-types';
import React from 'react';
import { useBib } from '../../context/Bib.Provider';
import LibraryItem from '../../utils/item';
import {
  getAggregatedElectronicResources,
  pluckAeonLinksFromResource,
} from '../../utils/utils';
import itemsContainerModule from '../Item/ItemsContainer';
import LegacyCatalogLink from '../LegacyCatalog/LegacyCatalogLink';
import BibHeading from './BibHeading';
import BottomBibDetails from './BottomBibDetails';
import BibItems from './components/BibItems';
import LibraryHoldings from './LibraryHoldings';
import TopBibDetails from './TopBibDetails';

const BibContainer = ({ location, selection, keywords }) => {
  const { bib, bibId } = useBib();

  const items = (bib.checkInItems || []).concat(LibraryItem.getItems(bib));
  const aggregatedElectronicResources = getAggregatedElectronicResources(items);

  return (
    <>
      <BibHeading searched={selection} />

      <TopBibDetails
        resources={pluckAeonLinksFromResource(
          aggregatedElectronicResources,
          items,
        )}
      />

      <BibItems items={items} location={location} keywords={keywords} />

      {bib.holdings && (
        <section style={{ marginTop: '20px' }}>
          <LibraryHoldings holdings={bib.holdings} />
        </section>
      )}

      <BottomBibDetails bib={bib} resources={aggregatedElectronicResources} />

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
