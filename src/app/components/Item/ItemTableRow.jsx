import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
} from '../../utils/utils';

import appConfig from '../../data/appConfig';

const { features } = appConfig;

class ItemTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.getItemRecord = this.getItemRecord.bind(this);
    this.allClosed = this.allClosed.bind(this);
    this.isAeon = this.isAeon.bind(this);
    this.physRequestButton = this.physRequestButton.bind(this);
    this.eddRequestButton = this.eddRequestButton.bind(this);
    this.aeonRequestButton = this.aeonRequestButton.bind(this);
    this.requestButton = this.requestButton.bind(this);
  }

  getItemRecord(e) {
    e.preventDefault();
    const {
      bibId,
      item,
    } = this.props;

    const {
      routes,
    } = this.context.router;

    const page = routes[routes.length - 1].component.name;
    let gaLabel = 'Item Holding';
    if (page === 'SearchResults') gaLabel = 'Search Results';
    if (page === 'BibPage') gaLabel = 'Item Details';
    if (page === 'SubjectHeadingShowPage') gaLabel = 'Subject Heading Details';

    trackDiscovery('Item Request', gaLabel);
    this.context.router.push(`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}`);
  }

  message() {
    const { item } = this.props;

    return item.accessMessage.prefLabel || ' ';
  }

  aeonUrl(item) {
    const itemUrl = Array.isArray(item.aeonUrl)
      ? item.aeonUrl[0]
      : item.aeonUrl;

    const AeonUrl = new URL(itemUrl);

    const paramDict = {
      ItemISxN: 'id',
      itemNumber: 'barcode',
      CallNumber: 'callNumber',
    };

    // Add/Replace query parameters on AeonURL with item key values
    Object.entries(paramDict).forEach(([param, key]) => {
      // If item doesn't have a value use searchParams value
      const value = item[key] ?? AeonUrl.searchParams.get(param);
      if (value) AeonUrl.searchParams.set(param, value);
    });

    return AeonUrl.toString();
  }

  // requestButton() {
  //   const {
  //     item,
  //     bibId,
  //     searchKeywords,
  //   } = this.props;
  //   const { closedLocations, recapClosedLocations, nonRecapClosedLocations } = appConfig;
  //   const isRecap = item.isRecap;
  //   const allClosed = closedLocations.concat((isRecap ? recapClosedLocations : nonRecapClosedLocations)).includes('');
  //   const status = item.status && item.status.prefLabel ? item.status.prefLabel : ' ';
  //   let itemRequestBtn = status;
  //
  //   if (item.aeonUrl && features.includes('aeon-links')) {
  //     itemRequestBtn = (
  //       <React.Fragment>
  //         <a
  //           href={this.aeonUrl(item)}
  //           tabIndex="0"
  //           className="aeonRequestButton"
  //         >
  //           Request
  //         </a>
  //         <br />
  //         <span
  //           className="aeonRequestText"
  //         >
  //           Appointment Required
  //         </span>
  //       </React.Fragment>
  //     );
  //     return itemRequestBtn;
  //   }
  //
  //   if (item.requestable && !allClosed) {
  //     itemRequestBtn = item.available ? (
  //       <Link
  //         to={
  //           `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`
  //         }
  //         onClick={e => this.getItemRecord(e, bibId, item.id)}
  //         tabIndex="0"
  //       >
  //         Request
  //       </Link>) :
  //       'In Use';
  //   }
  //   return itemRequestBtn;
  // }

  requestButton(inner) {
    const { item } = this.props;
    return inner && (
      <td data-th="Status">
        <span>{inner}</span>
      </td>
    )
  }

  allClosed() {
    if (this.allClosedValue) return this.allClosedValue;
    const { item } = this.props;
    const { closedLocations, recapClosedLocations, nonRecapClosedLocations } = appConfig;
    const isRecap = item.isRecap;
    this.allClosedValue = closedLocations.concat((isRecap ? recapClosedLocations : nonRecapClosedLocations)).includes('');
    return this.allClosedValue;
  }

  isAeon() {
    if (this.isAeonValue) return this.isAeonValue;
    const { item } = this.props;
    this.isAeonValue = item.aeonUrl && features.includes('aeon-links')
    return this.isAeonValue;
  }

  physRequestButton() {
    const { item, bibId, searchKeywords } = this.props;
    if (this.isAeon() || this.allClosed() || !item.physRequestable) {
      return null;
    }
    return this.requestButton(
      <Link
        to={
          `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`
        }
        onClick={e => this.getItemRecord(e, bibId, item.id)}
        tabIndex="0"
        className={ item.available ? 'avail-request-button' : 'unavail-request-button' }
      >
        Request for Onsite Use
      </Link>
    )
  }

  eddRequestButton() {
    const { item, bibId, searchKeywords } = this.props;
    if (this.isAeon() || this.allClosed() || !item.eddRequestable) {
      return null;
    }
    return this.requestButton(
      <Link
        to={
          `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}/edd?searchKeywords=${searchKeywords}`
        }
        onClick={e => this.getItemRecord(e, bibId, item.id)}
        tabIndex="0"
        className={ item.available ? 'avail-request-button' : 'unavail-request-button' }
      >
        Request Scan
      </Link>
    )
  }

  aeonRequestButton() {
    if (!this.isAeon()) { return null }
    const { item } = this.props;
    return this.requestButton(
      <a
        href={this.aeonUrl(item)}
        tabIndex="0"
        className={`aeonRequestButton ${item.available ? 'avail-request-button' : 'unavail-request-button'}`}
      >
        Request Appointment
      </a>
    );
  }

  render() {
    const {
      item,
      includeVolColumn,
      page,
    } = this.props;

    if (_isEmpty(item)) {
      return null;
    }

    if (item.isElectronicResource) {
      return null;
    }

    let itemCallNumber = ' ';
    if (item.callNumber) {
      itemCallNumber = item.callNumber;
    }

    let itemLocation;

    if (item.location && item.locationUrl) {
      itemLocation = (
        <a href={item.locationUrl} className="itemLocationLink">{item.location}</a>
      );
    } else if (item.location) {
      itemLocation = item.location;
    } else {
      itemLocation = ' ';
    }

    return (
      <>
        <tr className={item.availability}>
          { includeVolColumn ? (
            <td className="vol-date-col" data-th="Vol/Date">
            <span>{item.volume || ''}</span>
            </td>
          ) : null}
          {page !== 'SearchResults' ? (
            <td data-th="Format">
            <span>{item.format || ' '}</span>
            </td>
          ) : null}
          <td data-th="Message"><span>{this.message()}</span></td>
          <td data-th="Call Number"><span>{itemCallNumber}</span></td>
          <td data-th="Location"><span>{itemLocation}</span></td>
        </tr>
        <tr>
          {this.physRequestButton()}
          {this.eddRequestButton()}
          {this.aeonRequestButton()}
        </tr>
      </>
    );
  }
}

ItemTableRow.propTypes = {
  item: PropTypes.object,
  bibId: PropTypes.string,
  searchKeywords: PropTypes.string,
};

ItemTableRow.contextTypes = {
  router: PropTypes.object,
};

export default ItemTableRow;
