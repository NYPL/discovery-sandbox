import { Button, Heading, SearchBar, Text, TextInput } from '@nypl/design-system-react-components';
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

const ItemFilters = (
  { numOfFilteredItems, itemsAggregations = [], dispatch },
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
  // normalize item aggregations by dropping values with no label and combining duplicate lables
  const reducedItemsAggregations = JSON.parse(JSON.stringify(itemsAggregations))
  reducedItemsAggregations.forEach((agg) => {
    const values = agg.values
    const reducedValues = {}
    values.filter(value => value.label && value.label.length)
      .forEach((value) => {
        if (!reducedValues[value.label]) {
          reducedValues[value.label] = []
        }
        reducedValues[value.label].push(value.value)
      })
    agg.values = Object.keys(reducedValues)
      .map(label => ({ value: reducedValues[label].join(","), label: label }))
  })
  // For every item aggregation, go through every filter in its `values` array
  // and map all the labels to their ids. This is done because the API expects
  // the ids of the filters to be sent over, not the labels.
  const mappedItemsLabelToIds = reducedItemsAggregations.reduce((accc, aggregation) => {
    const filter = aggregation.field;
    const mappedValues = aggregation.values.reduce((acc, value) => ({
      ...acc,
      [value.label]: value.value
    }), {})
    return {
      ...accc,
      [filter]: mappedValues,
    };
  }, {});

  // When new items are fetched, update the selected string dispaly.
  useEffect(() => {
    setSelectedFilterDisplayStr(parsedFilterSelections());
  }, [numOfFilteredItems, parsedFilterSelections])

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
        const done = !bib || !bib.items || bib.items.length < itemBatchSize;
        dispatch(
          updateBibPage({
            bib: Object.assign({}, bib, {
              done,
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
    let filterSelectionString = reducedItemsAggregations
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
  }, [reducedItemsAggregations, selectedFilters, selectedYear]);

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

  return (
    <Fragment>
      {['mobile', 'tabletPortrait'].includes(mediaType) ? (
        <ItemFiltersMobile
          itemsAggregations={reducedItemsAggregations}
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
            {reducedItemsAggregations.map((filter) => (
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
                  onChange={(event) => setSelectedYear(event.target.value)}
                  value={selectedYear}
                />
              }
            />
            <Button
              buttonType="text"
              id="clear-year-button"
              onClick={() => {
                const clearYear = true;
                setSelectedYear('');
                submitFilterSelections(false, clearYear)
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
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.number,
  dispatch: PropTypes.func,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
