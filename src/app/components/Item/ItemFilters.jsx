import { Button, Heading, SearchBar, Text, TextInput } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import { itemFilters } from '../../data/constants';
import { trackDiscovery } from '../../utils/utils';
import { MediaContext } from '../Application/Application';
import ItemFilter from './ItemFilter';
import ItemFiltersMobile from './ItemFiltersMobile';

const ItemFilters = (
  { items, hasFilterApplied, numOfFilteredItems, itemsAggregations },
  { router },
) => {
  const mediaType = React.useContext(MediaContext);
  const { createHref, location } = router;
  const query = location.query || {};
  const initialFilters = {
    location: query.location || [],
    format: query.format || [],
    status: query.status || [],
    year: query.year || [],
  };
  const [openFilter, setOpenFilter] = useState('none');
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);

  if (!items || !items.length) return null;

  const manageFilterDisplay = (filterType) => {
    // reset `selectFilters` to `initialFilters` any time `openFilter` changes
    setSelectedFilters(initialFilters);
    if (filterType === openFilter) {
      trackDiscovery('Search Filters', `Close Filter - ${filterType}`);
      setOpenFilter('none');
    } else {
      if (filterType === 'none')
        trackDiscovery('Search Filters', `Close Filter - ${openFilter}`);
      else {
        trackDiscovery('Search Filters', `Open Filter - ${openFilter}`);
      }
      setOpenFilter(filterType);
    }
  };

  // join filter selections and add single quotes
  // TODO UPDATE
  const parsedFilterSelections = () =>
    itemFilters
      .map((filter) => {
        const filters = initialFilters[filter.type];
        if (filters.length) {
          let filtersString;
          if (Array.isArray(filters)) {
            filtersString = filters.join("', '");
          } else {
            filtersString = filters;
          }
          return `${filter.type}: '${filtersString}'`;
        }
        return null;
      })
      .filter((selected) => selected)
      .join(', ');

  const resetFilters = () => {
    const href = createHref({
      pathname: location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  const submitFilterSelections = () => {
    const href = createHref({
      ...location,
      ...{
        query: selectedFilters,
        hash: '#item-filters',
        search: '',
      },
    });
    trackDiscovery(
      'Search Filters',
      `Apply Filter - ${JSON.stringify(selectedFilters)}`,
    );
    console.log({selectedFilters});
    console.log({href});
    router.push(href);
  };

  const itemFilterComponentProps = {
    initialFilters,
    selectedFilters,
    setSelectedFilters,
    manageFilterDisplay,
    submitFilterSelections,
  };
  

  return (
    <Fragment>
      {['mobile', 'tabletPortrait'].includes(mediaType) ? (
        <ItemFiltersMobile
          options={options}
          {...itemFilterComponentProps}
        />
      ) : (
        <div id="item-filters" className="item-table-filters">
          <div>
            <Text isBold fontSize="text.caption" mb="xs">Filter by</Text>
            {itemsAggregations.map((filter) => (
              <ItemFilter
                filter={filter.field}
                key={filter.id}
                options={filter.values}
                isOpen={openFilter === filter.field}
                {...itemFilterComponentProps}
              />
            ))}
          </div>
          <div className='search-year-wrapper'>
            <Text isBold fontSize="text.caption" mb="xs">Search by Year</Text>
            <SearchBar
              id="search-year"
              onSubmit={(event) => {
                event.preventDefault();
                submitFilterSelections();
              }}
              textInputElement={
                <TextInput
                  id='search-year-input'
                  isClearable
                  labelText='Search by Year'
                  maxLength={4}
                  name='search-year'
                  pattern='[0-9]+'
                  placeholder='YYYY'
                  showLabel={false}
                  textInputType='searchBarSelect'
                  onChange={(event) => {
                    const year = event.target.value;
                    setSelectedFilters(prevSelected => ({
                      ...prevSelected,
                      year,
                    }));
                  }}
                  value={typeof selectedFilters?.year === 'string'
                    ? selectedFilters?.year : selectedFilters?.year[0]
                  }
                />
              }
            />
            <Button
              buttonType="text"
              id="clear-year-button"
              onClick={() => {
                setSelectedFilters(prevSelected => ({
                  ...prevSelected,
                  year: [],
                }));
              }}
            >
              Clear search year
            </Button>
          </div>
          {/* Empty div for flexbox even columns. */}
          <div></div>
        </div>
      )}
      <div className="item-filter-info">
        <Heading level="three" size="callout">
          <>
            {numOfFilteredItems > 0 ? numOfFilteredItems : 'No'} Result
            {numOfFilteredItems !== 1 ? 's' : null} Found
          </>
        </Heading>
        {hasFilterApplied ? (
          <>
            <span>Filtered by {parsedFilterSelections()}</span>
            <Button id="clear-filters-button" buttonType="text" onClick={() => resetFilters()}>
              Clear all filters
            </Button>
          </>
        ) : null}
      </div>
    </Fragment>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
  itemsAggregations: PropTypes.array,
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.number,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
