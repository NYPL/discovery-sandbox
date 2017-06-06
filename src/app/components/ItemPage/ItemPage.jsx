import React from 'react';
import { Link } from 'react-router';
import {
  findWhere as _findWhere,
  findIndex as _findIndex,
  mapObject as _mapObject,
  each as _each,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Search from '../Search/Search';
import ItemHoldings from './ItemHoldings';
import ItemDetails from './ItemDetails';
import LibraryItem from '../../utils/item';
import Actions from '../../actions/Actions';

import {
  ajaxCall,
  basicQuery,
} from '../../utils/utils';

class ItemPage extends React.Component {

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

  render() {
    const createAPIQuery = basicQuery(this.props);
    const record = this.props.bib ? this.props.bib : this.props.item;
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

    const displayFields = [
      {label: 'Title', field: 'title'},
      {label: 'Type', field: 'type'},
      {label: 'Language', field: 'language'},
      {label: 'Date Created', field: 'createdYear'},
      {label: 'Date Published', field: 'startYear'},
      {label: 'Contributors', field: 'contributor', linkable: true},
      {label: 'Publisher', field: 'publisher', linkable: true},
      {label: 'Place of publication', field: 'placeOfPublication'},
      {label: 'Subjects', field: 'subject'},
      {label: 'Dimensions', field: 'dimensions'},
      {label: 'Issuance', field: 'issuance'},
      {label: 'Owner', field: 'owner'},
      {label: 'Location', field: 'location'},
      {label: 'Notes', field: 'note'},
      {label: 'Bnumber', field: 'idBnum'},
    ]

    let itemDetails = [];
    displayFields.forEach((f) => {
      // skip absent fields
      if (!record[f.field] || !record[f.field].length) return false;
      let fieldValue = record[f.field][0];

      // list of links
      if (fieldValue['@id']) {
        itemDetails.push({ term: f.label, definition: <ul>{record[f.field].map((obj, i) => (<li key={i}><a onClick={(e) => this.onClick(e, `${f.field}:"${obj['@id']}"`)} href={`/search?q=${encodeURIComponent(`${f.field}:"${obj['@id']}"`)}`}>{obj.prefLabel}</a></li>))}</ul> });

      // list of links
      } else if (f.linkable) {
        itemDetails.push({ term: f.label, definition: <ul>{record[f.field].map((value, i) => (<li key={i}><a onClick={(e) => this.onClick(e, `${f.field}:"${value}"`)} href={`/search?q=${encodeURIComponent(`${f.field}:"${value}"`)}`}>{value}</a></li>))}</ul> });

      // list of plain text
      } else {
        itemDetails.push({ term: f.label, definition: <ul>{record[f.field].map((value, i) => (<li key={i}>{value}</li>))}</ul> });
      }
    });

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
                type="item"
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
                </div>

                <div className="">
                  <ItemDetails
                    data={itemDetails}
                    title="Item details"
                  />
                  <ItemHoldings
                    holdings={holdings}
                    title={`${record.numItems} item${record.numItems === 1 ? '' : 's'}
                      associated with this record:`}
                  />
                              {/*
                  <ItemDetails data={externalData} title="External data" />
                  <ItemDetails data={externalLinks} title="External links" />
                  <ItemDetails data={citeData} title="Cite this book" />
                  <ItemEditions title={title} item={record} />
                  */}
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
  field: React.PropTypes.string,
  spinning: React.PropTypes.bool,
};

ItemPage.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ItemPage;
