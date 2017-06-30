import React from 'react';
import PropTypes from 'prop-types';
import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const ClearHits = (props, context) => {
  const clearResults = (e) => {
    e.preventDefault();

    Actions.updateSpinner(true);
    Actions.updateSearchKeywords('');
    Actions.updateSelectedFacets({});
    ajaxCall('/api', (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      context.router.push('/search');
      Actions.updateSpinner(false);
    });
  };

  return (
    <div className="nypl-clear-results">
      <a href="/search" className="nypl-link-button" onClick={(e) => clearResults(e)}>
        Clear current search query, filters, and sorts
      </a>
    </div>
  );
};

ClearHits.contextTypes = {
  router: PropTypes.object,
};

export default ClearHits;
