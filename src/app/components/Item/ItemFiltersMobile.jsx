import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@nypl/design-system-react-components';
import ItemFilter from './ItemFilter';

import { trackDiscovery } from '../../utils/utils';
import { itemFilters } from '../../data/constants';


const ItemFiltersMobile = ({ options, openFilter, manageFilterDisplay }, context) => {
  const [displayFilters, toggleFilters] = useState(false);
  if (!displayFilters) return (
    <Button
      onClick={() => toggleFilters(true)}
      buttonType="outline"
    >Filters</Button>
  );

  return (
    <div id="item-filters" className="item-table-filters">
      {
        itemFilters.map(filter => (
          <ItemFilter
            filter={filter.type}
            options={options[filter.type]}
            open={openFilter === filter.type}
            manageFilterDisplay={manageFilterDisplay}
            key={filter.type}
          />
        ))
      }
    </div>
  );
};

ItemFiltersMobile.propTypes = {
  items: PropTypes.array,
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.number,
};

ItemFiltersMobile.contextTypes = {
  router: PropTypes.object,
};

export default ItemFiltersMobile;
