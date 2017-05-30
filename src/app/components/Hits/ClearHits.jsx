import React from 'react';
import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

class ClearHits extends React.Component {
  constructor(props) {
    super(props);
    this.clearResults = this.clearResults.bind(this);
  }

  clearResults() {
    Actions.updateSpinner(true);
    Actions.updateSearchKeywords('');
    Actions.updateSelectedFacets({});
    ajaxCall(`/api`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      this.context.router.push(`/search`);
      Actions.updateSpinner(false);
    });
  }

  render() {
    return (
      <div className="nypl-clear-results">
        <button
          className="nypl-link-button"
          onClick={() => this.clearResults()}
        >Clear current search query, filters, and sorts</button>
      </div>
    )
  }
}

ClearHits.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ClearHits;
