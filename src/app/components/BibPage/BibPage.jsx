import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  findWhere as _findWhere,
  findIndex as _findIndex,
  isArray as _isArray,
  mapObject as _mapObject,
  each as _each,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from '../Item/ItemHoldings';
import BibDetails from './BibDetails';
import LibraryItem from '../../utils/item';
import Actions from '../../actions/Actions';

import {
  ajaxCall,
  basicQuery,
} from '../../utils/utils';

class BibPage extends React.Component {

  onClick(e, query) {
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

  getDisplayFields(record, data) {
    if (!data.length) return [];

    const detailFields = [];
    data.forEach((f) => {
      // skip absent fields
      if (!record[f.field] || !record[f.field].length || !_isArray(record[f.field])) return false;
      const fieldValue = record[f.field][0];

      // external links
      if (f.url) {
        detailFields.push({
          term: f.label,
          definition: (
            <ul>
              {record[f.field].map((value, i) => {
                const v = f.field === 'idOclc' ? 'View in Worldcat' : value;
                return <li key={i}><a target="_blank" title={v} href={f.url(v)}>{v}</a></li>;
              })}
            </ul>
          ),
        });

      // list of links
      } else if (fieldValue['@id']) {
        detailFields.push({
          term: f.label,
          definition: (
            <ul>{record[f.field].map((obj, i) => (
              <li key={i}>
                <Link
                  onClick={e => this.onClick(e, `filters[${f.field}]=${obj['@id']}`)}
                  title={`Make a new search for ${f.label}: ${obj.prefLabel}`}
                  to={`/search?q=${encodeURIComponent(`filters[${f.field}]=${obj['@id']}`)}`}
                >{obj.prefLabel}</Link>
              </li>))}
            </ul>),
        });
      // list of links
      } else if (f.linkable) {
        if (f.field === 'contributorLiteral') {
          detailFields.push({
            term: f.label,
            definition: record[f.field].map((value, i) => {
              const comma = record[f.field].length > 1 ? ', ' : ' ';
              return (
                <span key={i}>
                  <Link
                    onClick={e => this.onClick(e, `filters[${f.field}]=${value}`)}
                    title={`Make a new search for ${f.label}: "${value}"`}
                    to={`/search?q=${encodeURIComponent(`filters[${f.field}]=${value}`)}`}
                  >
                    {value}
                  </Link>{comma}
                </span>
              );
            }),
          });
        } else {
          detailFields.push({
            term: f.label,
            definition: (
              <ul>{record[f.field].map((value, i) => (
                <li key={i}>
                  <Link
                    onClick={e => this.onClick(e, `filters[${f.field}]=${value}`)}
                    title={`Make a new search for ${f.label}: "${value}"`}
                    to={`/search?q=${encodeURIComponent(`filters[${f.field}]=${value}`)}`}
                  >{value}</Link>
                </li>))}
              </ul>),
          });
        }

      // list of plain text
      } else {
        detailFields.push({
          term: f.label,
          definition: <ul>{record[f.field].map((value, i) => <li key={i}>{value}</li>)}</ul>,
        });
      }
    });

    return detailFields;
  }

  render() {
    const createAPIQuery = basicQuery(this.props);
    const record = this.props.bib ? this.props.bib : this.props.item;
    const bibId = record['@id'].substring(4);
    const title = record.title && record.title.length ? record.title[0] : '';
    const authors = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (
        <span key={i}>
          <Link
            to={{ pathname: '/search', query: { q: `filter[contributorLiteral]=${author}` } }}
            title={`Make a new search for contributor: "${author}"`}
            onClick={(e) => this.onClick(e, `filter[contributorLiteral]=${author}`)}
          >
            {author}
          </Link>,&nbsp;
        </span>
      ))
      : null;
    const publisher = record.publisher && record.publisher.length ?
      <Link
        to={{ pathname: '/search', query: { q: `filter[publisher]=${record.publisher[0]}` } }}
        title={`Make a new search for publisher: "${record.publisher[0]}"`}
        onClick={(e) => this.onClick(e, `filter[publisher]=${record.publisher[0]}`)}
      >
        {record.publisher[0]}
      </Link>
      : null;
    const holdings = LibraryItem.getItems(record);

    const materialType = record && record.materialType && record.materialType[0] ?
      record.materialType[0].prefLabel : null;
    const language = record && record.language && record.language[0] ?
      record.language[0].prefLabel : null;
    const location = record && record.location && record.location[0] ?
        record.location[0].prefLabel : null;
    const placeOfPublication = record && record.placeOfPublication && record.placeOfPublication[0] ?
      record.placeOfPublication[0].prefLabel : null;
    const yearPublished = record && record.dateStartYear ? record.dateStartYear : null;
    const usageType = record && record.actionType && record.actionType[0] ?
      record.actionType[0].prefLabel : null;

    const detailFields = [
      { label: 'Title', field: 'title' },
      { label: 'Title (alternative)', field: 'titleAlt' },
      { label: 'Title (display)', field: 'titleDisplay' },
      { label: 'Type', field: 'type' },
      { label: 'Carrier Type', field: 'carrierType' },
      { label: 'Material Type', field: 'materialType' },
      { label: 'Media Type', field: 'mediaType' },
      { label: 'Language', field: 'language' },
      { label: 'Created String', field: 'createdString' },
      { label: 'Creator', field: 'creatorLiteral' },
      { label: 'Date String', field: 'dateString' },
      { label: 'Date Created', field: 'createdYear' },
      { label: 'Date Published', field: 'startYear' },
      { label: 'Contributors', field: 'contributor' },
      { label: 'Publisher', field: 'publisher' },
      { label: 'Place of publication', field: 'placeOfPublication' },
      { label: 'Subjects', field: 'subjectLiteral' },
      { label: 'Dimensions', field: 'dimensions' },
      { label: 'Extent', field: 'extent' },
      { label: 'Issuance', field: 'issuance' },
      { label: 'Owner', field: 'owner' },
      { label: 'Location', field: 'location' },
      { label: 'Notes', field: 'note' },
      { label: 'Bnumber', field: 'idBnum' },
      { label: 'LCC', field: 'idLcc' },
      { label: 'OCLC', field: 'idOclc' },
      { label: 'Owi', field: 'idOwi' },
      { label: 'URI', field: 'uris' },
      { label: 'Identifier', field: 'identifier' },
      { label: 'Number available', field: 'numAvailable' },
      { label: 'Number of items', field: 'numItems' },
      { label: 'Shelf Mark', field: 'shelfMark' },
    ];
    let shortenItems = true;
    if (this.props.location.pathname.indexOf('all') === -1) {
      shortenItems = false;
    }

    const bibDetails = this.getDisplayFields(record, detailFields);
    let searchURL = this.props.searchKeywords;

    _mapObject(this.props.selectedFacets, (val, key) => {
      if (val.length) {
        _each(val, facet => {
          if (facet && facet.value !== '') {
            searchURL += `&filters[${key}]=${facet.value}`;
          }
        });
      }
    });

    return (
      <DocumentTitle title={`${title} | Research Catalog`}>
        <main className="main-page">
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper">
              <Breadcrumbs
                query={searchURL}
                type="bib"
                title={title}
              />
              <h1>Research Catalog</h1>
            </div>
          </div>

          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-three-quarters nypl-column-offset-one">
                <Search
                  searchKeywords={this.props.searchKeywords}
                  field={this.props.field}
                  spinning={this.props.spinning}
                  createAPIQuery={createAPIQuery}
                />
              </div>
            </div>

            <div className="nypl-row">
              <div
                className="nypl-column-three-quarters nypl-column-offset-one"
                role="region"
                id="mainContent"
                aria-live="polite"
                aria-atomic="true"
                aria-relevant="additions removals"
                aria-describedby="results-description"
              >
                <div className="nypl-item-details">
                  <h1>{title}</h1>
                  <div className="nypl-item-info">
                    <p>
                      <span className="nypl-item-media">{materialType}</span>
                      {language && ` in ${language}`}
                    </p>
                    <p>{record.extent} {record.dimensions}</p>
                    <p>
                      {record.placeOfPublication} {record.publisher} {yearPublished}
                    </p>
                    <p className="nypl-item-use">{usageType}</p>
                  </div>
                </div>
              </div>

              <div className="nypl-column-three-quarters nypl-column-offset-one">
                <div className="nypl-item-details">
                  <BibDetails
                    data={bibDetails}
                    title="Bib details"
                  />
                </div>
                <div className="">
                  <ItemHoldings
                    shortenItems={shortenItems}
                    holdings={holdings}
                    bibId={bibId}
                    title={`${record.numItems} item${record.numItems === 1 ? '' : 's'}
                      associated with this record:`}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </DocumentTitle>
    );
  }
}

BibPage.propTypes = {
  item: PropTypes.object,
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  selectedFacets: PropTypes.object,
  bib: PropTypes.object,
  field: PropTypes.string,
  spinning: PropTypes.bool,
};

BibPage.contextTypes = {
  router: PropTypes.object,
};

export default BibPage;
