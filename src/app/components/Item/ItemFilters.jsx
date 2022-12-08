import { Button, Heading, SearchBar, Text, TextInput } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';

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
  const [openFilter, setOpenFilter] = useState('none');
  const [selectedYear, setSelectedYear] = useState(query.date || '');
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  // For every item aggregation, go through every filter in its `values` array
  // and map all the labels to their ids. This is done because the API expects
  // the ids of the filters to be sent over, not the labels.
  const mappedItemsLabelToIds = itemsAggregations.reduce((accc, aggregation) => {
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

  const getNewBib = (clear = false) => {
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
      if (selectedYear) {
        queryParams.push(`date=${selectedYear}`);
      }
    }

    const bibApi = `${window.location.pathname.replace(
      baseUrl,
      `${baseUrl}/api`,
    )}${queryParams.length ? `?${queryParams.join('&')}` : ''}`;
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
  const parsedFilterSelections = () => {
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
      .filter((selected) => selected)
      .join(', ');

    if (selectedYear) {
      filterSelectionString = `${filterSelectionString}, year: '${selectedYear}'`; 
    }

    return filterSelectionString;
  }

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

  const submitFilterSelections = (clear = false) => {
    getNewBib(clear);
    const updatedSelectedFilters = { ...selectedFilters };
    if (selectedYear) {
      updatedSelectedFilters.date = selectedYear;
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
          itemsAggregations={itemsAggregations}
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
                  onChange={(event) => setSelectedYear(event.target.value)}
                  value={selectedYear}
                />
              }
            />
            <Button
              buttonType="text"
              id="clear-year-button"
              onClick={() => setSelectedYear('')}
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
        {parsedFilterSelections() ? (
          <>
            <span>Filtered by {parsedFilterSelections()}</span>
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
