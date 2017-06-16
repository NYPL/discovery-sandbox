import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions';
import ItemPagination from './ItemPagination';

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      js: false,
    };

    this.getRecord = this.getRecord.bind(this);
  }

  componentDidMount() {
    this.setState({ js: true });
  }

  getRecord(e, id) {
    e.preventDefault();

    // Search for the bib? Just pass the data.
    axios
      .get(`/api/retrieve?q=${this.props.bibId}`)
      .then(response => {
        Actions.updateBib(response.data);
        this.context.router.push(`/hold/request/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  getTable(holdings) {
    const shortenItems = !this.props.shortenItems;
    const itemsToDisplay = shortenItems ? holdings.slice(0, 20) : holdings;
    let itemPagination = null;

    if (this.state.js && shortenItems && holdings.length >= 20) {
      console.log('paginate away')
      itemPagination = <ItemPagination hits={holdings.length} page='1' />;
    }

    return (
      <table className="nypl-basic-table">
        <caption className="hidden">Item details</caption>
        <tbody>
          {
            itemsToDisplay.map((h, i) => {
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
                  <span dangerouslySetInnerHTML={this.createMarkup(h.callNumber)}></span>;
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
          {
            shortenItems && holdings.length >= 20 &&
              (<tr>
                <td colSpan="5">
                  <Link
                    to={`/bib/${this.props.bibId}/all`}
                    className="view-all-items"
                  >
                    View All Items
                  </Link>
                </td>
              </tr>)
          }
          {itemPagination}
        </tbody>
      </table>
    );
  }

  createMarkup(html) {
    return {
      __html: html,
    };
  }

  render() {
    const holdings = this.props.holdings;
    const body = this.getTable(holdings);

    return (
      <div id="item-holdings" className="nypl-item-holdings">
        <h2>{this.props.title}</h2>
        {body}
      </div>
    );
  }
}

ItemHoldings.propTypes = {
  holdings: PropTypes.array,
  title: PropTypes.string,
  bibId: PropTypes.string,
  shortenItems: PropTypes.bool,
};

ItemHoldings.defaultProps = {
  shortenItems: false,
};

ItemHoldings.contextTypes = {
  router: PropTypes.object,
};

export default ItemHoldings;
