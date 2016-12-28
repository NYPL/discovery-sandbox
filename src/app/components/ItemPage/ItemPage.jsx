import React from 'react';
import { Link } from 'react-router';
import {
  findWhere as _findWhere,
  findIndex as _findIndex,
  mapObject as _mapObject,
} from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import ItemHoldings from './ItemHoldings.jsx';
import ItemDetails from './ItemDetails.jsx';
import ItemEditions from './ItemEditions.jsx';
import LibraryItem from '../../utils/item.js';
import EmbeddedDocument from './EmbeddedDocument.jsx';
import Actions from '../../actions/Actions.js';
import { ajaxCall } from '../../utils/utils.js';

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
                return <li key={i}><a target="_blank" href={f.url(v)}>{v}</a></li>;
              })}
            </ul>
          ),
        });

      // list of links
      } else if (fieldValue['@id']) {
        displayFields.push({ term: f.label, definition: <ul>{record[f.field].map((obj, i) => (<li key={i}><a onClick={(e) => this.onClick(e, `${f.field}:"${obj['@id']}"`)} href={`/search?q=${encodeURIComponent(`${f.field}:"${obj['@id']}"`)}`}>{obj.prefLabel}</a></li>))}</ul> });

      // list of links
      } else if (f.linkable) {
        displayFields.push({ term: f.label, definition: <ul>{record[f.field].map((value, i) => (<li key={i}><a onClick={(e) => this.onClick(e, `${f.field}:"${value}"`)} href={`/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}`}>{value}</a></li>))}</ul> });

      // list of plain text
      } else {
        displayFields.push({ term: f.label, definition: <ul>{record[f.field].map((value, i) => (<li key={i}>{value}</li>))}</ul> });
      }
    });

    return displayFields;
  }

  render() {
    const record = this.props.item;
    const title = record.title[0];
    const authors = record.contributor && record.contributor.length ?
      record.contributor.map((author, i) => (
        <span key={i}>
          <Link
            to={{ pathname: '/search', query: { q: `contributor:"${author}"` } }}
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
        onClick={(e) => this.onClick(e, `publisher:"${record.publisher[0]}"`)}
      >
        {record.publisher[0]}
      </Link>
      : null;
    const holdings = LibraryItem.getItems(record);
    const hathiEmbedURL = record.hathiVols && record.hathiVols.length ? `//hdl.handle.net/2027/${record.hathiVols[0].volumeId}?urlappend=%3Bui=embed` : '';
    const hathiURL = record.hathiVols && record.hathiVols.length ? `https://hdl.handle.net/2027/${record.hathiVols[0].volumeId}` : '';

    const externalFields = [
      { label: 'OCLC Number', field: 'idOclc', url: (id) => `http://worldcat.org/oclc/${id}` },
      { label: 'OCLC Workid', field: 'idOwi', url: (id) => `http://classify.oclc.org/classify2/ClassifyDemo?owi=${id}` },
    ];
    const displayFields = [
      { label: 'Title', field: 'title' },
      { label: 'Type', field: 'type' },
      { label: 'Language', field: 'language' },
      { label: 'Date Created', field: 'createdYear' },
      { label: 'Date Published', field: 'startYear' },
      { label: 'Contributors', field: 'contributor', linkable: true },
      { label: 'Publisher', field: 'publisher', linkable: true },
      { label: 'Place of publication', field: 'placeOfPublication' },
      { label: 'Subjects', field: 'subject' },
      { label: 'Dimensions', field: 'dimensions' },
      { label: 'Issuance', field: 'issuance' },
      { label: 'Owner', field: 'owner' },
      { label: 'Location', field: 'location' },
      { label: 'Notes', field: 'note' },
      { label: 'Bnumber', field: 'idBnum' },
      { label: 'LCC', field: 'idLcc' },
    ];

    const externalLinks = this.getDisplayFields(record, externalFields);
    const itemDetails = this.getDisplayFields(record, displayFields);
    let searchURL = this.props.searchKeywords;

    _mapObject(this.props.selectedFacets, (val, key) => {
      if (val.value !== '') {
        searchURL += ` ${key}:"${val.id}"`;
      }
    });

    return (
      <div id="mainContent">
        <div className="page-header">
          <div className="content-wrapper">
            <Breadcrumbs
              query={searchURL}
              type="item"
              title={title}
            />
          </div>
        </div>

        <div className="content-wrapper">
          <div className="item-header">
            <div className="item-info">
              <h1>{title}</h1>
                {
                  authors &&
                    <div className="description author">
                      By {authors}
                    </div>
                }
                {
                  publisher &&
                    <div className="description">
                      Publisher: {publisher}
                    </div>
                }
              <div className="description">
                Year published:
                <Link
                  to={{ pathname: '/search', query: { q: `date:${record.startYear}` } }}
                  onClick={(e) => this.onClick(e, `date:${record.startYear}`)}
                >
                  {record.startYear}
                </Link>
              </div>
            </div>
          </div>

          <ItemHoldings
            path={this.props.location.search}
            holdings={holdings}
            title={`${record.numAvailable} cop${record.numAvailable === 1 ? 'y' : 'ies'} of this item ${record.numAvailable === 1 ? 'is' : 'are'} available at the following locations:`}
          />

          <EmbeddedDocument
            externalURL={hathiEmbedURL}
            embedURL={hathiURL}
            owner="Hathi Trust"
            title="View this item on this website"
          />

          <div className="item-details">
            <ItemDetails
              data={itemDetails}
              title="Item details"
            />

            <ItemDetails
              data={externalLinks}
              title="External links"
            />

            {/*
            <ItemDetails data={externalData} title="External data" />

            <ItemDetails data={citeData} title="Cite this book" />
            */}
          </div>

          <ItemEditions title={title} item={record} />

        </div>
      </div>
    );
  }
}

ItemPage.propTypes = {
  item: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  location: React.PropTypes.object,
  selectedFacets: React.PropTypes.object,
};

ItemPage.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemPage;
