import React from 'react';
import PropTypes from 'prop-types';
import { XIcon } from '@nypl/dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const FilterSelection = ({ facetKey, facet, apiQuery }, context) => {
  const removeFacet = (facetRemove, valueId) => {
    Actions.updateSpinner(true);
    Actions.removeFacet(facetRemove, valueId);

    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updatePage('1');
      context.router.push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
  };

  const getFacetLabel = (field) => {
    if (field === 'materialType') {
      return 'Material Type';
    } else if (field === 'subjectLiteral') {
      return 'Subject';
    } else if (field === 'creatorLiteral') {
      return 'Author';
    } else if (field.indexOf('date') !== -1) {
      return 'Date';
    }
    return field.charAt(0).toUpperCase() + field.slice(1);
  };

  if (!facetKey) {
    return null;
  }

  return (
    <span className="nypl-facet">
      {getFacetLabel(facetKey)} <strong>{facet.value}</strong>
      <button
        onClick={() => removeFacet(facetKey, facet.id)}
        className="remove-facet"
        aria-controls="results-region"
      >
        <XIcon
          className="nypl-icon"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        />
        <span className="hidden">remove filter&nbsp;{facet.value}</span>
      </button>
    </span>
  );
};

FilterSelection.propTypes = {
  facetKey: PropTypes.string,
  facet: PropTypes.object,
  apiQuery: PropTypes.string,
};

FilterSelection.contextTypes = {
  router: PropTypes.object,
};

export default FilterSelection;
