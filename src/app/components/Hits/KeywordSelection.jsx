import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from 'dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const KeywordSelection = ({ keyword, apiQuery }, context) => {
  const removeKeyword = () => {
    Actions.updateSpinner(true);
    Actions.updateSearchKeywords('');

    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      context.router.push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
  };

  if (!keyword) {
    return null;
  }

  return (
    <span className="nypl-facet">&nbsp;with keywords <strong>{keyword}</strong>
      <button
        onClick={() => removeKeyword(keyword)}
        className="remove-keyword"
        aria-controls="results-region"
      >
        <XIcon
          className="nypl-icon"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        />
        <span className="hidden">remove keyword filter&nbsp;{keyword}</span>
      </button>
    </span>
  );
};

KeywordSelection.propTypes = {
  keyword: PropTypes.string,
  apiQuery: PropTypes.string,
};

KeywordSelection.contextTypes = {
  router: PropTypes.object,
};

export default KeywordSelection;
