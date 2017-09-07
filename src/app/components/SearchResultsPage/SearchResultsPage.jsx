import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import ResultsCount from '../ResultsCount/ResultsCount.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ResultList from '../Results/ResultsList';
import Search from '../Search/Search.jsx';
import Sorter from '../Sorter/Sorter';
import Pagination from '../Pagination/Pagination';
import LoadingLayer from '../LoadingLayer/LoadingLayer.jsx';

import {
  basicQuery,
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils.js';
import Actions from '../../actions/Actions.js';
import appConfig from '../../../../appConfig.js';

class SearchResultsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: this.props.isLoading,
    };

    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
  }

  componentDidUpdate() {
    if (this.loadingLayer) {
      this.loadingLayer.focus();
    }
  }

  updateIsLoadingState(status) {
    this.setState({ isLoading: status });
  }

  render() {
    const {
      searchResults,
      searchKeywords,
      selectedFacets,
      page,
      sortBy,
      field,
      isLoading,
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
      // Temporary. Need to check cross-browser and if it's needed at all.
      window.scrollTo(0, 0);
      const apiQuery = createAPIQuery({ page: nextPage });

      trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
      ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, response => {
        Actions.updateSearchResults(response.data.searchResults);
        Actions.updatePage(nextPage.toString());
        setTimeout(
          () => { this.updateIsLoadingState(false); },
          500
        );
        this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      });
    };

    return (
      <DocumentTitle title="Search Results | Shared Collection Catalog | NYPL">
        <main className="main-page">
          <LoadingLayer
            status={this.state.isLoading}
            title="Searching"
            childRef={(c) => { this.loadingLayer = c; }}
            tabIndex={0}
          />
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper">
              <div className="nypl-row">
                <div className="nypl-column-three-quarters">
                  <Breadcrumbs query={searchKeywords} type="search" />
                  <h1 aria-label={headerLabel}>Search Results</h1>
                  <Search
                    searchKeywords={searchKeywords}
                    field={field}
                    createAPIQuery={createAPIQuery}
                    updateIsLoadingState={this.updateIsLoadingState}
                  />
                  <ResultsCount
                    isLoading={isLoading}
                    count={totalResults}
                    selectedFacets={selectedFacets}
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
                className="nypl-column-three-quarters"
                role="region"
                id="mainContent"
                aria-live="polite"
                aria-atomic="true"
                aria-relevant="additions removals"
                aria-describedby="results-description"
              >
                {
                  !!(results && results.length !== 0) &&
                  (
                    <ResultList
                      results={results}
                      isLoading={isLoading}
                      searchKeywords={searchKeywords}
                      updateIsLoadingState={this.updateIsLoadingState}
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
  }
}

SearchResultsPage.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  selectedFacets: PropTypes.object,
  page: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  field: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.object,
};

SearchResultsPage.defaultProps = {
  page: '1',
};

SearchResultsPage.contextTypes = {
  router: PropTypes.object,
};

export default SearchResultsPage;
