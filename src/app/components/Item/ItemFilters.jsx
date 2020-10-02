import React from 'react';
import PropTypes from 'prop-types';

import FilterAccordion from './FilterAccordion';

const ItemFilters = ({ items }) => {
  return (
    <div id="item-filters" className="item-table-filters">
      <FilterAccordion
        filterLabel="Location"
        filterOptions={items.map(item => ({
          label: item.location,
          id: item.holdingLocationCode,
        }))}
      />
      <FilterAccordion
        filterLabel="Format"
        filterOptions={items.map(item => ({
          label: item.format,
          id: item.materialType['@id'],
        }))}
      />
      <FilterAccordion
        filterLabel="Status"
        filterOptions={items.map(item => ({
          label: item.requestable ? 'Request' : item.status.prefLabel,
          id: item.status['@id'],
        }))}
      />
    </div>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
};

export default ItemFilters;
