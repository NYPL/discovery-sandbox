import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty as _isEmpty } from 'underscore';
import appConfig from '../../data/appConfig';
import { trackDiscovery } from '../../utils/utils';
import {
  AeonButton,
  EddButton,
  ReCAPButton,
} from '../Buttons/ItemTableButtons';

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

  requestButton() {
    const { item, bibId, searchKeywords, page } = this.props;

    // Currently Not Used
    // TODO Determine if we need these.
    // const isAvailable = item.available;
    // const isRecap = item.isRecap;
    // const isRequestable = (item.requestable = true);
    // const isOffSite = item.isOffsite;
    // const allClosed = appConfig.closedLocations
    //   .concat(
    //     item.isRecap
    //       ? appConfig.recapClosedLocations
    //       : appConfig.nonRecapClosedLocations,
    //   )
    //   .includes('');

    return (
      <div
        className={`request-btn-block ${
          page === 'SearchResults' ? 'pan-left' : ''
        }`}
      >
        {(item.specRequestable && (
          <AeonButton item={item} onClick={this.getItemRecord} />
        )) || (
          <>
            <EddButton
              display={item.eddRequestable}
              link={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}/edd?searchKeywords=${searchKeywords}`}
              onClick={this.getItemRecord}
            />

            <ReCAPButton
              display={item.physRequestable}
              item={item}
              link={`${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`}
              onClick={this.getItemRecord}
            />
          </>
        )}
      </div>
    );
  }

  render() {
    const { item, includeVolColumn, page } = this.props;
    const BibPage = page === 'BibPage';

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
      <>
        <tr className={item.availability}>
          {includeVolColumn ? (
            <td className='vol-date-col' data-th='Vol/Date'>
              <span>{item.volume || ''}</span>
            </td>
          ) : null}
          <td data-th='Format'>
            <span>{item.format || ' '}</span>
          </td>
          <td data-th='Call Number'>
            <span>{itemCallNumber}</span>
          </td>
          <td data-th='Location'>
            <span>{itemLocation}</span>
          </td>
          {BibPage ? (
            <td data-th={`Availability & Access`}>{this.requestButton()}</td>
          ) : null}
        </tr>
        {!BibPage ? (
          <tr>
            <td colSpan='3' data-th={`Availability & Access`}>
              <span>{this.requestButton()}</span>
            </td>
          </tr>
        ) : null}
      </>
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
