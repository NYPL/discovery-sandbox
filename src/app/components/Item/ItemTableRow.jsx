import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty } from 'underscore';

import appConfig from '../../data/appConfig';
import StatusLinks from './StatusLinks';

class ItemTableRow extends React.Component {
  constructor (props) {
    super(props);
    this.message = this.message.bind(this)
  }

  message () {
    const { item } = this.props;

    return item.accessMessage.prefLabel || ' ';
  }



  render () {
    const {
      item,
      includeVolColumn,
      bibId,
      searchKeywords,
      page,
      isBibPage
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
      <tr className={item.availability}>
        {isBibPage ? (
          <td><StatusLinks
            item={item}
            bibId={bibId}
            searchKeywords={searchKeywords}
            appConfig={appConfig}
            page={page}
          /></td>
        ) : null}
        {includeVolColumn ? (
          <td className="vol-date-col" data-th="Vol/Date">
            <span>{item.volume || ''}</span>
          </td>
        ) : null}
        <td data-th="Format">
          <span>{item.format || ' '}</span>
        </td>
        {isBibPage ? <td data-th="Access">{this.message()}</td> : null}
        <td data-th="Call Number"><span>{itemCallNumber}</span></td>
        <td data-th="Location"><span>{itemLocation}</span></td>
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
