import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';
import appConfig from '../../data/appConfig';
import { isAeonLink, trackDiscovery } from '../../utils/utils';

const { features } = appConfig;

class ItemTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.getItemRecord = this.getItemRecord.bind(this);
  }

  getItemRecord(event) {
    event.preventDefault();
    const { bibId, item } = this.props;

    const { routes } = this.context.router;

    const page = routes[routes.length - 1].component.name;
    let gaLabel = 'Item Holding';
    if (page === 'SearchResults') gaLabel = 'Search Results';
    if (page === 'BibPage') gaLabel = 'Item Details';
    if (page === 'SubjectHeadingShowPage') gaLabel = 'Subject Heading Details';

    trackDiscovery('Item Request', gaLabel);
    this.context.router.push(
      `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}`,
    );
  }

  message() {
    const { item } = this.props;

    return item.accessMessage.prefLabel || ' ';
  }

  aeonUrl(item) {
    const url = Array.isArray(item.aeonUrl) ? item.aeonUrl[0] : item.aeonUrl;
    const searchParams = new URL(url).searchParams;
    const paramMappings = {
      ItemISxN: 'id',
      itemNumber: 'barcode',
      CallNumber: 'callNumber',
    };

    let params = Object.keys(paramMappings)
      .map((paramName) => {
        if (searchParams.has(paramName)) return null;
        const mappedParamName = paramMappings[paramName];
        if (!item[mappedParamName]) return null;
        return `&${paramName}=${item[mappedParamName]}`;
      })
      .filter(Boolean)
      .join('');

    if (params && !url.includes('?')) params = `?${params}`;

    return encodeURI(`${url}${params || ''}`);
  }

  requestButton() {
    const { item, bibId, searchKeywords } = this.props;

    const isRequestable = (item.requestable = true);
    const isAvailable = item.available;
    const isOffSite = item.isOffsite;
    const isSpecialCollection = isAeonLink(item.aeonUrl);
    const isRecap = item.isRecap;
    const isEddRequestable = item.eddRequestable;

    const allClosed = appConfig.closedLocations
      .concat(
        item.isRecap
          ? appConfig.recapClosedLocations
          : appConfig.nonRecapClosedLocations,
      )
      .includes('');

    return (
      <div id='request-btn-block'>
        <Link
          to={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`}
          onClick={(event) => this.getItemRecord(event, bibId, item.id)}
          tabIndex='0'
          className='nypl-request-btn'
          id='first'
        >
          Request Scan
        </Link>
        {(isRequestable && (
          <span>
            <Link
              to={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`}
              // to={this.aeonUrl(item)}
              onClick={(event) => this.getItemRecord(event, bibId, item.id)}
              tabIndex='-1'
              className='nypl-request-btn'
              id='second'
            >
              Request for Onsite Use
            </Link>
            <br />
            <span className='aeonRequestText'>Appointment Required</span>
          </span>
        )) ||
          null}
      </div>
    );

    // let itemRequestBtn =
    //   item.status && item.status.prefLabel ? item.status.prefLabel : ' ';

    // if (item.aeonUrl && features.includes('aeon-links')) {
    //   itemRequestBtn = (
    //     <React.Fragment>
    //       <a
    //         href={this.aeonUrl(item)}
    //         tabIndex='0'
    //         className='aeonRequestButton'
    //       >
    //         Request
    //       </a>
    //       <br />
    //       <span className='aeonRequestText'>Appointment Required</span>
    //     </React.Fragment>
    //   );
    //   return itemRequestBtn;
    // }

    // if (item.requestable && !allClosed) {
    //   itemRequestBtn =
    //     (item.available && (
    //       <Link
    //         to={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`}
    //         onClick={(event) => this.getItemRecord(event, bibId, item.id)}
    //         tabIndex='0'
    //       >
    //         Request
    //       </Link>
    //     )) ||
    //     'In Use';
    // }

    // return itemRequestBtn;
  }

  render() {
    const { item, includeVolColumn, page } = this.props;

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
        <a href={item.locationUrl} className='itemLocationLink'>
          {item.location}
        </a>
      );
    } else if (item.location) {
      itemLocation = item.location;
    } else {
      itemLocation = ' ';
    }

    return (
      <tr className={item.availability}>
        {includeVolColumn ? (
          <td className='vol-date-col' data-th='Vol/Date'>
            <span>{item.volume || ''}</span>
          </td>
        ) : null}
        {page !== 'SearchResults' ? (
          <td data-th='Format'>
            <span>{item.format || ' '}</span>
          </td>
        ) : null}
        <td data-th='Message'>
          <span>{this.message()}</span>
        </td>
        <td data-th='Status'>
          <span>{this.requestButton()}</span>
        </td>
        <td data-th='Call Number'>
          <span>{itemCallNumber}</span>
        </td>
        <td data-th='Location'>
          <span>{itemLocation}</span>
        </td>
      </tr>
    );
  }
}

ItemTableRow.propTypes = {
  item: PropTypes.object,
  bibId: PropTypes.string,
  searchKeywords: PropTypes.string,
  page: PropTypes.string,
  includeVolColumn: PropTypes.boolean,
};

ItemTableRow.contextTypes = {
  router: PropTypes.object,
};

export default ItemTableRow;
