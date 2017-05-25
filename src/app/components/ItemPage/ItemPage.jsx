import React from 'react';
import { Link } from 'react-router';
import {
  findWhere as _findWhere,
  findIndex as _findIndex,
  mapObject as _mapObject,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from './ItemHoldings';
import ItemDetails from './ItemDetails';
import LibraryItem from '../../utils/item';
import Actions from '../../actions/Actions';

import { ajaxCall } from '../../utils/utils';

class ItemPage extends React.Component {

  onClick(e, query) {
    e.preventDefault();

    Actions.updateSpinner(true);
    ajaxCall(`/api?q=${query}`, (response) => {
      const q = query.indexOf(':"') !== -1 ? query.split(':"') : query.split(':');
      const field = q[0];
      const value = q[1].replace('"', '');

      // Find the index where the field exists in the list of facets from the API
      const index = _findIndex(response.data.facets.itemListElement, { field });

      // If the index exists, try to find the facet value from the API
      if (response.data.facets.itemListElement[index]) {
        const facet = _findWhere(response.data.facets.itemListElement[index].values, { value });

        // The API may return a list of facets in the selected field, but the wanted
        // facet may still not appear. If that's the case, return the clicked facet value.
        Actions.updateSelectedFacets({
          [field]: {
            id: facet ? facet.value : value,
            value: facet ? (facet.label || facet.value) : value,
          },
        });
      } else {
        // Otherwise, the field wasn't found in the API. Returning this highlights the
        // facet in the selected facet region, but now in the facet sidebar.
        Actions.updateSelectedFacets({
          [field]: {
            id: value,
            value,
          },
        });
      }
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateFacets(response.data.facets);
      Actions.updateSearchKeywords('');
      Actions.updatePage('1');
      this.context.router.push(`/search?q=${query}`);
      Actions.updateSpinner(false);
    });
  }

  getDisplayFields(record, data) {
    if (!data.length) return [];

    const detailFields = [];
    data.forEach((f) => {
      // skip absent fields
      if (!record[f.field] || !record[f.field].length) return false;
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
                <a
                  onClick={e => this.onClick(e, `${f.field}:"${obj['@id']}"`)}
                  title={`Make a new search for ${f.label}: ${obj.prefLabel}`}
                  href={`/search?q=${encodeURIComponent(`${f.field}:"${obj['@id']}"`)}`}
                >{obj.prefLabel}</a>
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
                  <a
                    onClick={e => this.onClick(e, `${f.field}:"${value}"`)}
                    title={`Make a new search for ${f.label}: "${value}"`}
                    href={`/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}`}
                  >
                    {value}
                  </a>{comma}
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
                  <a
                    onClick={e => this.onClick(e, `${f.field}:"${value}"`)}
                    title={`Make a new search for ${f.label}: "${value}"`}
                    href={`/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}`}
                  >{value}</a>
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
    const record = this.props.bib ? this.props.bib : this.props.item;
    const title = record.title && record.title.length ? record.title[0] : '';
    const authors = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (
        <span key={i}>
          <Link
            to={{ pathname: '/search', query: { q: `contributor:"${author}"` } }}
            title={`Make a new search for contributor: "${author}"`}
            onClick={(e) => this.onClick(e, `contributor:"${author}"`)}
          >
            {author}
          </Link>,&nbsp;
        </span>
      ))
      : null;
    const publisher = record.publisher && record.publisher.length ?
      <Link
        to={{ pathname: '/search', query: { q: `publisher:"${record.publisher[0]}"` } }}
        title={`Make a new search for publisher: "${record.publisher[0]}"`}
        onClick={(e) => this.onClick(e, `publisher:"${record.publisher[0]}"`)}
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
      { label: 'Author/Creator', field: 'creatorLiteral', linkable: true },
      { label: 'Contributors', field: 'contributorLiteral', linkable: true },
      { label: 'Subjects', field: 'subjectLiteral', linkable: true },
      { label: 'Owner', field: 'owner', linkable: true },
      { label: 'Alternative Titles', field: 'titleAlt', linkable: false },
      { label: 'Description', field: 'description', linkable: false },
      { label: 'Notes', field: 'note' },
      { label: 'External links', field: 'idOclc', url: (id) => `http://worldcat.org/oclc/${id}` },
    ];

    const itemDetails = this.getDisplayFields(record, detailFields);
    let searchURL = this.props.searchKeywords;

    _mapObject(this.props.selectedFacets, (val, key) => {
      if (val.value !== '') {
        searchURL += ` ${key}:"${val.id}"`;
      }
    });

    return (
      <DocumentTitle title={`${title} | Research Catalog`}>
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            <Breadcrumbs
              query={searchURL}
              type="item"
              title={title}
            />
            <h1>Research Catalog</h1>
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters nypl-column-offset-one">
              <Search />
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
            <div className="nypl-column-one-quarter nypl-item-holdings">
              <ItemHoldings
                holdings={holdings}
                title={`${record.numItems} item${record.numItems === 1 ? '' : 's'}
                  associated with this record:`}
              />
            </div>

            <div className="nypl-column-three-quarters">
              <div className="nypl-item-details">
                <ItemDetails data={itemDetails} />
              </div>
            </div>
          </div>
        </div>
      </main>
      </DocumentTitle>
    );
  }
}

ItemPage.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  location: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
  bib: React.PropTypes.object,
};

ItemPage.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemPage;
