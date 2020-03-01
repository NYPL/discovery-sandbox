import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isObject as _isObject,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
  findIndex as _findIndex,
} from 'underscore';

import {
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import DefinitionList from './DefinitionList';
import appConfig from '../../data/appConfig';
import getOwner from '../../utils/getOwner';
import LibraryItem from '../../utils/item';

class BibDetails extends React.Component {
  constructor(props) {
    super(props);
    this.owner = getOwner(this.props.bib);
  }

  // componentDidMount() {
  //   window.bibStore = this.props.store;
  // }

  /**
   * Return note array or null.
   *
   * @param {object} bib
   * @return {null|array}
   */
  getNote(bib) {
    const note = bib.note;
    const notes = note && note.length ? note : null;

    if (!notes) {
      return null;
    }

    return notes;
  }

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
      <ul className="additionalDetails">
        {
          bibValues.map((value) => {
            const url = `filters[${fieldValue}]=${value['@id']}`;
            let itemValue = fieldLinkable ?
              (
                <Link
                  onClick={e => this.newSearch(e, url, fieldValue, value['@id'], fieldLabel)}
                  to={`${appConfig.baseUrl}/search?${url}`}
                >
                  {value.prefLabel}
                </Link>
              )
              : <span>{value.prefLabel}</span>;
            if (fieldSelfLinkable) {
              itemValue = (
                <a
                  href={value['@id']}
                  onClick={() => trackDiscovery('Bib fields', `${fieldLabel} - ${value.prefLabel}`)}
                >
                  {value.prefLabel}
                </a>
              );
            }

            return (<li key={value.prefLabel}>{itemValue}</li>);
          })
        }
      </ul>
    );
  }

  /**
   * Given an array of identifier entities and an rdf:type, returns markup to
   * render the values - if any - for the requested type.
   *
   * @param {array<object>} bibValues - Array of entities to inspect
   * @param {string} identifierType - The rdf:type to get (e.g. bf:Isbn)
   */
  getIdentifiers(bibValues, identifierType) {
    const entities = LibraryItem.getIdentifierEntitiesByType(bibValues, identifierType);
    if (Array.isArray(entities) && entities.length > 0) {
      const markup = entities
        .map((ent) => {
          const nodes = [(<span key={`${ent["@value"]}`}>{ent['@value']}</span>)];
          if (ent.identifierStatus) nodes.push(<span key={`${ent["@value"]}`}> <em>({ent.identifierStatus})</em></span>);
          return nodes;
        });

      return markup.length === 1
        ? markup.pop()
        : (<ul>{markup.map(m => (<li key={m[0].key}>{m}</li>))}</ul>);
    }
    return null;
  }

  /**
   * getDefinition(bibValues, fieldValue, fieldLinkable, fieldIdentifier,
   * fieldSelfLinkable, fieldLabel)
   * Gets a list, or one value, of data to display for a field from the API.
   *
   * @param {array} bibValues - the value(s) of the current field
   * @param {string} fieldValue - the name of the current field
   * @param {boolean} fieldLinkable  - flags true if the field should be clickable
   * @param {string} fieldIdentifier
   * @param {string} fieldSelfLinkable - flags true if the Bib field already has a URL
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
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
      return this.getDefinitionOneItem(
        bibValue,
        url,
        bibValues,
        fieldValue,
        fieldLinkable,
        fieldIdentifier,
        fieldSelfLinkable,
        fieldLabel,
      );
    }

    return (
      <ul>
        {
          bibValues.map((value, i) => {
            const url = `filters[${fieldValue}]=${value}`;
            return (
              <li key={`filter${fieldValue}${i}`}>
                {this.getDefinitionOneItem(
                  value,
                  url,
                  bibValues,
                  fieldValue,
                  fieldLinkable,
                  fieldIdentifier,
                  fieldSelfLinkable,
                  fieldLabel,
                )}
              </li>
            );
          })
        }
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
   * @param {string} bibValues
   * @param {string} fieldValue - the name of the current field
   * @param {boolean} fieldLinkable - if the field should be clickable
   * @param {string} fieldIdentifier
   * @param {boolean} fieldSelfLinkable - if the Bib field already has a URL
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
  getDefinitionOneItem(
    bibValue, url, bibValues, fieldValue, fieldLinkable, fieldIdentifier,
    fieldSelfLinkable, fieldLabel,
  ) {
    if (fieldValue === 'subjectLiteral') {
      return this.constructSubjectHeading(bibValue, url, fieldValue, fieldLabel);
    }

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
   * @return {array}
   */
  getDisplayFields(bib) {
    // A value of 'React Component' just means that we are getting it from a
    // component rather than from the bib field properties.
    const fields = this.props.fields;
    const fieldsToRender = [];

    fields.forEach((field) => {
      const fieldLabel = field.label;
      const fieldValue = field.value;
      const fieldLinkable = field.linkable;
      const fieldSelfLinkable = field.selfLinkable;
      const fieldIdentifier = field.identifier;
      let bibValues = bib[fieldValue];

      if (fieldValue === 'subjectLiteral') {
        bibValues = this.compressSubjectLiteral(bib[fieldValue]);
      }

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

      // Note field rendering as array of objects instead of an array of strings.
      // Parse the original and new note format.
      // Original format: ['string1', 'string2']
      // 2018 format:
      //    [{'noteType': 'string',
      //     'prefLabel': 'string',
      //     '@type': 'bf:Note'},
      //    {...}]
      if (fieldLabel === 'Notes') {
        const note = this.getNote(this.props.bib);
        // Make sure we have at least one note
        if (note && Array.isArray(note)) {
          // Group notes by noteType:
          const notesGroupedByNoteType = note
            // Make sure all notes are blanknodes:
            .filter(n => (typeof n) === 'object')
            .reduce((groups, n) => {
              if (!groups[n.noteType]) groups[n.noteType] = [];
              groups[n.noteType].push(n);
              return groups;
            }, {});

          // For each group of notes, add a fieldToRender:
          Object.keys(notesGroupedByNoteType).forEach((noteType) => {
            const notesList = (
              <ul>
                {
                  notesGroupedByNoteType[noteType].map((n, i) => (
                    <li key={i.toString()}>{n.prefLabel}</li>
                  ))
                }
              </ul>
            );
            fieldsToRender.push({
              term: noteType,
              definition: notesList,
            });
          });
        }
      }

      if ((fieldLabel === 'Electronic Resource') && this.props.electronicResources.length) {
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
              {electronicItem.label || electronicItem.url}
            </a>);
        } else {
          electronicElem = (
            <ul>
              {
                electronicResources.map(e => (
                  <li key={e.label}>
                    <a
                      href={e.url}
                      target="_blank"
                      onClick={
                        () => trackDiscovery('Bib fields', `Electronic Resource - ${e.label} - ${e.url}`)
                      }
                    >
                      {e.label || e.url}
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

  /**
   * compressSubjectLiteral(subjectLiteralArray)
   * Updates the string structure of subject literals.
   *
   * @param {array} subjectLiteralArray
   * @return {array}
   */
  compressSubjectLiteral(subjectLiteralArray) {
    if (Array.isArray(subjectLiteralArray) && subjectLiteralArray.length) {
      subjectLiteralArray = subjectLiteralArray.map(item =>
        item.replace(/\.$/, '').replace(/--/g, '>'),
      );
    }

    return subjectLiteralArray;
  }


  /**
   * constructSubjectHeading(bibValue, url, fieldValue, fieldLabel)
   * Constructs the link elements of subject headings.
   *
   * @param {string} bibValue - for constructing the texts of link elements
   * @param {string} url - for constructing the query values of the URLs
   * @param {string} fieldValue - offers the values of search keywords
   * @param {string} fieldLabel - offers the type of search keywords
   * @return {HTML element}
   */
  constructSubjectHeading(bibValue, url, fieldValue, fieldLabel) {
    let currentArrayString = '';
    const filterQueryForSubjectHeading = 'filters[subjectLiteral]=';
    const singleSubjectHeadingArray = bibValue.split(' > ');
    const returnArray = [];

    const urlArray = url.replace(filterQueryForSubjectHeading, '').split(' > ')
      .map((urlString, index) => {
        const dashDivided = (index !== 0) ? ' -- ' : '';
        currentArrayString = `${currentArrayString}${dashDivided}${urlString}`;

        return currentArrayString;
      });

    singleSubjectHeadingArray.forEach((heading, index) => {
      const urlWithFilterQuery = `${filterQueryForSubjectHeading}${urlArray[index]}`;

      const subjectHeadingLink = (
        <Link
          onClick={
            e => this.newSearch(e, urlWithFilterQuery, fieldValue, urlArray[index], fieldLabel)
          }
          to={`${appConfig.baseUrl}/search?${urlWithFilterQuery}`}
          key={index}
        >
          {heading}
        </Link>
      );

      returnArray.push(subjectHeadingLink);

      // Push a divider in between the link elements
      if (index < singleSubjectHeadingArray.length - 1) {
        returnArray.push(<span key={`divider-${index}`}> &gt; </span>);
      }
    });

    return returnArray;
  }

  /**
   * Display for single and multivalued object arrays.
   * @param {array} note
   * @return {string}
   */
  noteObjectDisplay(note) {
    let display;
    if (note.length === 1) {
      display = (
        <div>
          <h4>{note[0].noteType}</h4>
          <p>{note[0].prefLabel}</p>
        </div>
      );
    } else {
      display = (
        <ul>
          {
            note.map((n, i) => (
              <li key={i.toString()}>
                <h4>
                  {n.noteType}
                </h4>
                <p>
                  {n.prefLabel}
                </p>
              </li>
            ))
          }
        </ul>
      );
    }

    return display;
  }

  /**
   * newSearch(e, query, field, value, label)
   * The method that passed as a callback to a Link element for handling onClick events.
   *
   * @param e {event} - onClick event
   * @param {string} query - the search query that is attached to the search endpoint
   * @param {string} field - the type of the search query
   * @param {string} value - the search keyword of the search. It will be used for the filter button
   * @param {string} label - the type of the search keyword. It will be used for
   * the search instruction
   */
  newSearch(e, query, field, value, label) {
    e.preventDefault();

    trackDiscovery('Bib fields', `${label} - ${value}`);
    this.context.router.push(`${appConfig.baseUrl}/search?${query}`);
  }

  render() {
    // Make sure bib prop is
    //  1) nonempty
    //  2) an object
    //  3) not an array (which is also an object)
    if (_isEmpty(this.props.bib) || !_isObject(this.props.bib) || _isArray(this.props.bib)) {
      return null;
    }
    // Make sure fields is a nonempty array:
    if (_isEmpty(this.props.fields) || !_isArray(this.props.fields)) {
      return null;
    }

    const bibDetails = this.getDisplayFields(this.props.bib);

    return (<DefinitionList data={bibDetails} headings={this.props.bib.subjectHeadingData} />);
  }
}

BibDetails.propTypes = {
  bib: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  electronicResources: PropTypes.array,
};

BibDetails.defaultProps = {
  electronicResources: [],
};

BibDetails.contextTypes = {
  router: PropTypes.object,
};

export default BibDetails;
