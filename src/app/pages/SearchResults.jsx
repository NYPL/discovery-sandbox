import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';

/* eslint-disable import/no-unresolved, import/extensions */
import SearchResultsSorter from '@SearchResultsSorter';
import SearchResultsContainer from '@SearchResultsContainer';
/* eslint-enable */
import SccContainer from '../components/SccContainer/SccContainer';
import Search from '../components/Search/Search';
import FilterPopup from '../components/FilterPopup/FilterPopup';
import SelectedFilters from '../components/Filters/SelectedFilters';
import ResultsCount from '../components/ResultsCount/ResultsCount';

import {
  basicQuery,
  hasValidFilters,
} from '../utils/utils';

const SearchResults = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    sortBy,
    field,
    page,
    selectedFilters,
    features,
  } = useSelector(state => ({
    searchResults: state.searchResults,
    features: state.features,
    searchKeywords: state.searchKeywords,
    sortBy: state.sortBy,
    field: state.field,
    page: state.page,
    selectedFilters: state.selectedFilters,
  }));

  const {
    router,
  } = context;

  const includeDrbb = features.includes('drb-integration');

  const { location } = router;

  const [dropdownOpen, toggleDropdown] = useState(false);

  const totalResults = searchResults ? searchResults.totalResults : undefined;
  const totalPages = totalResults ? Math.floor(totalResults / 50) + 1 : 0;
  const searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
  const pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
  const headerLabel = `Search results ${searchKeywordsLabel} ${pageLabel}`;

  const createAPIQuery = basicQuery({
    searchKeywords,
    page,
    sortBy,
    selectedFilters,
    field,
  });
  const dateFilterErrors = [];
  const searchError = location.query && location.query.error ? location.query.error : '';
  if (searchError === 'dateFilterError') {
    dateFilterErrors.push({
      name: 'date',
      value: 'Date',
    });
  }
  const checkForSelectedFilters = () => {
    if (selectedFilters &&
      (selectedFilters.dateBefore !== '' ||
        selectedFilters.dateAfter !== '' ||
        (selectedFilters.language && selectedFilters.language.length) ||
        (selectedFilters.materialType && selectedFilters.materialType.length) ||
        (selectedFilters.subjectLiteral && selectedFilters.subjectLiteral.length)
      )
    ) {
      if (!dropdownOpen) {
        return true;
      }
    }
    return false;
  };

  const selectedFiltersAvailable = hasValidFilters(selectedFilters) && !dropdownOpen;
  const hasResults = searchResults && totalResults;

  return (
    <DocumentTitle title="Search Results | Shared Collection Catalog | NYPL">
      <SccContainer
        mainContent={
          <SearchResultsContainer
            router={router}
            createAPIQuery={createAPIQuery}
          />
        }
        bannerOptions={
          {
            text: 'Search Results',
            ariaLabel: headerLabel,
          }
        }
        extraBannerElement={
          <Search
            createAPIQuery={createAPIQuery}
            router={router}
          />
        }
        secondaryExtraBannerElement={
          <React.Fragment>
            <FilterPopup
              createAPIQuery={createAPIQuery}
              raisedErrors={dateFilterErrors}
              updateDropdownState={toggleDropdown}
            />
            {
              selectedFiltersAvailable &&
              <div className={`nypl-full-width-wrapper selected-filters${includeDrbb ? ' drbb-integration' : ''}`}>
                <div className="nypl-row">
                  <div className="nypl-column-full">
                    <SelectedFilters
                      selectedFilters={selectedFilters}
                      createAPIQuery={createAPIQuery}
                    />
                  </div>
                </div>
              </div>
            }
          </React.Fragment>
        }
        extraRow={
          <div className="nypl-sorter-row">
            <div className={`nypl-full-width-wrapper selected-filters${includeDrbb ? ' drbb-integration' : ''}`}>
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <ResultsCount
                    count={totalResults}
                    selectedFilters={selectedFilters}
                    field={field}
                  />
                  {
                    hasResults ?
                      <SearchResultsSorter
                        createAPIQuery={createAPIQuery}
                        key={sortBy}
                      />
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        }
        loadingLayerText="Searching"
        breadcrumbsType="search"
      />
    </DocumentTitle>
  );
};

SearchResults.contextTypes = {
  router: PropTypes.any,
};

export default SearchResults;
