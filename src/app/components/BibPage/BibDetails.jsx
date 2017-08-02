import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  findIndex as _findIndex,
  every as _every,
} from 'underscore';

import { ajaxCall } from '../../utils/utils';
import Actions from '../../actions/Actions';
import DefinitionList from './DefinitionList';
import appConfig from '../../../../appConfig.js';

const getIdentifiers = (bibValues, fieldIdentifier) => {
  let val = '';

  if (bibValues.length) {
    bibValues.forEach(value => {
      if (value.indexOf(`${fieldIdentifier}:`) !== -1) {
        val = value.substring(fieldIdentifier.length + 1);
      }
    });

    if (val) {
      return <span>{val}</span>;
    }
  }

  return null;
};

const getDefinitionObject = (bibValues, fieldValue, fieldLinkable) => {
  if (bibValues.length === 1) {
    const bibValue = bibValues[0];
    const url = `filters[${fieldValue}]=${bibValue['@id']}`;

    if (fieldLinkable) {
      return (
        <Link onClick={e => this.newSearch(e, url)} to={`${appConfig.baseUrl}/search?${url}`}>
          {bibValue.prefLabel}
        </Link>
      );
    }

    return <span>{bibValue.prefLabel}</span>;
  }

  return (
    <ul>
      {
        bibValues.map((value, i) => {
          const url = `filters[${fieldValue}]=${value['@id']}`;
          return (
            <li key={i}>
              {
                fieldLinkable ?
                  <Link
                    onClick={e => this.newSearch(e, url)}
                    to={`${appConfig.baseUrl}/search?${url}`}
                  >
                    {value.prefLabel}
                  </Link>
                  : <span>{value.prefLabel}</span>
              }
            </li>
          );
        })
      }
    </ul>
  );
};

/*
 * getOwner(bib)
 * This is currently only for non-NYPL partner items. If it's NYPL, it should return undefined.
 * Requirement: Look at all the owners of all the items and if they were all the same and
 * not NYPL, show that as the owning institution and otherwise show nothing.
 * @param {object} bibId
 * @return {string}
 */
const getOwner = (bib) => {
  const items = bib.items;
  const ownerArr = [];
  let owner;

  if (!items || !items.length) {
    return null;
  }

  items.forEach(item => {
    const ownerObj = item.owner && item.owner.length ? item.owner[0].prefLabel : undefined;

    ownerArr.push(ownerObj);
  });

  if (_every(ownerArr, (o) => (o === ownerArr[0]))) {
    if ((ownerArr[0] === 'Princeton University Library') ||
      (ownerArr[0] === 'Columbia University Libraries')) {
      owner = ownerArr[0];
    }
  }

  return owner;
};

const getDefinition = (bibValues, fieldValue, fieldLinkable, fieldIdentifier) => {
  if (fieldValue === 'identifier') {
    return getIdentifiers(bibValues, fieldIdentifier);
  }

  if (bibValues.length === 1) {
    const bibValue = bibValues[0];
    const url = `filters[${fieldValue}]=${bibValue}`;

    if (fieldLinkable) {
      return (
        <Link onClick={e => this.newSearch(e, url)} to={`${appConfig.baseUrl}/search?${url}`}>
          {bibValue}
        </Link>
      );
    }

    return <span>{bibValue}</span>;
  }

  return (
    <ul>
      {
        bibValues.map((value, i) => {
          const url = `filters[${fieldValue}]=${value}`;
          return (
            <li key={i}>
              {
                fieldLinkable ?
                  <Link
                    onClick={e => this.newSearch(e, url)}
                    to={`${appConfig.baseUrl}/search?${url}`}
                  >
                    {value}
                  </Link>
                  : <span>{value}</span>
              }
            </li>
          );
        })
      }
    </ul>
  );
};

class BibDetails extends React.Component {
  /**
   * getPublisher(bib)
   * Get an object with publisher detail information.
   * @param {object} bib
   * @return {object}
   */
  getPublisher(bib) {
    const fields = ['placeOfPublication', 'publisher', 'createdString'];
    let publisherInfo = '';

    fields.forEach(field => {
      const fieldValue = bib[field];
      if (fieldValue) {
        publisherInfo += `${fieldValue} `;
      }
    });

    if (!publisherInfo) {
      return null;
    }

    return {
      term: 'Publisher',
      definition: <span>{publisherInfo}</span>,
    };
  }

