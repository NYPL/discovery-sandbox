import PropTypes from 'prop-types';
import React from 'react';
import { useBib } from '../../../context/Bib.Provider';
import { isElectronic } from '../../../utils/utils';
import itemsContainerModule from '../../Item/ItemsContainer';

const ItemsContainer = itemsContainerModule.ItemsContainer;

const BibItems = ({ items, keywords, location }) => {
  const { bib, bibId } = useBib();

  const display = items.length && !items.every(isElectronic);

  if (!display) return null;

  return (
    // TODO: [SCC-3127] Replace Styles with ClassName or Constant
    <section style={{ marginTop: '20px' }}>
      <ItemsContainer
        key={bibId}
        shortenItems={location.pathname.indexOf('all') !== -1}
        items={items}
        bibId={bibId}
        itemPage={location.search}
        searchKeywords={keywords}
        holdings={bib.holdings}
      />
    </section>
  );
};

BibItems.propTypes = {
  items: PropTypes.array,
  keywords: PropTypes.string,
  location: PropTypes.object,
};

export default BibItems;
