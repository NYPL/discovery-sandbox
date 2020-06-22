import React from 'react';
import PropTypes from 'prop-types';

import ResultsList from '../ResultsList/ResultsList';
import Pagination from '../Pagination/Pagination';
import DrbbContainer from '../Drbb/DrbbContainer';
import {
  basicQuery,
  ajaxCall,
  trackDiscovery,
  displayContext,
} from '../../utils/utils';
import Actions from '../../actions/Actions';
import appConfig from '../../data/appConfig';
import Store from '../../stores/Store';

// Renders the ResultsList containing the search results and the Pagination component
const SearchResultsContainer = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    page,
  } = props;
  const {
    media,
  } = context;
  const {
    includeDrbb,
  } = appConfig;

  const results = searchResults ? searchResults.itemListElement : [];
  const totalResults = searchResults ? searchResults.totalResults : results.length;
  const createAPIQuery = basicQuery(props);

  const updatePage = (nextPage, pageType) => {
    Actions.updateLoadingStatus(true);
    const apiQuery = createAPIQuery({ page: nextPage });

    trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(nextPage.toString());
      setTimeout(() => {
        Actions.updateLoadingStatus(false);
        context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      }, 500);
    });
  };

  const noResultElementForDrbbIntegration = includeDrbb ?
    (
      <div
        className={
          `nypl-results-summary no-scc-results drbb-integration ${Store.getState().isLoading ? ' hide-results-list' : ''
        }`}
      >
        There are no results {displayContext(props)} from Shared Collection Catalog.
      </div>) : null;

  const hasResults = results && totalResults;

  return (
    <React.Fragment>
      <div className="nypl-row">
        <div
          className="nypl-column-full"
          role="region"
          aria-describedby="results-description"
        >
          {
            hasResults !== 0 ?
              <ResultsList
                results={results}
                searchKeywords={searchKeywords}
              /> :
              noResultElementForDrbbIntegration
          }
          { includeDrbb && media === 'desktop' ? <DrbbContainer /> : null}
          {
            hasResults ?
              <Pagination
                ariaControls="nypl-results-list"
                total={totalResults}
                perPage={50}
                page={parseInt(page, 10)}
                createAPIQuery={createAPIQuery}
                updatePage={updatePage}
              /> : null
          }
          { includeDrbb && ['tablet', 'mobile'].includes(media) ? <DrbbContainer /> : null}
        </div>
      </div>
    </React.Fragment>
  );
};

SearchResultsContainer.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  page: PropTypes.string,
};

SearchResultsContainer.defaultProps = {
  page: '1',
};

SearchResultsContainer.contextTypes = {
  router: PropTypes.object,
  media: PropTypes.string,
};

export default SearchResultsContainer;
