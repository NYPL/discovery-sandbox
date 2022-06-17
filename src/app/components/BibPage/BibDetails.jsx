import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  isObject as _isObject,
} from 'underscore';

// Components
import DefinitionList from './DefinitionList';
// Utils and configs
import appConfig from '../../data/appConfig';
import { combineBibDetailsData } from '../../utils/bibDetailsUtils';
import { RouterContext } from "../../pages/BibPage";
import { trackDiscovery } from '../../utils/utils';

const BibDetails = (props) => {
  const { router } = React.useContext(RouterContext);

  /**
   * getDefinitionObject(bibValues, fieldValue, fieldLinkable, fieldSelfLinkable, fieldLabel)
   * Gets a list, or one value, of data to display for a field from the API, where
   * the data is an object in the array.
   *
   * @param {array} bibValues - the value(s) of the current field
   * @param {string} fieldValue - the name of the current field
   * @param {boolean} fieldLinkable - flags true if the field should be clickable
   * @param {boolean} fieldSelfLinkable - flags true if the Bib field already has a URL
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
   const getDefinitionObject = (
    bibValues,
    fieldValue,
    fieldLinkable,
    fieldSelfLinkable,
    fieldLabel,
  ) => {
    // If there's only one value, we just want that value and not a list.
    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue['@id']}`;

      if (fieldLinkable) {
        return searchLink({
          query: url,
          label: bibValue.prefLabel,
          analyticsLabel: fieldLabel,
          analyticsValue: bibValue['@id'],
        });
      }

      if (fieldSelfLinkable) {
        return (
          <a
            href={bibValue['@id']}
            onClick={() =>
              trackDiscovery(
                'Bib fields',
                `${fieldLabel} - ${bibValue.prefLabel}`,
              )
            }
          >
            {bibValue.prefLabel}
          </a>
        );
      }

      return <span>{bibValue.prefLabel}</span>;
    }

    return (
      <ul className="additionalDetails">
        {bibValues.map((value) => {
          const url = `filters[${fieldValue}]=${value['@id']}`;
          let itemValue = fieldLinkable ? (
            searchLink({
              query: url,
              label: value.prefLabel,
              analyticsLabel: fieldLabel,
              analyticsValue: value['@id'],
            })
          ) : (
            <span>{value.prefLabel}</span>
          );
          if (fieldSelfLinkable) {
            itemValue = (
              <a
                href={value['@id']}
                onClick={() =>
                  trackDiscovery(
                    'Bib fields',
                    `${fieldLabel} - ${value.prefLabel}`,
                  )
                }
              >
                {value.prefLabel}
              </a>
            );
          }

          return <li key={value.prefLabel}>{itemValue}</li>;
        })}
      </ul>
    );
  }

  /**
   * getDefinition(bibValues, fieldValue, fieldLinkable,
   * fieldSelfLinkable, fieldLabel)
   * Gets a list, or one value, of data to display for a field from the API.
   *
   * @param {array} bibValues - the value(s) of the current field
   * @param {string} fieldValue - the name of the current field
   * @param {boolean} fieldLinkable  - flags true if the field should be clickable
   * @param {string} fieldSelfLinkable - flags true if the Bib field already has a URL
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
  const getDefinition = (
    bibValues,
    fieldValue,
    fieldLinkable,
    fieldSelfLinkable,
    fieldLabel,
  ) => {
    if (fieldValue === 'identifier') {
      if (bibValues) {
        return bibValues.length === 1 ? (
          bibValues.pop()
        ) : (
          <ul>
            {bibValues.map((mark, index) => (
              <li key={index}>{mark}</li>
            ))}
          </ul>
        );
      }
    }

    if (bibValues.length === 1) {
      const bibValue = bibValues[0];

      const url = `filters[${fieldValue}]=${bibValue}`;
      return getDefinitionOneItem(
        bibValue,
        url,
        fieldValue,
        fieldLinkable,
        fieldSelfLinkable,
        fieldLabel,
      );
    }

    return (
      <ul>
        {bibValues.map((value) => {
          const queryString =  typeof value === 'string' ? value : value.label;
          const url = `filters[${fieldValue}]=${encodeURIComponent(queryString)}`

          return (
            <li
              key={`filter${fieldValue}${
                typeof value === 'string' ? value : value.label
              }`}
            >
              {getDefinitionOneItem(
                value,
                url,
                fieldValue,
                fieldLinkable,
                fieldSelfLinkable,
                fieldLabel,
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  /**
   * getDefinitionOneItem (bibValue, url, bibValues, fieldValue, fieldLinkable, fieldIdentifier,
   * fieldSelfLinkable, fieldLabel)
   * Gets the value for a single Bib detail field.
   *
   * @param {string} bibValue - the value for the current field
   * @param {string} url - for constructing the query values of the URLs
   * @param {string} fieldValue - the name of the current field
   * @param {boolean} fieldLinkable - if the field should be clickable
   * @param {boolean} fieldSelfLinkable - if the Bib field already has a URL
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
  const getDefinitionOneItem = (
    bibValue,
    url,
    fieldValue,
    fieldLinkable,
    fieldSelfLinkable,
    fieldLabel,
  ) => {
    if (fieldValue === 'subjectLiteral') {
      return constructSubjectHeading(
        bibValue,
        url,
        fieldLabel,
      );
    }

    if (fieldLinkable) {
      return searchLink({
        query: url,
        label: bibValue,
        analyticsLabel: fieldLabel,
        analyticsValue: bibValue,
      });
    }

    if (fieldSelfLinkable) {
      return (
        <a
          href={bibValue.url}
          onClick={() =>
            trackDiscovery(
              'Bib fields',
              `${fieldLabel} - ${bibValue.prefLabel}`,
            )
          }
        >
          {bibValue.prefLabel || bibValue.label || bibValue.url}
        </a>
      );
    }
    return <span>{bibValue}</span>;
  }

  /**
   * getDisplayFields(bib)
   * Get an array of definition term/values.
   *
   * @param {object} bib
   * @return {object} fields
   * @return {array}
   */
  const getDisplayFields = (bib, fields) => {
    // A value of 'React Component' just means that we are getting it from a
    // component rather than from the bib field properties.
    const fieldsToRender = [];

    fields.forEach((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldLinkable = field.linkable;
      const fieldSelfLinkable = field.selfLinkable;
      const fieldIdentifier = field.identifier;
      let bibValues = bib[fieldValue];

      if (fieldValue === 'subjectLiteral') {
        bibValues = compressSubjectLiteral(bib[fieldValue]);
      }

      if (fieldValue === 'identifier') {
        // return getIdentifiers(bibValues, fieldIdentifier);
        bibValues = bib.updatedIdentifiers && bib.updatedIdentifiers[fieldLabel];
      }

      // skip absent fields
      if (bibValues && bibValues.length && _isArray(bibValues)) {
        // Taking just the first value for each field to check the type.
        const firstFieldValue = bibValues[0];

        // Each value is an object with @id and prefLabel properties.
        if (firstFieldValue['@id']) {
          fieldsToRender.push({
            term: fieldLabel,
            definition: getDefinitionObject(
              bibValues,
              fieldValue,
              fieldLinkable,
              fieldSelfLinkable,
              fieldLabel,
            ),
          });
        } else {
          const definition = getDefinition(
            bibValues,
            fieldValue,
            fieldLinkable,
            fieldSelfLinkable,
            fieldLabel,
          );
          if (definition) {
            fieldsToRender.push({
              term: fieldLabel,
              definition,
            });
          }
        }
      }

      // The Owner is complicated too.
      if (fieldLabel === 'Owning Institutions' && props.bib?.owner) {
        fieldsToRender.push({
          term: fieldLabel,
          definition: props.bib.owner,
        });
      }

      // Note field rendering as array of objects instead of an array of strings.
      // Parse the original and new note format.
      // Original format: ['string1', 'string2']
      // Updated 2018 format:
      //    [{'@type': 'bf:Note',
      //      'noteType': 'string',
      //      'prefLabel': 'string'},
      //    {...}]
      if (fieldLabel === 'Notes' && !_isEmpty(props.bib.notesGroupedByNoteType)) {
        const notesGroupedByNoteType = props.bib.notesGroupedByNoteType;
        // For each group of notes, add a fieldToRender:
        Object.keys(notesGroupedByNoteType).forEach((noteType) => {
          const notesList = (
            <ul>
              {notesGroupedByNoteType[noteType].map((note, idx) => (
                <li key={idx.toString()}>{note.prefLabel}</li>
              ))}
            </ul>
          );
          fieldsToRender.push({
            term: noteType,
            definition: notesList,
          });
        });
      }

      if (
        fieldLabel === 'Electronic Resource' &&
        props.electronicResources.length > 0
      ) {
        const electronicResources = props.electronicResources;
        const electronicResourcesLink = ({ href, label }) => (
          <a
            href={href}
            target="_blank"
            onClick={() =>
              trackDiscovery(
                'Bib fields',
                `Electronic Resource - ${label} - ${href}`,
              )
            }
            rel='noreferrer'
          >
            {label || href}
          </a>
        );
        let electronicElem;

        // If there is only one electronic resource, then
        // just render a single anchor element.
        if (electronicResources.length === 1) {
          const electronicItem = electronicResources[0];
          electronicElem = electronicResourcesLink({
            href: electronicItem.url,
            label: electronicItem.label,
          });
        } else {
          // Otherwise, create a list of anchors.
          electronicElem = (
            <ul>
              {electronicResources.map((resource) => (
                <li key={resource.label}>
                  {electronicResourcesLink({
                    href: resource.url,
                    label: resource.label,
                  })}
                </li>
              ))}
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

  /**
   * compressSubjectLiteral(subjectLiteralArray)
   * Updates the string structure of subject literals.
   *
   * @param {array} subjectLiteralArray
   * @return {array}
   */
  const compressSubjectLiteral = (subjectLiteralArray) => {
    if (Array.isArray(subjectLiteralArray) && subjectLiteralArray.length) {
      return subjectLiteralArray.map((item) =>
        item.replace(/\.$/, '').replace(/--/g, '>'),
      );
    }

    return subjectLiteralArray;
  }

  /**
   * constructSubjectHeading(bibValue, url, fieldLabel)
   * Constructs the link elements of subject headings.
   *
   * @param {string} bibValue - for constructing the texts of link elements
   * @param {string} url - for constructing the query values of the URLs
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
  const constructSubjectHeading = (bibValue, url, fieldLabel) => {
    let currentArrayString = '';
    const filterQueryForSubjectHeading = 'filters[subjectLiteral]=';
    const singleSubjectHeadingArray = bibValue.split(' > ');
    const returnArray = [];

    const urlArray = url
      .replace(filterQueryForSubjectHeading, '')
      .split(' > ')
      .map((urlString, index) => {
        const dashDivided = index !== 0 ? ' -- ' : '';
        currentArrayString = `${currentArrayString}${dashDivided}${urlString}`;

        return currentArrayString;
      });

    singleSubjectHeadingArray.forEach((heading, index) => {
      const urlWithFilterQuery = `${filterQueryForSubjectHeading}${urlArray[index]}`;

      const subjectHeadingLink = searchLink({
        query: urlWithFilterQuery,
        label: heading,
        analyticsLabel: fieldLabel,
        analyticsValue: urlArray[index],
      });

      returnArray.push(subjectHeadingLink);

      // Push a divider in between the link elements
      if (index < singleSubjectHeadingArray.length - 1) {
        returnArray.push(<span key={`divider-${index}`}> &gt; </span>);
      }
    });

    return returnArray;
  }

  /**
   * Creates a react-router `Link` component set for searching a
   * specific query within the app.
   * 
   * @param {string} query - the search query to add in the URL
   * @param {string} label - the visible label for the anchor element
   * @param {string} analyticsLabel - label text used for Google Analytics
   * @param {string} analyticsValue - value text used for Google Analytics
   * @returns React-router `Link` component.
   */
  const searchLink = ({ query, label, analyticsLabel, analyticsValue }) => {
    const onClick = (event) => {
      event.preventDefault();

      trackDiscovery('Bib fields', `${analyticsLabel} - ${analyticsValue}`);
      router.push(`${appConfig.baseUrl}/search?${query}`);
    };

    return (
      <Link
        key={label.trim().replace(/ /g,'')}
        onClick={onClick}
        to={`${appConfig.baseUrl}/search?${query}`}
      >
        {label}
      </Link>
    )
  };

  // Make sure bib prop is
  //  1) nonempty
  //  2) an object
  //  3) not an array (which is also an object)
  if (
    _isEmpty(props.bib) ||
    !_isObject(props.bib) ||
    _isArray(props.bib)
  ) {
    return null;
  }
  // Make sure fields is a nonempty array:
  if (_isEmpty(props.fields) || !_isArray(props.fields)) {
    return null;
  }

  const bibDetails = getDisplayFields(props.bib, props.fields);
  const data = combineBibDetailsData(bibDetails, props.additionalData || []);

  return (
    <DefinitionList
      data={data}
      headings={props.bib.subjectHeadingData}
    />
  );
};

BibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  electronicResources: PropTypes.array,
  additionalData: PropTypes.array,
};
BibDetails.defaultProps = {
  electronicResources: [],
  additionalData: [],
};

export default BibDetails;
