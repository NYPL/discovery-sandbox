import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import {
  isEmpty as _isEmpty,
  isArray as _isArray,
} from 'underscore';

import Actions from '../../actions/Actions';
import Store from '@Store'
import LibraryItem from '../../utils/item';
import {
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import ItemTable from '../Item/ItemTable';
import appConfig from '../../data/appConfig';

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
   * @param {string} bibTitle The bib's title.
   */
  getBibRecord(e, bibId, bibTitle) {
    e.preventDefault();
    //
    // Actions.updateLoadingStatus(true);
    //
    // trackDiscovery('Bib', bibTitle);
    // ajaxCall(`${appConfig.baseUrl}/api/bib?bibId=${bibId}`,
    //   (response) => {
    //     Actions.updateBib(response.data);
    //     setTimeout(() => {
    //       Actions.updateLoadingStatus(false);
    //       this.routeHandler(`${appConfig.baseUrl}/bib/${bibId}`);
    //     }, 500);
    //   },
    //   (error) => {
    //     setTimeout(() => {
    //       Actions.updateLoadingStatus(false);
    //     }, 500);
    //
    //     console.error(
    //       'Error attempting to make an ajax request to fetch a bib record from ResultsList',
    //       error,
    //     );
    //   },
    // );
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

    Actions.updateLoadingStatus(true);

    trackDiscovery('Item Request', 'Search Results');
    ajaxCall(`${appConfig.baseUrl}/api/hold/request/${bibId}-${itemId}`,
      (response) => {
        Actions.updateBib(response.data.bib);
        Actions.updateDeliveryLocations(response.data.deliveryLocations);
        Actions.updateIsEddRequestable(response.data.isEddRequestable);
        setTimeout(() => {
          Actions.updateLoadingStatus(false);
          this.routeHandler(`${appConfig.baseUrl}/hold/request/${bibId}-${itemId}`);
        }, 500);
      },
      (error) => {
        setTimeout(() => {
          Actions.updateLoadingStatus(false);
        }, 500);

        console.error(
          'Error attemping to make an ajax request to fetch an item in ResultsList',
          error,
        );
      },
    );
  }

  getBibTitle(bib) {
    if (!bib.titleDisplay || !bib.titleDisplay.length) {
      const author = bib.creatorLiteral && bib.creatorLiteral.length ?
        ` / ${bib.creatorLiteral[0]}` : '';
      return bib.title && bib.title.length ? `${bib.title[0]}${author}` : '';
    }
    return bib.titleDisplay[0];
  }

  getYearDisplay(bib) {
    if (_isEmpty(bib)) return null;

    let dateStartYear = bib.dateStartYear;
    let dateEndYear = bib.dateEndYear;

    dateStartYear = dateStartYear === 999 ? 'unknown' : dateStartYear;
    dateEndYear = dateEndYear === 9999 ? 'present' : dateEndYear;

    if (dateStartYear && dateEndYear) {
      return (<li className="nypl-results-date">{dateStartYear}-{dateEndYear}</li>);
    } else if (dateStartYear) {
      return (<li className="nypl-results-date">{dateStartYear}</li>);
    }
    return null;
  }

  generateBibLi(bib, i) {
    if (_isEmpty(bib) || bib.result && (_isEmpty(bib.result) || !bib.result.title)) {
      return null
    };

    const result = bib.result || bib;
    const bibTitle = this.getBibTitle(result);
    const bibId = result && result['@id'] ? result['@id'].substring(4) : '';
    const materialType = result && result.materialType && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = this.getYearDisplay(result);
    const publicationStatement = result.publicationStatement && result.publicationStatement.length ?
      result.publicationStatement[0] : '';
    const items = LibraryItem.getItems(result);
    const totalItems = items.length;
    const hasRequestTable = items.length === 1;

    return (
      <li key={i} className={`nypl-results-item ${hasRequestTable ? 'has-request' : ''}`}>
        <h3>
          <Link
            to={`${appConfig.baseUrl}/bib/${bibId}?searchKeywords=${this.props.searchKeywords}`}
            className="title"
          >
            {bibTitle}
          </Link>
        </h3>
        <div className="nypl-results-item-description">
          <ul>
            <li className="nypl-results-media">{materialType}</li>
            <li className="nypl-results-publication">{publicationStatement}</li>
            {yearPublished}
            <li className="nypl-results-info">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </li>
          </ul>
        </div>
        {
          hasRequestTable &&
          <ItemTable
            items={items}
            bibId={bibId}
            getRecord={this.getItemRecord}
            id={null}
            searchKeywords={this.props.searchKeywords}
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

    if (!results || !_isArray(results) || !results.length) {
      return null;
    }

    resultsElm = results.map((bib, i) => this.generateBibLi(bib, i));

    return (
      <ul
        id="nypl-results-list"
        className={`nypl-results-list ${Store.state.isLoading ? 'hide-results-list ' : ''}`}
      >
        {resultsElm}
      </ul>
    );
  }
}

ResultsList.propTypes = {
  results: PropTypes.array,
  searchKeywords: PropTypes.string,
};

ResultsList.contextTypes = {
  router: PropTypes.object,
};

export default ResultsList;
