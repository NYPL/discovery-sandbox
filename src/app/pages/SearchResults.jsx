import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import SccContainer from '../components/SccContainer/SccContainer';
import Search from '../components/Search/Search';
import SearchResultsContainer from '../components/SearchResultsPage/SearchResultsPage'; // will change this file name after first merge for PR comparison purposes
import FilterPopup from '../components/FilterPopup/FilterPopup';
import SelectedFilters from '../components/Filters/SelectedFilters';
import ResultsCount from '../components/ResultsCount/ResultsCount';
import Sorter from '../components/Sorter/Sorter';

import {
  basicQuery,
} from '../utils/utils';

const SearchResults = (props) => {
  const {
    searchResults,
    searchKeywords,
    selectedFilters,
    filters,
    page,
    field,
    location,
    sortBy,
  } = props;

  const [dropdownOpen, toggleDropdown] = useState(false);

  const totalResults = searchResults ? searchResults.totalResults : undefined;
  const totalPages = totalResults ? Math.floor(totalResults / 50) + 1 : 0;
  const searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
  const pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
  const headerLabel = `Search results ${searchKeywordsLabel} ${pageLabel}`;

  const apiFilters = filters && filters.itemListElement && filters.itemListElement.length ?
    filters.itemListElement : [];
  const createAPIQuery = basicQuery(props);
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

  const selectedFiltersAvailable = checkForSelectedFilters();

  return (
    <DocumentTitle title="Search Results | Shared Collection Catalog | NYPL">
      <SccContainer
        mainContent={<SearchResultsContainer {...props} />}
        bannerOptions={
          {
            text: "Search Results",
            ariaLabel: headerLabel,
          }
        }
        extraBannerElement={
          <Search
            searchKeywords={searchKeywords}
            field={field}
            createAPIQuery={createAPIQuery}
            selectedFilters={selectedFilters}
          />
        }
        secondaryExtraBannerElement={
          <React.Fragment>
            <FilterPopup
              filters={apiFilters}
              createAPIQuery={createAPIQuery}
              selectedFilters={selectedFilters}
              searchKeywords={searchKeywords}
              raisedErrors={dateFilterErrors}
              updateDropdownState={toggleDropdown}
              totalResults={totalResults}
            />
            {
              selectedFiltersAvailable &&
              <div className="nypl-full-width-wrapper selected-filters">
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
            <div className="nypl-full-width-wrapper">
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <ResultsCount
                    count={totalResults}
                    selectedFilters={selectedFilters}
                    searchKeywords={searchKeywords}
                    field={field}
                    page={parseInt(page, 10)}
                  />
                  {
                    !!(totalResults && totalResults !== 0) &&
                    <Sorter
                      sortBy={sortBy}
                      page={page}
                      searchKeywords={searchKeywords}
                      createAPIQuery={createAPIQuery}
                    />
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

SearchResults.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  selectedFilters: PropTypes.object,
  page: PropTypes.string,
  location: PropTypes.object,
  filters: PropTypes.object,
  field: PropTypes.string,
  sortBy: PropTypes.string,
};

SearchResults.defaultProps = {
  page: '1',
};

export default SearchResults;
