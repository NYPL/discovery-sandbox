import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import ResultsList from '../ResultsList/ResultsList';
import Pagination from '../Pagination/Pagination';
import DrbbContainer from '../Drbb/DrbbContainer';
import {
  basicQuery,
  trackDiscovery,
  displayContext,
} from '../../utils/utils';
import appConfig from '../../data/appConfig';

// Renders the ResultsList containing the search results and the Pagination component
const SearchResultsContainer = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    page,
    features,
  } = props;
  const {
    media,
  } = context;
  const includeDrbb = features.includes('drb-integration');

  const results = searchResults ? searchResults.itemListElement : [];
  const totalResults = searchResults ? searchResults.totalResults : results.length;
  const createAPIQuery = basicQuery(props);

  const updatePage = (nextPage, pageType) => {
    const apiQuery = createAPIQuery({ page: nextPage });

    trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
    props.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  };

  const noResultElementForDrbbIntegration = includeDrbb ?
    (
      <div
        className={
          `nypl-results-summary no-scc-results drbb-integration`}
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
            hasResults ?
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
  features: PropTypes.array,
};

SearchResultsContainer.defaultProps = {
  page: '1',
};

SearchResultsContainer.contextTypes = {
  router: PropTypes.object,
  media: PropTypes.string,
};

const mapStateToProps = state => ({
  searchResults: state.searchResults,
  features: state.appConfig.features,
  searchKeywords: state.searchKeywords,
  page: state.page,
});

export default withRouter(connect(mapStateToProps)(SearchResultsContainer));
