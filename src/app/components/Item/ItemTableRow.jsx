import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty as _isEmpty } from 'underscore';
import { trackDiscovery } from '../../utils/utils';
import { AeonButton, EddButton, PhysButton } from '../Buttons/ItemTableButtons';

class ItemTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.getItemRecord = this.getItemRecord.bind(this);
    this.track = this.track.bind(this);
  }

  track() {
    const { routes } = this.context.router;

    const page = routes[routes.length - 1].component.name;
    let gaLabel = 'Item Holding';
    if (page === 'SearchResults') gaLabel = 'Search Results';
    if (page === 'BibPage') gaLabel = 'Item Details';
    if (page === 'SubjectHeadingShowPage') gaLabel = 'Subject Heading Details';

    trackDiscovery('Item Request', gaLabel);
  }

  getItemRecord(path) {
    const { searchKeywords } = this.props;

    this.track();
    // Allow the button link handler to deal with routing
    // this.context.router.push(
    //   `${path}${
    //     (!!searchKeywords && `?searchKeywords=${searchKeywords}`) || ''
    //   }`,
    // );
  }

  message() {
    const { item } = this.props;

    return item.accessMessage.prefLabel || ' ';
  }

  requestButton() {
    const { item, bibId, page } = this.props;

    // TODO Are we using this?
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
        {(item.requestable && (
          <>
            <AeonButton item={item} onClick={this.getItemRecord} />
            <EddButton item={item} bibId={bibId} onClick={this.getItemRecord} />
            <PhysButton
              item={item}
              bibId={bibId}
              onClick={this.getItemRecord}
            />
          </>
        )) || <div>{item.status.prefLabel ?? 'Not Available'}</div>}
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
  item: PropTypes.object.isRequired,
  bibId: PropTypes.string.isRequired,
  page: PropTypes.string,
  searchKeywords: PropTypes.string,
  includeVolColumn: PropTypes.bool,
};

ItemTableRow.contextTypes = {
  router: PropTypes.object,
};

export default ItemTableRow;
