import PropTypes from 'prop-types';
import React from 'react';
import { getBibId, isElectronic } from '../../../utils/utils';
import itemsContainerModule from '../../Item/ItemsContainer';

const ItemsContainer = itemsContainerModule.ItemsContainer;

const BibItems = ({ items, keywords, location, bib }) => {
  const display = items.length && !items.every(isElectronic);

  if (!display) return null;

  return (
    // TODO: [SCC-3127] Replace Styles with ClassName or Constant
    <section style={{ marginTop: '20px' }}>
      <ItemsContainer
        key={getBibId(bib)}
        shortenItems={location.pathname.indexOf('all') !== -1}
        items={items}
        bibId={getBibId(bib)}
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
  bib: PropTypes.object,
};

export default BibItems;
