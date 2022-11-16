import { Button, Heading, SearchBar, Text, TextInput } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

import { itemFilters } from '../../data/constants';
import { trackDiscovery } from '../../utils/utils';
import { MediaContext } from '../Application/Application';
import ItemFilter from './ItemFilter';
import ItemFiltersMobile from './ItemFiltersMobile';

const ItemFilters = (
  { items, hasFilterApplied, numOfFilteredItems },
  { router },
) => {
  const [openFilter, setOpenFilter] = useState('none');
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const { createHref } = router;
  const query = router.location.query || {};
  const initialFilters = {
    location: query.location || [],
    format: query.format || [],
    status: query.status || [],
    year: query.year || [],
  };
  
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

  const options = {};
  const mapFilterIdsToLabel = {};
  itemFilters.forEach((filter) => {
    const optionsObjEntry = options[filter.type];
    const filterOptions =
      optionsObjEntry || items.map((item) => filter.retrieveOption(item));
    if (!optionsObjEntry) options[filter.type] = filterOptions;
    filterOptions.forEach((option) => {
      mapFilterIdsToLabel[option.id] = option.label;
    });
  });

  // join filter selections and add single quotes
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
    const href = router.createHref({
      pathname: router.location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  const submitFilterSelections = (filters) => {
    const href = createHref({
      ...router.location,
      ...{
        query: filters,
        hash: '#item-filters',
        search: '',
      },
    });
    trackDiscovery(
      'Search Filters',
      `Apply Filter - ${JSON.stringify(filters)}`,
    );
    router.push(href);
  };

  const itemFilterComponentProps = {
    selectedFilters,
    manageFilterDisplay,
    setSelectedFilters,
    submitFilterSelections,
    initialFilters,
  };

  return (
    <Fragment>
      <MediaContext.Consumer>
        {(media) => (
          <Fragment>
            {['mobile', 'tabletPortrait'].includes(media) ? (
              <ItemFiltersMobile
                options={options}
                {...itemFilterComponentProps}
              />
            ) : (
              <div id="item-filters" className="item-table-filters">
                <div>
                  <Text isBold fontSize="text.caption" mb="xs">Filter by</Text>
                  {itemFilters.map((filter) => (
                    <ItemFilter
                      filter={filter.type}
                      key={filter.type}
                      options={options[filter.type]}
                      isOpen={openFilter === filter.type}
                      {...itemFilterComponentProps}
                    />
                  ))}
                </div>
                <div className='search-year-wrapper'>
                  <Text isBold fontSize="text.caption" mb="xs">Search by Year</Text>
                  <SearchBar
                    id="search-year"
                    onSubmit={() => {}}
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
                      />
                    }
                  />
                  <Button id="clear-year-button" onClick={() => {}} buttonType="text">
                    Clear search year
                  </Button>
                </div>
                {/* Empty div for flexbox even columns. */}
                <div></div>
              </div>
            )}
          </Fragment>
        )}
      </MediaContext.Consumer>
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
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.number,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
