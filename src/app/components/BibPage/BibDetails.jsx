import { Link as DSLink } from '@nypl/design-system-react-components';
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
import {
  combineBibDetailsData,
  constructSubjectHeadingsArray,
  stringDirection,
} from '../../utils/bibDetailsUtils';
import { RouterContext } from '../../context/RouterContext';

const BibDetails = (props) => {
  const { router } = React.useContext(RouterContext);
  const useParallels = props.features && props.features.includes('parallels');

  /**
   * getDefinition(bibValues, fieldValue, fieldLinkable,
   *   fieldSelfLinkable, fieldLabel)
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
    // If there is only one value object in the array for the bib,
    // then render this definition value as a simple `span`, react-router
    // `link`, or an `a` tag.
    if (bibValues.length === 1) {
      const bibValue = bibValues[0];
      const url = `filters[${fieldValue}]=${bibValue}`;
      return renderSingleValue(
        bibValue,
        url,
        fieldValue,
        fieldLinkable,
        fieldSelfLinkable,
        fieldLabel,
      );
    }

    // Otherwise, render every value object in the array for the bib in a list.
    // Each list item definition will be rendered as a simple `span`,
    // react-router `link`, or an `a` tag.
    return (
      <ul>
        {bibValues.map((value, index) => {
          const queryString = typeof value === 'string' ? value : value.label;
          // @NOTE this encodes ">" as "%3E" so in "renderSingleValue",
          // the mapping done to create the url queries does not work.
          // This tends to set the url query to `filters[...]=undefined`,
          // because `value.label` is not defined.
          const url = `filters[${fieldValue}]=${encodeURIComponent(
            queryString,
          )}`;

          const liInner = renderSingleValue(
            value,
            url,
            fieldValue,
            fieldLinkable,
            fieldSelfLinkable,
            fieldLabel,
          );

          const direction = (liInner.props && liInner.props.dir) ? liInner.props.dir : null;
          const listElement = (
            <li key={`filter${fieldValue}-${index}`} dir={direction} className={direction}>
              {liInner}
            </li>
          );

          return listElement;
        })}
      </ul>
    );
  };

  /**
   * renderSingleValue (bibValue, url, bibValues, fieldValue,
   *   fieldLinkable, fieldSelfLinkable, fieldLabel)
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
  const renderSingleValue = (
    bibValue,
    url,
    fieldValue,
    fieldLinkable,
    fieldSelfLinkable,
    fieldLabel,
  ) => {
    if (fieldValue === 'subjectLiteral') {
      const subjectHeadings = constructSubjectHeadingsArray(url);
      return constructSubjectHeadingLinks(
        bibValue,
        subjectHeadings,
        fieldLabel,
      );
    }

    if (fieldLinkable) {
      return searchRouterLink({
        query: url,
        label: bibValue,
        analyticsLabel: fieldLabel,
        analyticsValue: bibValue,
      });
    }

    if (fieldSelfLinkable) {
      const linkText = bibValue.prefLabel || bibValue.label || bibValue.url
      return (
        <DSLink
          href={bibValue.url}
          dir={stringDirection(linkText, useParallels)}
        >
          {linkText}
        </DSLink>
      );
    }

    return <span dir={stringDirection(bibValue, useParallels)}>{bibValue}</span>;
  };

  /**
   * getDisplayFields(bib)
   * Get an array of term/value object pairs for usage
   * in the DefinitionList component.
   *
   * @param {object} bib
   * @return {object} fields
   * @return {array}
   */
  const getDisplayFields = (bib, fields) => {
    const fieldsToRender = [];

    fields.forEach((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldLinkable = field.linkable;
      const fieldSelfLinkable = field.selfLinkable;
      let bibValues = bib[fieldValue];

      // For `subjectLiteral`, `identifier`, and almost every other field,
      // all the values that need to be rendered as the definition are
      // located in the `bib` object, with the field value as the key.

      if (fieldValue === 'subjectLiteral') {
        bibValues = bib.updatedSubjectLiteral;
      }

      if (fieldValue === 'identifier') {
        bibValues =
          bib.updatedIdentifiers && bib.updatedIdentifiers[fieldLabel];
      }

      // skip absent fields
      if (bibValues && _isArray(bibValues) && bibValues.length > 0) {
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

      // For the rest of the fields in the `bib` object, the values are
      // structured in ways that cannot be easily rendered with the
      // `getDefinition` function above.

      // The Owner is complicated too
      if (fieldLabel === 'Owning Institutions' && props.bib?.owner) {
        fieldsToRender.push({
          term: fieldLabel,
          definition: props.bib.owner,
        });
      }

      // For each group of notes, add them to the definition list individually.
      if (
        fieldLabel === 'Notes' &&
        !_isEmpty(bib.notesGroupedByNoteType)
      ) {
        const notesGroupedByNoteType = props.bib.notesGroupedByNoteType;
        Object.keys(notesGroupedByNoteType).forEach((noteType) => {
          const notesList = (
            <ul>
              {notesGroupedByNoteType[noteType].map((note, index) => (
                <li key={index}
                  dir={stringDirection(note.prefLabel, useParallels)}
                  className={stringDirection(note.prefLabel, useParallels)}
                >
                  {note.prefLabel}
                </li>
              ))}
            </ul>
          );
          fieldsToRender.push({
            term: noteType,
            definition: notesList,
          });
        });
      }
    }); // End of the forEach loop

    return fieldsToRender;
  };

  /**
   * constructSubjectHeadingLinks(bibValue, urlArray, fieldLabel)
   * Constructs the link elements of subject headings.
   *
   * @param {string} bibValue - for constructing the texts of link elements
   * @param {string} urlArray - for constructing the query values of the URLs
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element array} Returns an array of react router links
   *   separated with a > character.
   */
  const constructSubjectHeadingLinks = (bibValue, urlArray, fieldLabel) => {
    const filterQueryForSubjectHeading = 'filters[subjectLiteral]=';
    const singleSubjectHeadingArray = bibValue.split(' > ');
    const returnArray = [];

    singleSubjectHeadingArray.forEach((heading, index) => {
      const urlWithFilterQuery = `${filterQueryForSubjectHeading}${urlArray[index]}`;

      const subjectHeadingLink = searchRouterLink({
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
  };

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
  const searchRouterLink = ({
    query,
    label,
    analyticsLabel,
    analyticsValue,
  }) => {
    const onClick = (event) => {
      event.preventDefault();
      router.push(`${appConfig.baseUrl}/search?${query}`);
    };

    return (
      <DSLink dir={stringDirection(label, useParallels)}>
        <Link
          key={label.trim().replace(/ /g, '')}
          onClick={onClick}
          to={`${appConfig.baseUrl}/search?${query}`}
        >
          {label}
        </Link>
      </DSLink>
    );
  };

  // Make sure bib prop is
  //  1) nonempty
  //  2) an object
  //  3) not an array (which is also an object)
  if (_isEmpty(props.bib) || !_isObject(props.bib) || _isArray(props.bib)) {
    return null;
  }
  // Make sure fields is a nonempty array:
  if (_isEmpty(props.fields) || !_isArray(props.fields)) {
    return null;
  }

  const bibDetails = getDisplayFields(props.bib, props.fields);
  const data = combineBibDetailsData(bibDetails, props.additionalData || []);

  return <DefinitionList data={data} headings={props.bib.subjectHeadingData} />;
};

BibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  electronicResources: PropTypes.array,
  additionalData: PropTypes.array,
  features: PropTypes.array,
};
BibDetails.defaultProps = {
  electronicResources: [],
  additionalData: [],
  features: [],
};

export default BibDetails;
