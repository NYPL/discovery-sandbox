import React from 'react';
import PropTypes from 'prop-types';

import ResultsList from '../ResultsList/ResultsList';
import Pagination from '../Pagination/Pagination';
import DrbbContainer from '../Drbb/DrbbContainer';
import {
  basicQuery,
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import Actions from '../../actions/Actions';
import appConfig from '../../data/appConfig';

// Renders the ResultsList containing the search results and the Pagination component
class SearchResultsContainer extends React.Component {
  constructor(props) {
    super();
    this.includeDrbb = true;
    this.createAPIQuery = basicQuery(props);
  }

  updatePage(nextPage, pageType) {
    Actions.updateLoadingStatus(true);
    const apiQuery = this.createAPIQuery({ page: nextPage });

    trackDiscovery('Pagination - Search Results', `${pageType} - page ${nextPage}`);
    ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updatePage(nextPage.toString());
      setTimeout(() => {
        Actions.updateLoadingStatus(false);
        this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
      }, 500);
    });
  }

  render() {
    const {
      searchResults,
      searchKeywords,
      page,
    } = this.props;
    const { media } = this.context;

    const totalResults = searchResults ? searchResults.totalResults : undefined;
    const results = searchResults ? searchResults.itemListElement : [];

    return (
      <React.Fragment>
        <div className="nypl-row">
          <div
            className="nypl-column-full"
            role="region"
            aria-describedby="results-description"
          >
            {
              !!(results && results.length !== 0) &&
              <ResultsList
                results={results}
                searchKeywords={searchKeywords}
              />
            }
            { this.includeDrbb && media === 'desktop' ? <DrbbContainer /> : null}
            {
              !!(totalResults && totalResults !== 0) &&
              <Pagination
                ariaControls="nypl-results-list"
                total={totalResults}
                perPage={50}
                page={parseInt(page, 10)}
                createAPIQuery={this.createAPIQuery}
                updatePage={this.updatePage}
              />
            }
            { this.includeDrbb && ['tablet', 'mobile'].includes(media) ? <DrbbContainer /> : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

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
