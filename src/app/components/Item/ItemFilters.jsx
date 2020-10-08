import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@nypl/design-system-react-components';
import ItemFilter from './ItemFilter';
import { trackDiscovery } from '../../utils/utils';
import { itemFilters } from '../../data/constants';


const ItemFilters = ({ items, hasFilterApplied, query }, { router }) => {
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

  const numOfItems = items.length;
  const filterSelections = itemFilters.map(
    filter => query[filter.type]).filter(selections => selections);
  // join filter selections and add single quotes
  const parsedFilterSelections = () => {
    const joinedText = filterSelections.join("', '");
    return `'${joinedText}'`;
  };

  const resetFilters = () => {
    const href = router.createHref({
      pathname: router.location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  return (
    <Fragment>
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
      <div className="item-filter-info">
        <h3>{numOfItems} Result{numOfItems > 1 ? 's' : null} Found</h3>
        {hasFilterApplied ? <span>Filtered by {parsedFilterSelections()}</span> : null}
        {
          hasFilterApplied ? (
            <Button
              buttonType="link"
              onClick={() => resetFilters()}
            >Clear all filters
            </Button>
          ) : null
        }
      </div>
    </Fragment>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
  hasFilterApplied: PropTypes.bool,
  query: PropTypes.object,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
