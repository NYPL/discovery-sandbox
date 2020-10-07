import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ItemFilter from './ItemFilter';

const ItemFilters = ({ items }) => {
  if (!items || !items.length) return null;
  const [openFilter, changeOpenFilter] = useState('none');

  const manageFilterDisplay = (filterType) => {
    if (filterType === openFilter) changeOpenFilter('none');
    else changeOpenFilter(filterType);
  };

  const filters = [
    {
      type: 'location',
      options: items.map(item => ({
        label: item.location,
        id: item.holdingLocationCode.startsWith('loc:rc') ? 'offsite' : item.holdingLocationCode,
      })),
    },
    {
      type: 'format',
      options: items.map(item => ({
        label: item.format || '',
        id: item.materialType ? item.materialType['@id'] : '',
      })),
    },
    {
      type: 'status',
      options: items.map(item => ({
        label: item.requestable ? 'Requestable' : item.status.prefLabel,
        id: item.requestable ? 'requestable' : item.status['@id'],
      })),
    },
  ];

  return (
    <div id="item-filters" className="item-table-filters">
      {
        filters.map(filter => (
          <ItemFilter
            filter={filter.type}
            options={filter.options}
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
