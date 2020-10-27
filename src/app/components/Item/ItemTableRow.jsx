import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
} from '../../utils/utils';

import appConfig from '../../data/appConfig';

class ItemTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.getItemRecord = this.getItemRecord.bind(this);
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

  requestButton() {
    const {
      item,
      bibId,
      searchKeywords,
    } = this.props;
    const { closedLocations } = appConfig;
    const status = item.status && item.status.prefLabel ? item.status.prefLabel : ' ';
    let itemRequestBtn = <span>{status}</span>;

    if (item.requestable && !closedLocations.includes('')) {
      itemRequestBtn = item.available ? (
        <Link
          to={
            `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`
          }
          onClick={e => this.getItemRecord(e, bibId, item.id)}
          tabIndex="0"
        >
          Request
        </Link>) :
        <span>In Use</span>;
    }
    return itemRequestBtn;
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

    return (
      <tr className={item.availability}>
        {includeVolColumn ? (
          <td className='vol-date-col'>
            <span aria-hidden="true" className="mobile">Vol/Date</span>
            {item.volume || ''}
          </td>
        ) : null}
        {page !== 'SearchResults' ? (
          <td>
            <span className="mobile">Format</span>{item.format || ' '}
          </td>
        ) : null}
        <td>
          <span aria-hidden="true" className="mobile">Message</span>{this.message()}
        </td>
        <td>
          <span aria-hidden="true" className="mobile">Status</span>{this.requestButton()}
        </td>
        <td>
          <span aria-hidden="true" className="mobile">Call Number</span>{itemCallNumber}
        </td>
        <td>
          <span aria-hidden="true" className="mobile">Location</span>{item.location || ' '}
        </td>
      </tr>
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
