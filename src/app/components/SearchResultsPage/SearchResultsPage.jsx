import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import ResultsCount from '../ResultsCount/ResultsCount.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ResultList from '../Results/ResultsList';
import Search from '../Search/Search.jsx';
import Sorter from '../Sorter/Sorter';
import Pagination from '../Pagination/Pagination';

import {
  basicQuery,
  ajaxCall,
} from '../../utils/utils.js';
import Actions from '../../actions/Actions.js';
import appConfig from '../../../../appConfig.js';

const SearchResultsPage = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    page,
    sortBy,
    field,
    spinning,
  } = props;

  const totalResults = searchResults ? searchResults.totalResults : undefined;
  const totalPages = totalResults ? Math.floor(totalResults / 50) + 1 : 0;
  const results = searchResults ? searchResults.itemListElement : [];
  const createAPIQuery = basicQuery(props);
  const searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
  const pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
  const headerLabel = `Search results ${searchKeywordsLabel} ${pageLabel}`;
  const updatePage = (nextPage) => {
    Actions.updateSpinner(true);
    // Temporary. Need to check cross-browser and if it's needed at all.
    window.scrollTo(0, 0);
    const apiQuery = createAPIQuery({ page: nextPage });

    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, response => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(nextPage.toString());
      Actions.updateSpinner(false);
      context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
    });
  };

  return (
    <DocumentTitle
      title="Search Results | Shared Collection Catalog | NYPL"
    >
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <Breadcrumbs query={searchKeywords} type="search" />
                <h2 aria-label={headerLabel}>{appConfig.displayTitle}</h2>
                <Search
                  searchKeywords={searchKeywords}
                  field={field}
                  spinning={spinning}
                  createAPIQuery={createAPIQuery}
                />

                {
                  !!(totalResults && totalResults !== 0) && (
                    <Sorter
                      sortBy={sortBy}
                      page={page}
                      searchKeywords={searchKeywords}
                      createAPIQuery={createAPIQuery}
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
              className="nypl-column-three-quarters"
              role="region"
              id="mainContent"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="additions removals"
              aria-describedby="results-description"
            >
              <ResultsCount spinning={spinning} count={totalResults} />

              {
                !!(results && results.length !== 0) &&
                (
                  <ResultList
                    results={results}
                    spinning={spinning}
                    searchKeywords={searchKeywords}
                  />
                )
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
};

SearchResultsPage.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  page: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  field: PropTypes.string,
  spinning: PropTypes.bool,
  error: PropTypes.object,
};

SearchResultsPage.contextTypes = {
  router: PropTypes.object,
};

export default SearchResultsPage;
