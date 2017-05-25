import React from 'react';

import DocumentTitle from 'react-document-title';

import Hits from '../Hits/Hits.jsx';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import FacetSidebar from '../FacetSidebar/FacetSidebar.jsx';
import ResultList from '../Results/ResultsList';
import Search from '../Search/Search.jsx';
import Sorter from '../Sorter/Sorter';
import Pagination from '../Pagination/Pagination';

import { basicQuery } from '../../utils/utils.js';

const SearchResultsPage = (props) => {
  const {
    searchResults,
    searchKeywords,
    facets,
    selectedFacets,
    page,
    location,
    sortBy,
    field,
    spinning,
  } = props;

  const facetList = facets && facets.itemListElement ? facets.itemListElement : [];
  const totalHits = searchResults ? searchResults.totalResults : 0;
  const totalPages = Math.floor(totalHits / 50) + 1;
  const results = searchResults ? searchResults.itemListElement : [];
  const breadcrumbs = (
    <Breadcrumbs query={searchKeywords} type="search" />
  );

  const createAPIQuery = basicQuery(props);

  return (
    <DocumentTitle title={`${searchKeywords ? searchKeywords + ' | ' : ''} Search Results | Research Catalog | NYPL`}>
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            {breadcrumbs}
            <h1 aria-label={`Search results for ${searchKeywords} page ${page} of ${totalPages}`}>
              Search results
            </h1>
          </div>
        </div>
        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters nypl-column-offset-one">
              <Search
                searchKeywords={searchKeywords}
                field={field}
                spinning={spinning}
                createAPIQuery={createAPIQuery}
              />
            </div>
          </div>

          <div className="nypl-row">

            <FacetSidebar
              facets={facetList}
              selectedFacets={selectedFacets}
              keywords={searchKeywords}
              className="nypl-column-one-quarter"
              totalHits={totalHits}
            />

            <div
              className="nypl-column-three-quarters"
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
              />

              {
                totalHits !== 0 && (
                  <Sorter
                    sortBy={sortBy}
                    page={page}
                    createAPIQuery={createAPIQuery}
                  />
                )
              }

              <ResultList results={results} query={searchKeywords} />

              {
                totalHits !== 0 &&
                  (<Pagination
                    hits={totalHits}
                    page={page}
                    urlSearchString={location.search}
                    createAPIQuery={createAPIQuery}
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
  searchResults: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  facets: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
  page: React.PropTypes.string,
  location: React.PropTypes.object,
  sortBy: React.PropTypes.string,
  field: React.PropTypes.string,
  spinning: React.PropTypes.bool,
};

export default SearchResultsPage;
