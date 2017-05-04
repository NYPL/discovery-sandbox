import React from 'react';
import { Link } from 'react-router';
import {
  findWhere as _findWhere,
  findIndex as _findIndex,
  mapObject as _mapObject,
} from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from './ItemHoldings';
import ItemDetails from './ItemDetails';
import ItemOverview from './ItemOverview';
import ItemEditions from './ItemEditions';
import LibraryItem from '../../utils/item';
// import EmbeddedDocument from './EmbeddedDocument';
import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

class ItemPage extends React.Component {
  onClick(e, query) {
    e.preventDefault();

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
    });
  }

  getDisplayFields(record, data) {
    if (!data.length) return [];

    const displayFields = [];
    data.forEach((f) => {
      // skip absent fields
      if (!record[f.field] || !record[f.field].length) return false;
      const fieldValue = record[f.field][0];

      // external links
      if (f.url) {
        displayFields.push({
          term: f.label,
          definition: (
            <ul>
              {record[f.field].map((value, i) => {
                const v = f.field === 'idOwi' ? value.substring(8) : value;
                return <li key={i}><a target="_blank" title={v} href={f.url(v)}>{v}</a></li>;
              })}
            </ul>
          ),
        });

      // list of links
      } else if (fieldValue['@id']) {
        displayFields.push(
          { term: f.label,
            definition: <ul>{record[f.field].map((obj, i) => (
              <li key={i}>
                <a
                  onClick={e => this.onClick(e, `${f.field}:"${obj['@id']}"`)}
                  title={`Make a new search for ${f.label}: ${obj.prefLabel}`}
                  href={`/search?q=${encodeURIComponent(`${f.field}:"${obj['@id']}"`)}`}
                >{obj.prefLabel}</a>
              </li>))}
            </ul>,
          },
        );

      // list of links
      } else if (f.linkable) {
        displayFields.push(
          { term: f.label,
            definition: <ul>{record[f.field].map((value, i) => (
              <li key={i}>
                <a
                  onClick={e => this.onClick(e, `${f.field}:"${value}"`)}
                  title={`Make a new search for ${f.label}: "${value}"`}
                  href={`/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}`}
                >{value}</a>
              </li>))}
            </ul>,
          },
        );

      // list of plain text
      } else {
        displayFields.push(
          { term: f.label,
            definition: <ul>{record[f.field].map((value, i) => (
              <li key={i}>{value}</li>))}</ul> });
      }
    });

    return displayFields;
  }

  render() {
    const record = this.props.bib ? this.props.bib : this.props.item;
    const title = record.title[0];
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
    // const hathiEmbedURL = record.hathiVols && record.hathiVols.length ?
    //   `//hdl.handle.net/2027/${record.hathiVols[0].volumeId}?urlappend=%3Bui=embed` : '';
    // const hathiURL = record.hathiVols && record.hathiVols.length ?
    //   `https://hdl.handle.net/2027/${record.hathiVols[0].volumeId}` : '';

    const externalFields = [
      { label: 'OCLC Number', field: 'idOclc', url: (id) => `http://worldcat.org/oclc/${id}` },
      { label: 'OCLC Workid', field: 'idOwi', url: (id) => `http://classify.oclc.org/classify2/ClassifyDemo?owi=${id}` },
    ];
    const displayFields = [
      { label: 'Title', field: 'title' },
      { label: 'Type', field: 'type' },
      { label: 'Material Type', field: 'materialType' },
      { label: 'Language', field: 'language' },
      { label: 'Date Created', field: 'createdString' },
      { label: 'Date Published', field: 'dateString' },
      { label: 'Contributors', field: 'contributor', linkable: true },
      { label: 'Publisher', field: 'publisher', linkable: true },
      { label: 'Place of publication', field: 'placeOfPublication' },
      { label: 'Subjects', field: 'subjectLiteral', linkable: true },
      { label: 'Dimensions', field: 'dimensions' },
      { label: 'Issuance', field: 'issuance' },
      { label: 'Owner', field: 'owner' },
      { label: 'Location', field: 'location' },
      { label: 'Notes', field: 'note' },
      { label: 'Bnumber', field: 'idBnum' },
      { label: 'LCC', field: 'idLcc' },
    ];
    const overviewFields = [
      { label: 'Material Type', field: 'materialType' },
      { label: 'Author', field: 'contributor' },
      { label: 'Published', field: 'createdString' },
      { label: 'Publisher', field: 'publisher' },
      { label: 'At Location', field: 'location' },
      { label: 'Usage Type', field: 'actionLabel' },
    ];

    const externalLinks = this.getDisplayFields(record, externalFields);
    const itemDetails = this.getDisplayFields(record, displayFields);
    const itemOverview = this.getDisplayFields(record, overviewFields);
    const sortBy = this.props.sortBy;

    let searchURL = this.props.searchKeywords;

    _mapObject(this.props.selectedFacets, (val, key) => {
      if (val.value !== '') {
        searchURL += ` ${key}:"${val.id}"`;
      }
    });

    return (
      <main className="main-page">
        <div className="nypl-page-header">
          <div className="nypl-full-width-wrapper">
            <Breadcrumbs
              query={searchURL}
              type="item"
              title={title}
            />
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <Search sortBy={sortBy} />
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
              <div className="nypl-results-item">
                <h1>{title}</h1>

                <ul className="nypl-item-toc">
                  <li><a href="#item-holdings">Item holdings</a></li>
                  <li><a href="#item-details">Item details</a></li>
                  <li><a href="#item-external-links">External links</a></li>
                </ul>

                <div id="nypl-results-text">
                  <ItemOverview
                    data={itemOverview}
                  />
                </div>

                <ItemHoldings
                  path={this.props.location.search}
                  holdings={holdings}
                  title={`${record.numAvailable} item${record.numAvailable === 1 ? '' : 's'} associated with this record:`}
                />

                <div className="item-details">
                  <div id="item-details">
                    <ItemDetails
                      data={itemDetails}
                      title="Item details"
                    />
                  </div>

                  <div id="item-external-links">
                    <ItemDetails
                      data={externalLinks}
                      title="External links"
                    />
                  </div>
                </div>

              <ItemEditions title={title} item={record} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

ItemPage.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  location: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
  sortBy: React.PropTypes.string,
};

ItemPage.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemPage;
