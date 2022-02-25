import PropTypes from 'prop-types';
import React from 'react';
import { useSelector } from 'react-redux';
import appConfig from '../../data/appConfig';
import { displayContext, trackDiscovery } from '../../utils/utils';
import { MediaContext } from '../Application/Application';
import DrbbContainer from '../Drbb/DrbbContainer';
import Pagination from '../Pagination/Pagination';
import ResultsList from '../ResultsList/ResultsList';

// Renders ResultsList and Pagination components
const SearchResultsContainer = (props) => {
  const searchResults = useSelector((state) => state.searchResults);
  const features = useSelector((state) => state.features);
  const searchKeywords = useSelector((state) => state.searchKeywords);
  const page = useSelector((state) => state.page);
  const { createAPIQuery } = props;
  const includeDrbb = features.includes('drb-integration');

  const results = searchResults ? searchResults.itemListElement : [];
  const totalResults = searchResults
    ? searchResults.totalResults
    : results.length;

  const updatePage = (nextPage, pageType) => {
    const apiQuery = createAPIQuery({ page: nextPage });

    trackDiscovery(
      'Pagination - Search Results',
      `${pageType} - page ${nextPage}`,
    );
    props.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  };

  const noResultElementForDrbbIntegration = includeDrbb ? (
    <div className='nypl-results-summary no-scc-results drbb-integration'>
      There are no results {displayContext(props)} from {appConfig.displayTitle}
      .
    </div>
  ) : null;

  const hasResults = results && totalResults;

  return (
    <MediaContext.Consumer>
      {(media) => (
        <React.Fragment>
          <div
            className='nypl-column-full'
            role='region'
            aria-describedby='results-description'
          >
            {hasResults ? (
              <ResultsList results={results} searchKeywords={searchKeywords} />
            ) : (
              noResultElementForDrbbIntegration
            )}
            {includeDrbb && media === 'desktop' ? <DrbbContainer /> : null}
            {hasResults ? (
              <Pagination
                ariaControls='nypl-results-list'
                total={totalResults}
                perPage={50}
                page={parseInt(page, 10)}
                createAPIQuery={createAPIQuery}
                updatePage={updatePage}
              />
            ) : null}
            {includeDrbb && media !== 'desktop' ? <DrbbContainer /> : null}
          </div>
        </React.Fragment>
      )}
    </MediaContext.Consumer>
  );
};

SearchResultsContainer.propTypes = {
  createAPIQuery: PropTypes.func,
  router: PropTypes.object,
};

export default SearchResultsContainer;
