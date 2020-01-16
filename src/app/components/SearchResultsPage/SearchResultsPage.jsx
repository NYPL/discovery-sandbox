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
import subjectFilterUtil from '../../utils/subjectFilterUtils';
import Actions from '../../actions/Actions';
import appConfig from '../../data/appConfig';

const SearchResultsContainer = (props) => {
  const {
    searchResults,
    searchKeywords,
    selectedFilters,
    page,
    sortBy,
    field,
  } = props;

  const totalResults = searchResults ? searchResults.totalResults : undefined;
  const results = searchResults ? searchResults.itemListElement : [];
  const createAPIQuery = basicQuery(props);
  const updatePage = (nextPage, pageType) => {
    Actions.updateLoadingStatus(true);
    const apiQuery = createAPIQuery({ page: nextPage });

    trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(nextPage.toString());
      setTimeout(() => {
        Actions.updateIsLoadingState(false);
        this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      }, 500);
    });
  };

  return (
    <React.Fragment>
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
              <ResultList
                results={results}
                searchKeywords={searchKeywords}
              />
            }
            {
              !!(totalResults && totalResults !== 0) &&
              <Pagination
                ariaControls="nypl-results-list"
                total={totalResults}
                perPage={50}
                page={parseInt(page, 10)}
                createAPIQuery={createAPIQuery}
                updatePage={updatePage}
              />
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

SearchResultsContainer.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  selectedFilters: PropTypes.object,
  page: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  field: PropTypes.string,
};

SearchResultsContainer.defaultProps = {
  page: '1',
};

SearchResultsContainer.contextTypes = {
  router: PropTypes.object,
};

export default SearchResultsContainer;
