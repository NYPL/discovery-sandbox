import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ItemFilter from './ItemFilter';
import { trackDiscovery } from '../../utils/utils';
import { itemFilters } from '../../data/constants';

const ItemFilters = ({ items }) => {
  if (!items || !items.length) return null;
  const [openFilter, changeOpenFilter] = useState('none');

  const manageFilterDisplay = (filterType) => {
    if (filterType === openFilter) {
      trackDiscovery('Search Filters', `Close Filter - ${filterType}`);
      changeOpenFilter('none');
    } else {
      if (filterType === 'none') trackDiscovery('Search Filters', `Close Filter - ${openFilter}`);
      else {
        trackDiscovery('Search Filters', `Open Filter - ${openFilter}`);
      }
      changeOpenFilter(filterType);
    }
  };

  return (
    <div id="item-filters" className="item-table-filters">
      {
        itemFilters.map(filter => (
          <ItemFilter
            filter={filter.type}
            options={filter.options(items)}
            open={openFilter === filter.type}
            manageFilterDisplay={manageFilterDisplay}
            key={filter.type}
          />
        ))
      }
    </div>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
};

export default ItemFilters;
