/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import ResultsCount from '../ResultsCount/ResultsCount';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import ResultList from '../Results/ResultsList';
import Search from '../Search/Search';
import Sorter from '../Sorter/Sorter';
import Pagination from '../Pagination/Pagination';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import FilterPopup from '../FilterPopup/FilterPopup';
import SelectedFilters from '../Filters/SelectedFilters';

import {
  basicQuery,
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import Actions from '../../actions/Actions';
import appConfig from '../../../../appConfig';

class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      dropdownOpen: false,
      document: undefined,
    };

    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
    this.updateDropdownState = this.updateDropdownState.bind(this);
    this.checkForSelectedFilters = this.checkForSelectedFilters.bind(this);
    this.focus = this.focus.bind(this);
  }

  componentDidMount() {
    document.getElementById('search-query').focus();
    this.setState({ document: window.document });
  }

  shouldComponentUpdate() {
    if (!this.state.isLoading) {
      return true;
    }
    return false;
  }

  focus() {
    if (this.state.document) {
      document.getElementById('filter-title').focus();
    }
  }

  updateIsLoadingState(status) {
    this.setState({ isLoading: status });
  }

  updateDropdownState(status) {
    this.setState({ dropdownOpen: status });
  }

  checkForSelectedFilters() {
    const { selectedFilters } = this.props;

    if (selectedFilters &&
      (selectedFilters.dateBefore !== '' ||
        selectedFilters.dateAfter !== '' ||
        (selectedFilters.language && selectedFilters.language.length) ||
        (selectedFilters.materialType && selectedFilters.materialType.length)
      )
    ) {
      if (!this.state.dropdownOpen) {
        return true;
      }
    }

    return false;
  }

  render() {
    const {
      searchResults,
      searchKeywords,
      selectedFilters,
      filters,
      page,
      sortBy,
      field,
      isLoading,
      location,
    } = this.props;

    const totalResults = searchResults ? searchResults.totalResults : undefined;
    const totalPages = totalResults ? Math.floor(totalResults / 50) + 1 : 0;
    const results = searchResults ? searchResults.itemListElement : [];
    const createAPIQuery = basicQuery(this.props);
    const searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
    const pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
    const headerLabel = `Search results ${searchKeywordsLabel} ${pageLabel}`;
    const updatePage = (nextPage, pageType) => {
      this.updateIsLoadingState(true);
      const apiQuery = createAPIQuery({ page: nextPage });

      trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
      ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updatePage(nextPage.toString());
        setTimeout(() => {
          this.updateIsLoadingState(false);
          this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
        }, 500);
      });
    };
    const searchError = location.query && location.query.error ? location.query.error : '';
    const apiFilters = filters && filters.itemListElement && filters.itemListElement.length ?
      filters.itemListElement : [];
    const dateFilterErrors = [];
    const selectedFiltersAvailable = this.checkForSelectedFilters();

    if (searchError === 'dateFilterError') {
      dateFilterErrors.push({
        name: 'date',
        value: 'Date',
      });
    }

    return (
      <DocumentTitle title="Search Results | Shared Collection Catalog | NYPL">
        <main className="main-page">
          <LoadingLayer
            status={this.state.isLoading}
            title="Searching"
            focus={this.focus()}
          />
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper filter-page">
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <Breadcrumbs query={searchKeywords} type="search" />
                  <h1 aria-label={headerLabel}>
                    Search Results
                  </h1>
                  <Search
                    searchKeywords={searchKeywords}
                    field={field}
                    createAPIQuery={createAPIQuery}
                    updateIsLoadingState={this.updateIsLoadingState}
                    selectedFilters={selectedFilters}
                  />
                </div>
              </div>
            </div>
            <FilterPopup
              filters={apiFilters}
              createAPIQuery={createAPIQuery}
              updateIsLoadingState={this.updateIsLoadingState}
              selectedFilters={selectedFilters}
              searchKeywords={searchKeywords}
              raisedErrors={dateFilterErrors}
              updateDropdownState={this.updateDropdownState}
              totalResults={totalResults}
            />
            {selectedFiltersAvailable &&
              <div className="nypl-full-width-wrapper selected-filters">
                <div className="nypl-row">
                  <div className="nypl-column-full">
                    <SelectedFilters
                      selectedFilters={selectedFilters}
                      createAPIQuery={createAPIQuery}
                      updateIsLoadingState={this.updateIsLoadingState}
                    />
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="nypl-sorter-row">
            <div className="nypl-full-width-wrapper">
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <ResultsCount
                    isLoading={isLoading}
                    count={totalResults}
                    selectedFilters={selectedFilters}
                    searchKeywords={searchKeywords}
                    field={field}
                    page={parseInt(page, 10)}
                  />
                  {
                    !!(totalResults && totalResults !== 0) && (
                      <Sorter
                        sortBy={sortBy}
                        page={page}
                        searchKeywords={searchKeywords}
                        createAPIQuery={createAPIQuery}
                        updateIsLoadingState={this.updateIsLoadingState}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div
                className="nypl-column-full"
                role="region"
                id="mainContent"
                aria-describedby="results-description"
              >
                {
                  !!(results && results.length !== 0) &&
                    (<ResultList
                      results={results}
                      isLoading={isLoading}
                      searchKeywords={searchKeywords}
                      updateIsLoadingState={this.updateIsLoadingState}
                    />)
                }

                {
                  !!(totalResults && totalResults !== 0) &&
                    (<Pagination
                      ariaControls="nypl-results-list"
                      total={totalResults}
                      perPage={50}
                      page={parseInt(page, 10)}
                      createAPIQuery={createAPIQuery}
                      updatePage={updatePage}
                    />)
                }
              </div>
            </div>
          </div>
        </main>
      </DocumentTitle>
    );
  }
}

SearchResultsPage.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  selectedFilters: PropTypes.object,
  page: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  field: PropTypes.string,
  isLoading: PropTypes.bool,
  filters: PropTypes.object,
};

SearchResultsPage.defaultProps = {
  page: '1',
};

SearchResultsPage.contextTypes = {
  router: PropTypes.object,
};

export default SearchResultsPage;
