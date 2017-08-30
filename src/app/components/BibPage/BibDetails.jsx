import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Actions from '../../actions/Actions.js';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  findIndex as _findIndex,
  every as _every,
} from 'underscore';

import { ajaxCall } from '../../utils/utils';
import DefinitionList from './DefinitionList';
import appConfig from '../../../../appConfig.js';

class BibDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
   * getOwner(bib)
   * This is currently only for non-NYPL partner items. If it's NYPL, it should return undefined.
   * Requirement: Look at all the owners of all the items and if they were all the same and
   * not NYPL, show that as the owning institution and otherwise show nothing.
   * @param {object} bibId
   * @return {string}
   */
  getOwner(bib) {
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
  }

  /*
   * getDefinitionObject(bibValues, fieldValue, fieldLinkable)
   * Gets a list, or one value, of data to display for a field from the API, where
   * the data is an object in the array.
   * @param {array} bibValues
   * @param {string} fieldValue
   * @param {boolean} fieldLinkable
   * @param {boolean} fieldSelfLinkable
   */
  getDefinitionObject(bibValues, fieldValue, fieldLinkable, fieldSelfLinkable) {
    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue['@id']}`;

      if (fieldLinkable) {
        return (
          <Link
            onClick={e => this.newSearch(e, url, fieldValue, bibValue['@id'])}
            to={`${appConfig.baseUrl}/search?${url}`}
          >
            {bibValue.prefLabel}
          </Link>
        );
      }

      if (fieldSelfLinkable) {
        return (
          <a href={bibValue['@id']}>{bibValue.prefLabel}</a>
        );
      }

      return <span>{bibValue.prefLabel}</span>;
    }

    return (
      <ul>
        {
          bibValues.map((value, i) => {
            const url = `filters[${fieldValue}]=${value['@id']}`;
            let itemValue = fieldLinkable ?
              <Link
                onClick={e => this.newSearch(e, url, fieldValue, value['@id'])}
                to={`${appConfig.baseUrl}/search?${url}`}
              >
                {value.prefLabel}
              </Link>
              : <span>{value.prefLabel}</span>;
            if (fieldSelfLinkable) {
              itemValue = <a href={value['@id']}>{value.prefLabel}</a>;
            }

            return (<li key={i}>{itemValue}</li>);
          })
        }
      </ul>
    );
  }

  /*
   * getIdentifiers(bibValues, fieldIdentifier)
   * Gets specific values from the API for special identifiers.
   * @param {array} bibValues
   * @param {string} fieldIdentifier
   */
  getIdentifiers(bibValues, fieldIdentifier) {
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
  }

  /*
   * getDefinition(bibValues, fieldValue, fieldLinkable, fieldIdentifier)
   * Gets a list, or one value, of data to display for a field from the API.
   * @param {array} bibValues
   * @param {string} fieldValue
   * @param {boolean} fieldLinkable
   * @param {string} fieldIdentifier
   * @param {string} fieldSelfLinkable
   */
  getDefinition(bibValues, fieldValue, fieldLinkable, fieldIdentifier, fieldSelfLinkable) {
    if (fieldValue === 'identifier') {
      return this.getIdentifiers(bibValues, fieldIdentifier);
    }

    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue}`;

      if (fieldLinkable) {
        return (
          <Link
            onClick={e => this.newSearch(e, url, fieldValue, bibValue)}
            to={`${appConfig.baseUrl}/search?${url}`}
          >
            {bibValue}
          </Link>
        );
      }

      if (fieldSelfLinkable) {
        return (
          <a href={bibValue}>{fieldValue}</a>
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
                      onClick={e => this.newSearch(e, url, fieldValue, value)}
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
  }

  /**
   * getPublication(bib)
   * Get an object with publisher detail information.
   * @param {object} bib
   * @return {object}
   */
  getPublication(bib) {
    const fields = ['placeOfPublication', 'publisher', 'createdString'];
    let publicationInfo = '';

    fields.forEach(field => {
      const fieldValue = bib[field];
      if (fieldValue) {
        publicationInfo += `${fieldValue} `;
      }
    });

    if (!publicationInfo) {
      return null;
    }

    return {
      term: 'Publication',
      definition: <span>{publicationInfo}</span>,
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
    const fields = this.props.fields;
    const fieldsToRender = [];
    const publicationInfo = this.getPublication(bib);

    fields.forEach((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldLinkable = field.linkable;
      const fieldSelfLinkable = field.selfLinkable;
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
            definition:
              this.getDefinitionObject(bibValues, fieldValue, fieldLinkable, fieldSelfLinkable),
          });
        } else {
          const definition = this.getDefinition(
            bibValues, fieldValue, fieldLinkable, fieldIdentifier, fieldSelfLinkable
          );
          if (definition) {
            fieldsToRender.push({
              term: fieldLabel,
              definition,
            });
          }
        }
      }

      // This is made up of three different bib property values so it's special.
      if (fieldLabel === 'Publication' && publicationInfo) {
        fieldsToRender.push(publicationInfo);
      }

      // The Owner is complicated too.
      if (fieldLabel === 'Owning Institutions') {
        const owner = this.getOwner(this.props.bib);
        if (owner) {
          fieldsToRender.push({
            term: fieldLabel,
            definition: owner,
          });
        }
      }

      if (fieldLabel === 'Electronic Resource' && this.props.electronicResources.length) {
        const electronicResources = this.props.electronicResources;
        let electronicElem;

        if (electronicResources.length === 1) {
          const electronicItem = electronicResources[0];
          electronicElem =
            <a href={electronicItem.url} target="_blank">{electronicItem.prefLabel}</a>;
        } else {
          electronicElem = (
            <ul>
              {
                electronicResources.map((e, i) => (
                  <li key={i}><a href={e.url} target="_blank">{e.prefLabel}</a></li>
                ))
              }
            </ul>
          );
        }

        fieldsToRender.push({
          term: fieldLabel,
          definition: electronicElem,
        });
      }
    }); // End of the forEach loop

    return fieldsToRender;
  }

  newSearch(e, query, field, value) {
    e.preventDefault();

    this.props.updateIsLoadingState(true);
    ajaxCall(`${appConfig.baseUrl}/api?${query}`, (response) => {
      let index = 0;

      if (response.data.facet) {
        // Find the index where the field exists in the list of facets from the API
        index = _findIndex(response.data.facets.itemListElement, { field });
      }

      // If the index exists, try to find the facet value from the API
      if (response.data.facets && response.data.facets.itemListElement
        && response.data.facets.itemListElement[index]) {
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

      if (response.data.searchResults) {
        Actions.updateSearchResults(response.data.searchResults);
      }
      Actions.updateSearchKeywords('');
      Actions.updatePage('1');
      setTimeout(
        () => { this.props.updateIsLoadingState(false); },
        500
      );
      this.context.router.push(`${appConfig.baseUrl}/search?${query}`);
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
  fields: PropTypes.array,
  updateIsLoadingState: PropTypes.func,
  electronicResources: PropTypes.array,
};

BibDetails.defaultProps = {
  electronicResources: [],
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;
