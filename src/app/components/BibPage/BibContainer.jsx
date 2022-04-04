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
import LibraryHoldings from './LibraryHoldings';
import TopBibDetails from './TopBibDetails';

const ItemsContainer = itemsContainerModule.ItemsContainer;

const BibContainer = ({ location, searched, search }) => {
  const { bib, bibId } = useBib();

  const items = (bib.checkInItems || []).concat(LibraryItem.getItems(bib));
  const isElectronicResources = items.every(
    (item) => item.isElectronicResource,
  );
  const aggregatedElectronicResources = getAggregatedElectronicResources(items);

  return (
    <>
      <BibHeading searched={searched} />

      <TopBibDetails
        bib={bib}
        resources={pluckAeonLinksFromResource(
          aggregatedElectronicResources,
          items,
        )}
      />

      {items.length && !isElectronicResources && (
        <section style={{ marginTop: '20px' }}>
          <ItemsContainer
            key={bibId}
            shortenItems={location.pathname.indexOf('all') !== -1}
            items={items}
            bibId={bibId}
            itemPage={location.search}
            searchKeywords={search}
            holdings={bib.holdings}
          />
        </section>
      )}

      {bib.holdings && (
        <section style={{ marginTop: '20px' }}>
          <LibraryHoldings holdings={bib.holdings} />
        </section>
      )}

      <BottomBibDetails bib={bib} resources={aggregatedElectronicResources} />

      <LegacyCatalogLink recordNumber={bibId} display={bibId.startsWith('b')} />
    </>
  );
};

BibContainer.propTypes = {
  location: PropTypes.object,
  search: PropTypes.object,
  searched: PropTypes.object,
};

export default BibContainer;