  /**
   * getDisplayFields(bib)
   * Get an array of definition term/values.
   * @param {object} bib
   * @return {array}
   */
  getDisplayFields(bib) {
    // A value of 'React Component' just means that we are getting it from a
    // component rather than from the bib field properties.
    const fields = [
      { label: 'Title', value: 'titleDisplay', linkable: true },
      { label: 'Author', value: 'creatorLiteral', linkable: true },
      { label: 'Additional Authors', value: 'contributorLiteral', linkable: true },
      { label: 'Availability', value: 'React Component' },
      { label: 'Publisher', value: 'React Component' },
      { label: 'Electronic Resource', value: '' },
      { label: 'Description', value: 'extent' },
      { label: 'Subject', value: 'subjectLiteral', linkable: true },
      { label: 'Genre/Form', value: 'materialType' },
      { label: 'Notes', value: '' },
      { label: 'Contents', value: 'note' },
      { label: 'Bibliography', value: '' },
      { label: 'ISBN', value: 'identifier', identifier: 'urn:isbn' },
      { label: 'ISSN', value: 'identifier', identifier: 'urn:issn' },
      { label: 'LCC', value: 'identifier', identifier: 'urn:lcc' },
      { label: 'GPO', value: '' },
      { label: 'Other Titles', value: '' },
      { label: 'Owning Institutions', value: '' },
      { label: 'MARC Record', value: 'React Component' },
    ];
    const fieldsToRender = [];
    const publisherInfo = this.getPublisher(bib);

    fields.forEach((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldLinkable = field.linkable;
      const fieldIdentifier = field.identifier;
      const bibValues = bib[fieldValue];

      // skip absent fields
      if (bibValues && bibValues.length && _isArray(bibValues)) {
        // Taking just the first value for each field to check the type.
        const firstFieldValue = bibValues[0];

        // Each value is an object with @id and prefLabel properties.
        if (firstFieldValue['@id']) {
          fieldsToRender.push({
            term: fieldLabel,
            definition: getDefinitionObject(bibValues, fieldValue, fieldLinkable),
          });
        } else {
          const definition = getDefinition(bibValues, fieldValue, fieldLinkable, fieldIdentifier);
          if (definition) {
            fieldsToRender.push({
              term: fieldLabel,
              definition,
            });
          }
        }
      }

      // If it's not a field from the bib, then it's probably a React Component or a more
      // complicated field. There are unique classes needed for the dt/dd elements.
      if (fieldLabel === 'Availability') {
        if (this.props.itemHoldings) {
          fieldsToRender.push({
            term: <h3>Availability</h3>,
            definition: this.props.itemHoldings,
            termClass: 'list-multi-control',
            definitionClass: 'multi-item-list',
          });
        }
      }

      // This is made up of three different bib property values so it's special.
      if (fieldLabel === 'Publisher') {
        fieldsToRender.push(publisherInfo);
      }

      // The Owner is complicated too.
      if (fieldLabel === 'Owning Institutions') {
        const owner = getOwner(this.props.bib);
        if (owner) {
          fieldsToRender.push({
            term: fieldLabel,
            definition: owner,
          });
        }
      }

      // The MARC Record only shows up for NYPL items so it's special.
      if (fieldLabel === 'MARC Record') {
        if (this.props.marcRecord) {
          fieldsToRender.push({
            term: fieldLabel,
            definition: this.props.marcRecord,
          });
        }
      }
    }); // End of the forEach loop

    return fieldsToRender;
  }

  newSearch(e, query) {
    e.preventDefault();

    Actions.updateSpinner(true);
    ajaxCall(`${appConfig.baseUrl}/api?${query}`, (response) => {
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
      this.context.router.push(`${appConfig.baseUrl}/search?${query}`);
      Actions.updateSpinner(false);
    });
  }

  render() {
    if (_isEmpty(this.props.bib)) {
      return null;
    }

    const bibDetails = this.getDisplayFields(this.props.bib);

    return (<DefinitionList data={bibDetails} />);
  }
}

BibDetails.propTypes = {
  bib: PropTypes.object,
  itemHoldings: PropTypes.object,
  marcRecord: PropTypes.object,
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;
