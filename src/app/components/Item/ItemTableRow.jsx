import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from '@nypl/design-system-react-components';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
} from '../../utils/utils';

import appConfig from '../../data/appConfig';

class ItemTableRow extends React.Component {
  constructor(props) {
    super(props);
  }

  message() {
    const { item } = this.props;

    return item.accessMessage.prefLabel || ' ';
  }

  render() {
    const {
      item,
      bibId,
      searchKeywords,
      includeVolColumn,
      page,
    } = this.props;

    const {
      routes,
    } = this.context.router;

    const requestButtonsPage = routes[routes.length - 1].component.name;

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
        { includeVolColumn ? (
          <td className="vol-date-col" data-th="Vol/Date">
          <span>{item.volume || ''}</span>
          </td>
        ) : null}
        <td data-th="Format">
          <span>{item.format || ' '}</span>
        </td>
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
