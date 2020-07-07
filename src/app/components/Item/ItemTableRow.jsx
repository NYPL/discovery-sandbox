import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
  ajaxCall,
} from '../../utils/utils';
import Actions from '@Actions';

import appConfig from '../../data/appConfig';
import AppConfigStore from '../../stores/AppConfigStore';


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

    Actions.updateLoadingStatus(true);

    trackDiscovery('Item Request', gaLabel);
    ajaxCall(`${appConfig.baseUrl}/api/hold/request/${bibId}-${item.id}`,
      (response) => {
        Actions.updateBib(response.data.bib);
        Actions.updateDeliveryLocations(response.data.deliveryLocations);
        Actions.updateIsEddRequestable(response.data.isEddRequestable);
        setTimeout(() => {
          Actions.updateLoadingStatus(false);
          this.context.router.push(`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}`);
        }, 500);
      },
      (error) => {
        setTimeout(() => {
          Actions.updateLoadingStatus(false);
        }, 500);

        // eslint-disable-next-line no-console
        console.error(
          `Error attemping to make an ajax request to fetch an item on ${page}`,
          error,
        );
      },
    );
  }

  message() {
    const { item } = this.props;
    if (item.holdingLocationCode && item.nonRecapNYPL) {
      let holdingLocationEmail;
      const { libAnswersEmails } = AppConfigStore.getState();
      switch (item.holdingLocationCode.substring(4, 6)) {
        case 'ma':
          holdingLocationEmail = libAnswersEmails.sasb;
          break;
        case 'my':
          holdingLocationEmail = libAnswersEmails.lpa;
          break;
        case 'sc':
          holdingLocationEmail = libAnswersEmails.sc;
          break;
        default:
          holdingLocationEmail = null;
      }
      if (holdingLocationEmail) {
        const emailText = `Inquiry about item ${item.id} ${item.callNumber}`;
        return (
          <a
            href={`mailto:${holdingLocationEmail}?subject=${emailText}&body=${emailText}`}
            target="_blank"
          >
            Email for access options
          </a>
        );
      }
    }
    return item.accessMessage.prefLabel;
  }

  render() {
    const {
      item,
      bibId,
      searchKeywords,
    } = this.props;

    if (_isEmpty(item)) {
      return null;
    }

    if (item.isElectronicResource) {
      return null;
    }

    const status = item.status && item.status.prefLabel ? item.status.prefLabel : ' ';
    let itemRequestBtn = <span>{status}</span>;
    let itemCallNumber = ' ';

    const { closedLocations } = AppConfigStore.getState();

    if (item.requestable && !closedLocations.includes('')) {
      if (item.isRecap) {
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
      } else if (item.nonRecapNYPL) {
        // Not in ReCAP
        itemRequestBtn = <span>{status}</span>;
      }
    }

    if (item.callNumber) {
      itemCallNumber = item.callNumber;
    }

    return (
      <tr className={item.availability}>
        <td>{item.location || ' '}</td>
        <td>{itemCallNumber}</td>
        <td>{itemRequestBtn}</td>
        <td>{this.message()}</td>
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
