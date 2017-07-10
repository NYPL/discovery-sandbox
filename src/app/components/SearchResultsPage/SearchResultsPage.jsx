import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import Hits from '../Hits/Hits.jsx';
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

const SearchResultsPage = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    selectedFacets,
    page,
    location,
    sortBy,
    field,
    spinning,
    error,
  } = props;

  const totalHits = searchResults ? searchResults.totalResults : undefined;
  const totalPages = totalHits ? Math.floor(totalHits / 50) + 1 : 0;
  const results = searchResults ? searchResults.itemListElement : [];
  const breadcrumbs = (
    <Breadcrumbs query={searchKeywords} type="search" />
  );
  const createAPIQuery = basicQuery(props);
  const h1searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
  const h1pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
  const h2Label = `Search results ${h1searchKeywordsLabel} ${h1pageLabel}`;

  const searchStr = location.search;

  const updatePage = (nextPage) => {
    Actions.updateSpinner(true);
    // Temporary. Need to check cross-browser and if it's needed at all.
    window.scrollTo(0, 0);
    const apiQuery = createAPIQuery({ page: nextPage });

    ajaxCall(`/api?${apiQuery}`, response => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(nextPage.toString());
      Actions.updateSpinner(false);
      context.router.push(`/search?${apiQuery}`);
    });
  };

  return (
    <DocumentTitle
      title={`${searchKeywords ? `${searchKeywords} | ` : ''} ` +
        'Search Results | Research Catalog | NYPL'}
    >
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            {breadcrumbs}
            <h2 aria-label={h2Label}>
              Search results
            </h2>
            <Search
              searchKeywords={searchKeywords}
              field={field}
              spinning={spinning}
              createAPIQuery={createAPIQuery}
            />
          </div>
        </div>
        <div className="nypl-full-width-wrapper">

          <div className="nypl-row">
            <div
              className="nypl-column-full"
              role="region"
              id="mainContent"
              aria-live="polite"
              aria-atomic="true"
              aria-relevant="additions removals"
              aria-describedby="results-description"
            >
              <Hits
                hits={totalHits}
                spinning={spinning}
                searchKeywords={searchKeywords}
                selectedFacets={selectedFacets}
                createAPIQuery={createAPIQuery}
                error={error}
              />

              {
                !!(totalHits && totalHits !== 0) && (
                  <Sorter
                    sortBy={sortBy}
                    page={page}
                    searchKeywords={searchKeywords}
                    createAPIQuery={createAPIQuery}
                  />
                )
              }

              {
                !!(results && results.length !== 0) &&
                (<ResultList results={results} spinning={spinning} />)
              }

              {
                !!(totalHits && totalHits !== 0) &&
                  (<Pagination
                    total={totalHits}
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
  selectedFacets: PropTypes.object,
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
