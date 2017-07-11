import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
} from 'underscore';
import DefinitionList from './DefinitionList';
import { ajaxCall } from '../../utils/utils';
import Actions from '../../actions/Actions';

class BibMainInfo extends React.Component {

  getMainInfo(bib) {

    const fields = [
      { label: 'Author', value: 'creatorLiteral' },
      { label: 'Additional Authors', value: 'contributorLiteral' },
    ];

    return fields.map((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const bibValues = bib[fieldValue];

      if (!bibValues || !bibValues.length || !_isArray(bibValues)) {
        return false;
      }

      return {
        term: fieldLabel,
        definition: (
          <span>
            {
              bibValues.map((value, i) => {
                const url = `filters[${fieldValue}]=${value}`;
                return (
                    <Link
                      key={i}
                      onClick={e => this.newSearch(e, url)}
                      title={`Make a new search for ${fieldLabel}: "${value}"`}
                      to={`/search?${url}`}
                    >
                      {value}
                    </Link>
                );
              })
            }
          </span>
        ),
      };
    });
  }

  newSearch(e, query) {
    e.preventDefault();

    Actions.updateSpinner(true);
    ajaxCall(`/api?${query}`, (response) => {
      const closingBracketIndex = query.indexOf(']');
      const equalIndex = query.indexOf('=') + 1;

      const field = query.substring(8, closingBracketIndex);
      const value = query.substring(equalIndex);

      // Find the index where the field exists in the list of facets from the API
      const index = _findIndex(response.data.facets.itemListElement, { field });

      // If the index exists, try to find the facet value from the API
      if (response.data.facets.itemListElement[index]) {
        const facet = _findWhere(response.data.facets.itemListElement[index].values, { value });

        // The API may return a list of facets in the selected field, but the wanted
        // facet may still not appear. If that's the case, return the clicked facet value.
        Actions.updateSelectedFacets({
          [field]: [{
            id: facet ? facet.value : value,
            value: facet ? (facet.label || facet.value) : value,
          }],
        });
      } else {
        // Otherwise, the field wasn't found in the API. Returning this highlights the
        // facet in the selected facet region, but not in the facet sidebar.
        Actions.updateSelectedFacets({
          [field]: [{
            id: value,
            value,
          }],
        });
      }
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSearchKeywords('');
      Actions.updatePage('1');
      this.context.router.push(`/search?${query}`);
      Actions.updateSpinner(false);
    });
  }

  render() {
    if (_isEmpty(this.props.bib)) {
      return null;
    }

    const bibMainInfo = this.getMainInfo(this.props.bib);

    return (
      <DefinitionList
        data={bibMainInfo}
      />
    );
  }
}

BibMainInfo.propTypes = {
  bib: PropTypes.object,
};

export default BibMainInfo;
