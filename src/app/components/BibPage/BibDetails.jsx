import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  findIndex as _findIndex,
} from 'underscore';

import { ajaxCall } from '../../utils/utils';
import Actions from '../../actions/Actions';
import DefinitionList from './DefinitionList';

class BibDetails extends React.Component {
  getDisplayFields(bib) {
    const fields = [
      { label: 'Title', value: 'title' },
      { label: 'Title (alternative)', value: 'titleAlt' },
      { label: 'Title (display)', value: 'titleDisplay' },
      { label: 'Material Type', value: 'materialType' },
      { label: 'Media Type', value: 'mediaType' },
      { label: 'Language', value: 'language' },
      { label: 'Created String', value: 'createdString' },
      { label: 'Creator', value: 'creatorLiteral' },
      { label: 'Date String', value: 'dateString' },
      { label: 'Date Created', value: 'createdYear' },
      { label: 'Date Published', value: 'startYear' },
      { label: 'Contributors', value: 'contributor' },
      { label: 'Publisher', value: 'publisher' },
      { label: 'Place of publication', value: 'placeOfPublication' },
      { label: 'Subjects', value: 'subjectLiteral' },
      { label: 'Dimensions', value: 'dimensions' },
      { label: 'Extent', value: 'extent' },
      { label: 'Owner', value: 'owner' },
      { label: 'Location', value: 'location' },
      { label: 'Notes', value: 'note' },
      { label: 'LCC', value: 'idLcc' },
      { label: 'Number available', value: 'numAvailable' },
      { label: 'Number of items', value: 'numItems' },
    ];

    return fields.map((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldUrl = field.url;
      const bibValues = bib[fieldValue];

      // skip absent fields
      if (!bibValues || !bibValues.length || !_isArray(bibValues)) {
        return false;
      }
      // Taking just the first value for each field
      const firstFieldValue = bibValues[0];

      // Note: Not used at the moment since we are not longer linking to external
      // sources. The data structure on top would have a `url` property to signify that
      // it's a link.
      // TODO: If this is used later in the future, check the value of `fieldUrl` and
      // make sure that it's the correct one, and dynamic.
      // external links
      if (fieldUrl) {
        return {
          term: fieldLabel,
          definition: (
            <ul>
              {
                bibValues.map((value, i) => {
                  const linkLabel = fieldValue === 'idOclc' ? 'View in Worldcat' : value;
                  return (
                    <li key={i}>
                      <a href={fieldUrl} title={linkLabel} target="_blank">{linkLabel}</a>
                    </li>
                  );
                })
              }
            </ul>
          ),
        };

      // List of links
      // Could use a better check but okay for now. This is the second most used statement,
      // mostly to link to different values in the UI.
      } else if (firstFieldValue['@id']) {
        return {
          term: fieldLabel,
          definition: (
            <ul>
              {
                bibValues.map((valueObj, i) => {
                  const url = `filters[${fieldValue}]=${valueObj['@id']}`;
                  return (
                    <li key={i}>
                      <Link
                        onClick={e => this.newSearch(e, url)}
                        title={`Make a new search for ${fieldLabel}: ${valueObj.prefLabel}`}
                        to={`/search?${url}`}
                      >
                        {valueObj.prefLabel}
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          ),
        };
        // NOTE: Right now this is not working because we removed the `linkable` property.
        // We added this because not all fields should be linkable. For example, maybe we
        // want `materialType` to be linkable in the UI but not `issuance`.
      } else if (field.linkable) {
        // When we want all the links to be in sentence form separated by a comma:
        // e.g. Benjamin Franklin, Thomas Jefferson, George Washington
        if (fieldValue === 'contributorLiteral') {
          return {
            term: fieldLabel,
            definition: bibValues.map((value, i) => {
              const comma = bibValues.length > 1 ? ', ' : ' ';
              const url = `filters[${fieldValue}]=${value}`;
              return (
                <span key={i}>
                  <Link
                    onClick={e => this.newSearch(e, url)}
                    title={`Make a new search for ${fieldLabel}: "${value}"`}
                    to={`/search?${url}`}
                  >
                    {value}
                  </Link>{comma}
                </span>
              );
            }),
          };
        }

        // NOTE: because of the note above, this is never reached.
        return {
          term: fieldLabel,
          definition: (
            <ul>
              {
                bibValues.map((value, i) => {
                  const url = `filters[${fieldValue}]=${value}`;
                  return (
                    <li key={i}>
                      <Link
                        onClick={e => this.newSearch(e, url)}
                        title={`Make a new search for ${fieldLabel}: "${value}"`}
                        to={`/search?${url}`}
                      >
                        {value}
                      </Link>
                    </li>
                  );
                })
              }
            </ul>
          ),
        };
      }

      // Simple data display. This gets rendered the most.
      return {
        term: fieldLabel,
        definition: (
          <dt>
            {bibValues.map((value, i) => <dd key={i}>{value}</dd>)}
          </dt>
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

    const bibDetails = this.getDisplayFields(this.props.bib);

    return (
      <DefinitionList
        data={bibDetails}
        title="Bib details"
      />
    );
  }
}

BibDetails.propTypes = {
  bib: PropTypes.object,
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;
