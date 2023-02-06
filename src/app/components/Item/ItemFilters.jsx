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

const ItemFilters = (
  { displayDateFilter,
    numOfFilteredItems,
    itemsAggregations = [],
    dispatch,
    numItemsTotal,
    numItemsCurrent,
    mappedItemsLabelToIds = {}
  },
  { router },
) => {
  const mediaType = React.useContext(MediaContext);
  const { createHref, location } = router;
  const query = location.query || {};
  const initialFilters = {
    location: query.location || [],
    format: query.format || [],
    status: query.status || [],
  };
  const resultsRef = useRef(null);
  const [openFilter, setOpenFilter] = useState('none');
  // The "year" filter is not used for the `ItemFilter` dropdown component
  // and must be handled separately in the `SearchBar` component.
  const [selectedYear, setSelectedYear] = useState(query.date || '');
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [selectedFilterDisplayStr, setSelectedFilterDisplayStr] = useState('');

  // When new items are fetched, update the selected string dispaly.
  useEffect(() => {
    setSelectedFilterDisplayStr(parsedFilterSelections());
  }, [numOfFilteredItems, parsedFilterSelections]);

  /**
   * When new filters are selected or unselected, fetch new items.
   */
  const getNewBib = (clear = false, clearYear = false) => {
    const baseUrl = appConfig.baseUrl;
    let queryParams = [];
    if (!clear) {
      // If we are making a request, get all the selected filters and map
      // the labels to their ids. That will be sent over to the API.
      Object.keys(selectedFilters).forEach(filter => {
        const selectedFilterArray = selectedFilters[filter];
        const mappedFilter = mappedItemsLabelToIds[filter];
        if (selectedFilterArray.length > 0) {
          if (Array.isArray(selectedFilterArray)) {
            queryParams.push(
              ...selectedFilterArray.map(selectedFilter => {
                const mappedFilterId = mappedFilter[selectedFilter];
                return `${filter}=${mappedFilterId}`;
              })
            );
          } else {
            const mappedFilterId = mappedFilter[selectedFilterArray];
            queryParams.push(`${filter}=${mappedFilterId}`);
          }
        }
      });
      // The "year" filter is stored separately from the other filters.
      if (selectedYear && !clearYear) {
        queryParams.push(`date=${selectedYear}`);
      }
    }

    const bibApi = `${window.location.pathname.replace(
      baseUrl,
      `${baseUrl}/api`,
    )}${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
    // Make the API call and let redux know.
    ajaxCall(
      bibApi,
      (resp) => {
        const { bib } = resp.data;
        dispatch(
          updateBibPage({
            bib: Object.assign({}, bib, {
              itemFrom: parseInt(itemBatchSize, 10),
            }),
          }),
        );
        // Once the new items are fetched, focus on the
        // filter UI and the results.
        if (resultsRef.current) {
          resultsRef.current.focus();
        }
      },
      (error) => {
        console.error(error);
      },
    );
  }

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
  const parsedFilterSelections = useCallback(() => {
    let filterSelectionString = itemsAggregations
      .map((filter) => {
        const filters = selectedFilters[filter.field];
        if (filters.length) {
          let filtersString;
          if (Array.isArray(filters)) {
            filtersString = filters.join("', '");
          } else {
            filtersString = filters;
          }
          return `${filter.field}: '${filtersString}'`;
        }
        return null;
      })
      .filter((selected) => selected);

    if (selectedYear) {
      filterSelectionString.push(`year: '${selectedYear}'`);
    }

    return filterSelectionString.join(', ');
  }, [itemsAggregations, selectedFilters, selectedYear]);

  const resetFilters = () => {
    const clear = true;
    getNewBib(clear);
    setSelectedFilters(initialFilters);
    const href = createHref({
      pathname: location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  const submitFilterSelections = (clear = false, clearYear = false) => {
    getNewBib(clear, clearYear);
    const updatedSelectedFilters = { ...selectedFilters };
    if (selectedYear) {
      updatedSelectedFilters.date = selectedYear;
    }
    if (clearYear) {
      delete updatedSelectedFilters.date;
      setSelectedYear('');
    }

    const href = createHref({
      ...location,
      ...{
        query: updatedSelectedFilters,
        hash: '#item-filters',
        search: '',
      },
    });
    trackDiscovery(
      'Search Filters',
      `Apply Filter - ${JSON.stringify(selectedFilters)}`,
    );
    router.push(href);
  };

  const itemFilterComponentProps = {
    initialFilters,
    selectedFilters,
    setSelectedFilters,
    manageFilterDisplay,
    submitFilterSelections,
  };
  // If there are filters, display the number of items that match the filters.
  // Otherwise, display the total number of items.
  const resultsItemsNumber = selectedFilterDisplayStr ? numItemsCurrent : numItemsTotal;

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
          ref={resultsRef}
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
      <div className="item-filter-info">
        <Heading level="three" size="callout">
          <>
            {resultsItemsNumber > 0 ? resultsItemsNumber : 'No'} Result
            {resultsItemsNumber !== 1 ? 's' : null} Found
          </>
        </Heading>
        {selectedFilterDisplayStr ? (
          <>
            <span>Filtered by {selectedFilterDisplayStr}</span>
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
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
