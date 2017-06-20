import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const createMarkup = (html) => {
  return {
    __html: html,
  };
};

const ItemTable = ({ items }) => {
  console.log('items', items);
  return (
    <table className="nypl-basic-table">
      <caption className="hidden">Item details</caption>
      <thead>
        <tr>
          <th>Location</th>
          <th>Call No.</th>
          <th>Status</th>
          <th>Message</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {
          items.map((h, i) => {
            let itemLink;
            let itemDisplay = null;

            if (h.requestHold) {
              itemLink = h.availability === 'available' ?
                <Link
                  className="button"
                  to={`/hold/request/${h.id}`}
                  onClick={(e) => this.getRecord(e, h.id)}
                >Request</Link> :
                <span className="nypl-item-unavailable">Unavailable</span>;
            }

            if (h.callNumber) {
              itemDisplay =
                <span dangerouslySetInnerHTML={createMarkup(h.callNumber)}></span>;
            } else if (h.isElectronicResource) {
              itemDisplay = <span>{h.location}</span>;
            }

            return (
              <tr key={i} className={h.availability}>
                <td>{h.location}</td>
                <td>{itemDisplay}</td>
                <td>{h.status}</td>
                <td>{h.accessMessage}</td>
                <td>{itemLink}</td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  );
};

ItemTable.propTypes = {
  items: PropTypes.array,
};

export default ItemTable;
