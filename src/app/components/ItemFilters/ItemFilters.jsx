import { Button, Heading, Text } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';

import { trackDiscovery } from '../../utils/utils';
import { getLabelsForValues } from '../../utils/itemFilterUtils';
import { MediaContext } from '../Application/Application';
import ItemFilter from './ItemFilter';
import ItemFiltersMobile from './ItemFiltersMobile';
import DateSearchBar from './DateSearchBar';

const ItemFilters = (
  {
    displayDateFilter,
    numOfFilteredItems,
    itemsAggregations = [],
    numItemsTotal,
    numItemsCurrent,
    fieldToOptionsMap = {}
  },
  { router },
) => {
  const mediaType = React.useContext(MediaContext);
  const { createHref, location } = router;
  const query = location.query || {};
  // there are multiple location codes for the single label offsite, 
  //   to keep count and maintain state for the Offsite location filter,
  //   we need to combine those filters back into one string
  const initialLocations = (locations) => {
    const concatenatedRecapLocations = locations.filter((loc) => loc.startsWith('loc:rc')).join(',')
    const removeRecap = locations.filter((loc) => !concatenatedRecapLocations.includes(loc))
    return [...removeRecap, concatenatedRecapLocations]
  }
  const initialFilters = {
    location: query.item_location ? initialLocations(query.item_location.split(',')) : [],
    format: query.item_format ? query.item_format.split(',') : [],
    status: query.item_status ? query.item_status.split(',') : [],
  };
  const resultsRef = useRef(null);
  const [openFilter, setOpenFilter] = useState('none');
  // The "year" filter is not used for the `ItemFilter` dropdown component
  // and must be handled separately in the `SearchBar` component.
  const [selectedYear, setSelectedYear] = useState(query.item_date || '');
  const [selectedFields, setSelectedFields] = useState(initialFilters);
  const [selectedFieldDisplayStr, setSelectedFieldDisplayStr] = useState('');

  // When new items are fetched, update the selected string display.
  useEffect(() => {
    setSelectedFieldDisplayStr(parsedFilterSelections());
    // Once the new items are fetched, focus on the
    // filter UI and the results.
    resultsRef.current && resultsRef.current.focus();
  }, [numOfFilteredItems, parsedFilterSelections]);

  /**
   * When new filters are selected or unselected, fetch new items.
   */
  const buildFilterUrl = (clear = false, clearYear = false) => {
    let queryObj = {};
    if (!clear) {
      Object.keys(selectedFields).filter(field => selectedFields[field].length).forEach(field => {
        const selectedFilterValues = selectedFields[field].join(',')
        // build query  object with discovery-api-friendly item_(field) params
        queryObj[`item_${field}`] = selectedFilterValues;
      });
      // The "year" filter is stored separately from the other filters.
      if (selectedYear && !clearYear) {
        queryObj['item_date'] = selectedYear;
      }
    }
    return queryObj
  }

  const manageFilterDisplay = (filterType) => {
    // reset `selectFilters` to `initialFilters` any time `openFilter` changes
    setSelectedFields(initialFilters);
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
  const parsedFilterSelections = useCallback(() => {
    let filterSelectionString = itemsAggregations
      .map((aggregation) => {
        const field = aggregation.field
        const selectedOptions = selectedFields[field];
        if (selectedOptions.length) {
          let filtersString;
          // inital filters may be [undefined]
          if (Array.isArray(selectedOptions) && selectedOptions[0]) {
            filtersString = getLabelsForValues(selectedOptions, field, fieldToOptionsMap).map(label => `'${label}'`).join(', ');
          } else {
            filtersString = selectedOptions;
          }
          return `${aggregation.field}: ${filtersString}`;
        }
        return null;
      })
      .filter((selected) => selected);

    if (selectedYear) {
      filterSelectionString.push(`year: '${selectedYear}'`);
    }

    return filterSelectionString.join(', ');
  }, [itemsAggregations, selectedFields, selectedYear]);

  const resetFilters = () => {
    setSelectedFields(initialFilters);
    const href = createHref({
      pathname: location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  const submitFilterSelections = (clear = false, clearYear = false) => {
    const query = buildFilterUrl(clear, clearYear);
    const updatedselectedFields = { ...selectedFields };
    if (selectedYear) {
      updatedselectedFields.date = selectedYear;
    }
    if (clearYear) {
      delete updatedselectedFields.date;
    }
    const href = createHref({
      ...location,
      ...{
        query,
        hash: '#item-filters',
        search: '',
      },
    });
    trackDiscovery(
      'Search Filters',
      `Apply Filter - ${JSON.stringify(selectedFields)}`,
    );
    router.push(href)
    setSelectedYear('');
  };

  const itemFilterComponentProps = {
    initialFilters,
    selectedFields,
    setSelectedFields,
    manageFilterDisplay,
    submitFilterSelections,
  };
  // If there are filters, display the number of items that match the filters.
  // Otherwise, display the total number of items.
  const resultsItemsNumber = selectedFieldDisplayStr ? numItemsCurrent : numItemsTotal;

  return (
    <Fragment>
      {['mobile', 'tabletPortrait'].includes(mediaType) ? (
        <ItemFiltersMobile
          displayDateFilter={displayDateFilter}
          itemsAggregations={itemsAggregations}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          {...itemFilterComponentProps}
          fieldToOptionsMap={fieldToOptionsMap}
        />
      ) : (
        <div
          id="item-filters"
          className="item-table-filters"
          tabIndex="-1"
        >
          <div>
            <Text isBold fontSize="text.caption" mb="xs">Filter by</Text>
              {itemsAggregations.map((field) => (
              <ItemFilter
                  field={field.field}
                  key={field.id}
                  options={field.options}
                  isOpen={openFilter === field.field}
                {...itemFilterComponentProps}
                  fieldToOptionsMap={fieldToOptionsMap}
              />
            ))}
          </div>
          {displayDateFilter && (<DateSearchBar
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            submitFilterSelections={submitFilterSelections}
          />)}
          {/* Empty div for flexbox even columns. */}
          <div></div>
        </div>
      )}
      <div className="item-filter-info" ref={resultsRef} tabIndex="-1">
        <Heading level="three" size="callout">
          <>
            {resultsItemsNumber > 0 ? resultsItemsNumber : 'No'} Result
            {resultsItemsNumber !== 1 ? 's' : null} Found
          </>
        </Heading>
        {selectedFieldDisplayStr ? (
          <>
            <span>Filtered by {selectedFieldDisplayStr}</span>
            <Button
              buttonType="text"
              id="clear-filters-button"
              onClick={resetFilters}
            >
              Clear all filters
            </Button>
          </>
        ) : null}
      </div>
    </Fragment>
  );
};

ItemFilters.propTypes = {
  itemsAggregations: PropTypes.array,
  numOfFilteredItems: PropTypes.number,
  dispatch: PropTypes.func,
  numItemsTotal: PropTypes.number,
  numItemsCurrent: PropTypes.number,
  fieldToOptionsMap: PropTypes.object,
  displayDateFilter: PropTypes.bool,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
