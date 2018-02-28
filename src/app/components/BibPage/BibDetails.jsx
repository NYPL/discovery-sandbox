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

import Actions from '../../actions/Actions';
import {
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import DefinitionList from './DefinitionList';
import appConfig from '../../../../appConfig';

class BibDetails extends React.Component {
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

    items.forEach((item) => {
      const ownerObj = item.owner && item.owner.length ? item.owner[0].prefLabel : undefined;

      ownerArr.push(ownerObj);
    });

    // From above, check to see if all the owners are the same, and if so, proceed if the owner
    // is either Princeton or Columbia.
    if (_every(ownerArr, o => (o === ownerArr[0]))) {
      if ((ownerArr[0] === 'Princeton University Library') ||
        (ownerArr[0] === 'Columbia University Libraries')) {
        owner = ownerArr[0];
      }
    }

    return owner;
  }

  // Parse the original and new note format.
  // Original format: ['string1', 'string2']
  // 2018 format: [ {'noteType': 'typeString', 'prefLabel': 'labelString', '@type': 'bf:Note'}, {...}]
  getNote(bib) {
    const notes = bib.note;
    if (!notes || !notes.length) {
      return null;
    }

    let noteObjects = notes && notes.length ? notes : null;

    if (!noteObjects) {
      return null;
    }

    return noteObjects;
  }

  /*
   * getDefinitionObject(bibValues, fieldValue, fieldLinkable, fieldSelfLinkable, fieldLabel)
   * Gets a list, or one value, of data to display for a field from the API, where
   * the data is an object in the array.
   * @param {array} bibValues
   * @param {string} fieldValue
   * @param {boolean} fieldLinkable
   * @param {boolean} fieldSelfLinkable
   * @param {string} fieldLabel
   */
  getDefinitionObject(bibValues, fieldValue, fieldLinkable, fieldSelfLinkable, fieldLabel) {
    // If there's only one value, we just want that value and not a list.
    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue['@id']}`;

      if (fieldLinkable) {
        return (
          <Link
            onClick={e => this.newSearch(e, url, fieldValue, bibValue['@id'], fieldLabel)}
            to={`${appConfig.baseUrl}/search?${url}`}
          >
            {bibValue.prefLabel}
          </Link>
        );
      }

      if (fieldSelfLinkable) {
        return (
          <a
            href={bibValue['@id']}
            onClick={() => trackDiscovery('Bib fields', `${fieldLabel} - ${bibValue.prefLabel}`)}
          >
            {bibValue.prefLabel}
          </a>
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
              (<Link
                onClick={e => this.newSearch(e, url, fieldValue, value['@id'], fieldLabel)}
                to={`${appConfig.baseUrl}/search?${url}`}
              >
                {value.prefLabel}
              </Link>)
              : <span>{value.prefLabel}</span>;
            if (fieldSelfLinkable) {
              itemValue =
                (<a
                  href={value['@id']}
                  onClick={() => trackDiscovery('Bib fields', `${fieldLabel} - ${value.prefLabel}`)}
                >
                  {value.prefLabel}
                </a>);
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
      bibValues.forEach((value) => {
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
   * getDefinition(bibValues, fieldValue, fieldLinkable, fieldIdentifier,
   * fieldSelfLinkable, fieldLabel)
   * Gets a list, or one value, of data to display for a field from the API.
   * @param {array} bibValues
   * @param {string} fieldValue
   * @param {boolean} fieldLinkable
   * @param {string} fieldIdentifier
   * @param {string} fieldSelfLinkable
   * @param {string} fieldLabel
   */
  getDefinition(
    bibValues, fieldValue, fieldLinkable, fieldIdentifier,
    fieldSelfLinkable, fieldLabel,
  ) {
    if (fieldValue === 'identifier') {
      return this.getIdentifiers(bibValues, fieldIdentifier);
    }

    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue}`;

      if (fieldLinkable) {
        return (
          <Link
            onClick={e => this.newSearch(e, url, fieldValue, bibValue, fieldLabel)}
            to={`${appConfig.baseUrl}/search?${url}`}
          >
            {bibValue}
          </Link>
        );
      }

      if (fieldSelfLinkable) {
        return (
          <a
            href={bibValue.url}
            onClick={() => trackDiscovery('Bib fields', `${fieldLabel} - ${bibValue.prefLabel}`)}
          >
            {bibValue.prefLabel}
          </a>
        );
      }

      return <span>{bibValue}</span>;
    }

    return (
      <ul>
        {
          bibValues.map((value, i) => {
            const url = `filters[${fieldValue}]=${value}`;
            let itemValue = fieldLinkable ? (
              <Link
                onClick={e => this.newSearch(e, url, fieldValue, value, fieldLabel)}
                to={`${appConfig.baseUrl}/search?${url}`}
              >
                {value}
              </Link>)
              : <span>{value}</span>;
            if (fieldSelfLinkable) {
              itemValue = (
                <a
                  href={value.url}
                  onClick={() => trackDiscovery('Bib fields', `${fieldLabel} - ${value.prefLabel}`)}
                >
                  {value.prefLabel}
                </a>);
            }

            return (<li key={i}>{itemValue}</li>);
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
    const fields = ['placeOfPublication', 'publisherLiteral', 'createdString'];
    let publicationInfo = '';

    fields.forEach((field) => {
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
              this.getDefinitionObject(
                bibValues, fieldValue, fieldLinkable, fieldSelfLinkable,
                fieldLabel,
              ),
          });
        } else {
          const definition = this.getDefinition(
            bibValues, fieldValue, fieldLinkable, fieldIdentifier,
            fieldSelfLinkable, fieldLabel,
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

      // Note field rendering as array of objects instead of an array of strings.
      if (fieldLabel === 'Contents') {
        const note = this.getNote(this.props.bib);
        let notes;
        if (typeof note[0] === 'object') {
          notes  = (
            note.map((n, iter) => (
              <div key={iter.toString()}>
                <h4>
                  {n.noteType}
                </h4>
                <div>
                  {n.prefLabel}
                </div>
              </div>
            ))
          );
        } else {
          notes  = (
            <ul>
              {
                note.map((noteStr, x) => (
                  <li key={x.toString()}>{noteStr}</li>
                ))
              }
            </ul>
          );
        }
        fieldsToRender.push({
          term: fieldLabel,
          definition: notes,
        });
      }

      if (fieldLabel === 'Electronic Resource' && this.props.electronicResources.length) {
        const electronicResources = this.props.electronicResources;
        let electronicElem;

        if (electronicResources.length === 1) {
          const electronicItem = electronicResources[0];
          electronicElem = (
            <a
              href={electronicItem.url}
              target="_blank"
              onClick={() =>
                trackDiscovery('Bib fields', `Electronic Resource - ${electronicItem.label} - ${electronicItem.url}`)
              }
            >
              {electronicItem.label}
            </a>);
        } else {
          electronicElem = (
            <ul>
              {
                electronicResources.map((e, i) => (
                  <li key={i}>
                    <a
                      href={e.url}
                      target="_blank"
                      onClick={
                        () => trackDiscovery('Bib fields', `Electronic Resource - ${e.label} - ${e.url}`)
                      }
                    >
                      {e.label}
                    </a>
                  </li>
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

  newSearch(e, query, field, value, label) {
    e.preventDefault();

    this.props.updateIsLoadingState(true);

    trackDiscovery('Bib fields', `${label} - ${value}`);
    ajaxCall(`${appConfig.baseUrl}/api?${query}`, (response) => {
      let index = 0;

      if (response.data.facet) {
        // Find the index where the field exists in the list of filters from the API
        index = _findIndex(response.data.filters.itemListElement, { field });
      }

      // If the index exists, try to find the filter value from the API
      if (response.data.filters && response.data.filters.itemListElement
        && response.data.filters.itemListElement[index]) {
        const filter = _findWhere(response.data.filters.itemListElement[index].values, { value });

        // The API may return a list of filters in the selected field, but the wanted
        // filter may still not appear. If that's the case, return the clicked filter value.
        Actions.updateSelectedFilters({
          [field]: [{
            value: filter ? filter.value : value,
            label: filter ? (filter.label || filter.value) : value,
          }],
        });
      } else {
        // Otherwise, the field wasn't found in the API. Returning this highlights the
        // filter in the selected filter region, but not in the filter sidebar.
        Actions.updateSelectedFilters({
          [field]: [{
            label: value,
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
        500,
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
