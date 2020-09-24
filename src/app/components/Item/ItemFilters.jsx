import React from 'react';
import PropTypes from 'prop-types';

import FilterAccordion from './FilterAccordion';

const ItemFilters = ({ items }) => {
  return (
    <div className="item-table-filters">
      <FilterAccordion
        filterLabel="Location"
        filterOptions={items.map(item => item.location)}
      />
      <FilterAccordion
        filterLabel="Format"
        filterOptions={items.map(item => item.format)}
      />
      <FilterAccordion
        filterLabel="Status"
        filterOptions={items.map(item => item.status.prefLabel)}
      />
    </div>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
};

export default ItemFilters;
