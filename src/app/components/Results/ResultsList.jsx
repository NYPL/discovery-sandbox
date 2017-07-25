import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isEmpty as _isEmpty,
  chain as _chain,
} from 'underscore';

import Actions from '../../actions/Actions';
import LibraryItem from '../../utils/item';
import { ajaxCall } from '../../utils/utils';
import ItemTable from '../Item/ItemTable';

import appConfig from '../../../../appConfig.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getBibRecord = this.getBibRecord.bind(this);
    this.getItemRecord = this.getItemRecord.bind(this);
  }

  /*
   * getBibRecord(e, bibId)
   * @description Get updated information for a bib and route the patron to the bib page.
   * @param {object} e Event object.
   * @param {string} bibId The bib's id.
   */
  getBibRecord(e, bibId) {
    e.preventDefault();

    ajaxCall(`${appConfig.baseUrl}/api/bib?bibId=${bibId}`,
      (response) => {
        Actions.updateBib(response.data);

        this.routeHandler(`/bib/${bibId}`);
      },
      error => {
        console.log(error);
      }
    );
  }

  /*
   * getItemRecord(e, bibId, itemId)
   * @description Get updated information for an item along with its delivery locations.
   * And then route the patron to the hold request page.
   * @param {object} e Event object.
   * @param {string} bibId The bib's id.
   * @param {string} itemId The item's id.
   */
  getItemRecord(e, bibId, itemId) {
    e.preventDefault();

    ajaxCall(`${appConfig.baseUrl}/api/hold/request/${bibId}-${itemId}`,
      (response) => {
        Actions.updateBib(response.data.bib);
        Actions.updateDeliveryLocations(response.data.deliveryLocations);
        Actions.updateIsEddRequestable(response.data.isEddRequestable);

        this.routeHandler(`/hold/request/${bibId}-${itemId}`);
      },
      error => {
        console.log(error);
      }
    );
  }

  getCollapsedBibs(collapsedBibs) {
    if (!collapsedBibs.length) return null;

    const bibs = collapsedBibs.map((bib, i) => this.getBib(bib, false, i));

    return (
      <div className="related-items">
        <h4>Related formats and editions</h4>
        <ul>
          {bibs}
        </ul>
      </div>
    );
  }

  getBibTitle(bib) {
    if (!bib.titleDisplay) {
      const author = bib.creatorLiteral && bib.creatorLiteral.length ?
        ` / ${bib.creatorLiteral[0]}` : '';
      return bib.title && bib.title.length ? `${bib.title[0]}${author}` : '';
    }
    return bib.titleDisplay;
  }

  getYearDisplay(bib) {
    let dateStartYear = bib.dateStartYear;
    let dateEndYear = bib.dateEndYear;

    dateStartYear = dateStartYear === 999 ? 'unknown' : dateStartYear;
    dateEndYear = dateEndYear === 9999 ? 'present' : dateEndYear;

    if (dateStartYear && dateEndYear) {
      return (<span className="nypl-results-date">{dateStartYear}-{dateEndYear}</span>);
    } else if (dateStartYear) {
      return (<span className="nypl-results-date">{dateStartYear}</span>);
    }
    return null;
  }

  getBib(bib, author, i) {
    if (!bib.result || _isEmpty(bib.result) || !bib.result.title) return null;

    const result = bib.result;
    const bibTitle = this.getBibTitle(result);
    const bibId = result && result['@id'] ? result['@id'].substring(4) : '';
    const materialType = result && result.materialType && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = this.getYearDisplay(result);
    const publisher = result.publisher && result.publisher.length ? result.publisher[0] : '';
    const placeOfPublication = result.placeOfPublication && result.placeOfPublication.length ?
      result.placeOfPublication[0] : '';
    const items = LibraryItem.getItems(result);
    const totalItems = items.length;

    return (
      <li key={i} className="nypl-results-item">
        <h2>
          <Link
            onClick={(e) => this.getBibRecord(e, bibId)}
            to={`${appConfig.baseUrl}/bib/${bibId}`}
            className="title"
          >
            {bibTitle}
          </Link>
        </h2>
        <div className="nypl-results-item-description">
          <p>
            <span className="nypl-results-media">{materialType}</span>
            <span className="nypl-results-place">{placeOfPublication}</span>
            <span className="nypl-results-publisher">{publisher}</span>
            {yearPublished}
            <span className="nypl-results-info">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
          </p>
        </div>
        {
          (items.length === 1) &&
            <ItemTable
              items={items}
              bibId={bibId}
              getRecord={this.getItemRecord}
              id="search-result-item-table"
            />
        }
      </li>
    );
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results && results.length) {
      resultsElm = results.map((bib, i) => this.getBib(bib, true, i));
    }

    return (
      <ul
        id="nypl-results-list"
        className={`nypl-results-list ${this.props.spinning ? 'hide-results-list ' : ''}`}
      >
        {resultsElm}
      </ul>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
  spinning: PropTypes.bool,
};

ResultsList.contextTypes = {
  router: PropTypes.object,
};

export default ResultsList;
