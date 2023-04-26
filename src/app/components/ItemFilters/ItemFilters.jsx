import { Button, Heading, Text } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';

import { trackDiscovery } from '../../utils/utils';
import { getLabelsForValues, initialLocations } from './itemFilterUtils';
import { MediaContext } from '../Application/Application';
import ItemFilter from './ItemFilter';
import ItemFiltersMobile from './ItemFiltersMobile';
import DateSearchBar from './DateSearchBar';

const ItemFilters = (
  {
    displayDateFilter,
    numItemsMatched,
    fieldToOptionsMap = {},
    itemsAggregations = [],
    showAll = false,
    finishedLoadingItems = false,
  },
  { router },
) => {
  const mediaType = React.useContext(MediaContext);
  const { createHref, location } = router;
  const query = location.query || {};
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
    let timeout;
    setSelectedFieldDisplayStr(parsedFilterSelections());
    // Once the new items are filtered and fetched, focus on the filter UI
    // and the results, but don't do this if the user requested to view all
    // items until all the items are fetched. It is annoying if the text
    // keeps getting focused and the page keeps jumping around.
    // The easiest way to figure out if a filter or year search was done,
    // is to check if the `selectedFieldDisplayStr` string is not empty.
    if (selectedFieldDisplayStr) {
      if (showAll && finishedLoadingItems) {
        resultsRef.current && resultsRef.current.focus();
      } else {
        // When filtering, delay the focus slightly because
        // of the loading animation screen.
        timeout = setTimeout(() => {
          resultsRef.current && resultsRef.current.focus();
        }, 1200);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showAll, finishedLoadingItems, selectedFieldDisplayStr, parsedFilterSelections]);

  /**
   * When filters are applied or cleared, build new filter query
   */
  const buildFilterQuery = (clearAll = false, clearYear = false, fieldToClear) => {
    let queryObj = {}
    let fieldsToQuery
    // clear is only true when we are clearing all filters, so return 
    //   empty query object
    if (clearAll) return queryObj
    // if there is a fieldToClear, need to build query with empty field.
    //  this call happens right after a setSelectedFields, and selectedFields
    //  is not yet updated with the new value by the time this query is built.
    if (fieldToClear) {
      fieldsToQuery = {
        ...selectedFields,
        [fieldToClear]: [],
      }
      // other wise, new filters are being applied
    } else {
      fieldsToQuery = selectedFields
    }
    Object.keys(fieldsToQuery).filter(field => fieldsToQuery[field].length).forEach(field => {
      const selectedFilterValues = fieldsToQuery[field].join(',')
        // build query  object with discovery-api-friendly item_(field) params
        queryObj[`item_${field}`] = selectedFilterValues;
      });
      // The "year" filter is stored separately from the other filters.
      if (selectedYear && !clearYear) {
        queryObj['item_date'] = selectedYear;
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
  }, [itemsAggregations, selectedFields, selectedYear, fieldToOptionsMap]);

  const resetFilters = () => {
    setSelectedFields(initialFilters);
    const href = createHref({
      pathname: location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  const submitFilterSelections = (clearAll = false, clearYear = false, field) => {
    const query = buildFilterQuery(clearAll, clearYear, field);
    const updatedSelectedFields = { ...selectedFields };
    if (selectedYear) {
      updatedSelectedFields.date = selectedYear;
    }
    if (clearYear) {
      delete updatedSelectedFields.date;
      setSelectedYear('');
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
    router.push(href);
  };

  const itemFilterComponentProps = {
    initialFilters,
    manageFilterDisplay,
    selectedFields,
    setSelectedFields,
    submitFilterSelections,
    fieldToOptionsMap,
  };
  // If there are filters, display the number of items that match the filters.
  // Otherwise, display the total number of items.
  const resultsItemsNumber = numItemsMatched;
  const madeFilterOrSearch = selectedFieldDisplayStr.length > 0;

  return (
    <Fragment>
      {['mobile', 'tabletPortrait'].includes(mediaType) ? (
        <ItemFiltersMobile
          displayDateFilter={displayDateFilter}
          itemsAggregations={itemsAggregations}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          {...itemFilterComponentProps}
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
                isOpen={openFilter === field.field}
                key={field.id}
                options={field.options}
                {...itemFilterComponentProps}
              />
            ))}
          </div>
          {displayDateFilter && (
            <DateSearchBar
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              submitFilterSelections={submitFilterSelections}
            />
          )}
          {/* Empty div for flexbox even columns. */}
          <div></div>
        </div>
      )}
      <div id="view-all-items" className="item-filter-info" tabIndex="-1" ref={resultsRef}>
        <Heading level="three" size="callout">
          <>
            {resultsItemsNumber > 0 ? resultsItemsNumber : 'No'}{' '}
            {madeFilterOrSearch ? 'Matching' : null} Item
            {resultsItemsNumber !== 1 ? 's' : null}
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
        {showAll ?
          <p>
            Loading all items {finishedLoadingItems ? "complete." : "..."}
          </p> : null
        }
      </div>
    </Fragment>
  );
};

ItemFilters.propTypes = {
  displayDateFilter: PropTypes.bool,
  fieldToOptionsMap: PropTypes.object,
  itemsAggregations: PropTypes.array,
  numItemsMatched: PropTypes.number,
  showAll: PropTypes.bool,
  finishedLoadingItems: PropTypes.bool,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
