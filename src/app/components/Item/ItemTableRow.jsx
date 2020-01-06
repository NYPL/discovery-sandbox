import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

import appConfig from '../../data/appConfig';

const ItemTableRow = ({ item, bibId, getRecord, searchKeywords }) => {
  if (_isEmpty(item)) {
    return null;
  }

  if (item.isElectronicResource) {
    return null;
  }

  const status = item.status && item.status.prefLabel ? item.status.prefLabel : ' ';
  let itemRequestBtn = <span>{status}</span>;
  let itemCallNumber = ' ';

  if (item.requestable) {
    if (item.isRecap) {
      itemRequestBtn = item.available ?
        (<Link
          to={
            `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}?searchKeywords=${searchKeywords}`
          }
          onClick={e => getRecord(e, bibId, item.id)}
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
      <td>{item.accessMessage.prefLabel || ' '}</td>
    </tr>
  );
};

ItemTableRow.propTypes = {
  item: PropTypes.object,
  bibId: PropTypes.string,
  searchKeywords: PropTypes.string,
  getRecord: PropTypes.func,
};

export default ItemTableRow;
