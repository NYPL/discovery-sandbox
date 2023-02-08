import { Button, Heading, Text } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState, useRef, useCallback } from 'react';

import { updateBibPage } from '@Actions';
import { ajaxCall } from '@utils';
import appConfig from '../../data/appConfig';
import { trackDiscovery } from '../../utils/utils';
import { itemBatchSize } from '../../data/constants';
import { MediaContext } from '../Application/Application';
import ItemFilter from './ItemFilter';
import ItemFiltersMobile from './ItemFiltersMobile';
import DateSearchBar from './DateSearchBar';
import reverseItemFilterMap from '../../utils/reverseItemFilterMap';

const ItemFilters = (
  {
    displayDateFilter,
    numOfFilteredItems,
    itemsAggregations = [],
    dispatch,
    numItemsTotal,
    numItemsCurrent,
    mappedItemsLabelToIds = {}
  },
  { router },
) => {
  // given values of filter options ('loc:mal82,loc:rc2ma'), and the field they 
  // belongs to, returns an array of the labels they correspond to
  const getLabelsForValues = (values, field) => {
    return values.map((val) => getLabelForValue(val, field))
  }
  // given one value and the field it belongs to, returns the label it 
  // corresponds to
  const getLabelForValue = (value, field) => {
    const labels = Object.keys(mappedItemsLabelToIds[field])
    return labels.find((label) => mappedItemsLabelToIds[field][label].includes(value))
  }
  const mediaType = React.useContext(MediaContext);
  const { createHref, location } = router;
  const query = location.query || {};
  const initialFilters = {
    location: query.item_location ? [query.item_location.split(',')] : [],
    format: query.item_format ? [query.item_format.split(',')] : [],
    status: query.item_status ? [query.item_status.split(',')] : [],
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
    resultsRef.current &&  resultsRef.current.focus();
  }, [numOfFilteredItems, parsedFilterSelections]);

  /**
   * When new filters are selected or unselected, fetch new items.
   */
  const buildFilterUrl = (clear = false, clearYear = false) => {
    let queryParams = [];
    let queryObj = {};
    if (!clear) {
      // If we are making a request, get all the selected filters and map
      // the labels to their ids. That will be sent over to the API.
      Object.keys(selectedFields).forEach(filter => {
        const selectedFilterValues = selectedFields[filter].join(',')
        if (selectedFilterValues.length > 0) {
            queryParams.push(
              `item_${filter}=${selectedFilterValues}`);
            queryObj[`item_${filter}`] = selectedFilterValues;
        }
      });
      // The "year" filter is stored separately from the other filters.
      if (selectedYear && !clearYear) {
        queryParams.push(`item_date=${selectedYear}`);
        queryObj['item_date'] = selectedYear;
      }
    }
    return queryObj
    // Make the API call and let redux know.
    // ajaxCall(
    //   bibApi,
    //   (resp) => {
    //     const { bib } = resp.data;
    //     dispatch(
    //       updateBibPage({
    //         bib: Object.assign({}, bib, {
    //           itemFrom: parseInt(itemBatchSize, 10),
    //         }),
    //       }),
    //     );
    //   },
    //   (error) => {
    //     console.error(error);
    //   },
    // );
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
            filtersString = selectedOptions.map(value => getLabelsForValues(value, field).join(', ')).join(', ');
          } else {
            filtersString = selectedOptions;
          }
          return `${aggregation.field}: '${filtersString}'`;
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
    const clear = true;
    // getNewBib(clear);
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
        />
      ) : (
        <div
          id="item-filters"
          className="item-table-filters"
          tabIndex="-1"
        >
          <div>
            <Text isBold fontSize="text.caption" mb="xs">Filter by</Text>
            {itemsAggregations.map((filter) => (
              <ItemFilter
                filter={filter.field}
                key={filter.id}
                options={filter.values}
                isOpen={openFilter === filter.field}
                {...itemFilterComponentProps}
                getLabelsForValues={getLabelsForValues}
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
  mappedItemsLabelToIds: PropTypes.object,
  displayDateFilter: PropTypes.bool,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
