import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import axios from 'axios';
import { isArray as _isArray } from 'underscore';

import Actions from '../../actions/Actions';
import ItemPagination from './ItemPagination';
import ItemTable from './ItemTable'

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chunkedHoldings: [],
      showAll: false,
      js: false,
      page: 1,
    };

    this.getRecord = this.getRecord.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.chunk = this.chunk.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    const holdings = this.props.holdings;
    let chunkedHoldings = [];

    if (holdings && holdings.length >= 20) {
      chunkedHoldings = this.chunk(holdings, 20);
    }

    this.setState({
      js: true,
      chunkedHoldings,
    });
  }

  /*
   * getRecord(e, bibId, itemId)
   * @description Get updated information for a bib, not exactly necessary but useful,
   * and route to the correct page.
   * @param {object} e Event object.
   * @param {string} bibId The bib's id.
   * @param {string} itemId The item's id.
   */
  getRecord(e, bibId, itemId) {
    e.preventDefault();

    // Search for the bib? Just pass the data.
    axios
      .get(`/api/bib?bibId=${bibId}`)
      .then(response => {
        Actions.updateBib(response.data);
        this.context.router.push(`/hold/request/${bibId}-${itemId}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  /*
   * getTable(holdings, shortenItems, showAll)
   * @description Display an HTML table with item data.
   * @param {array} holdings The array of items.
   * @param {bool} shortenItems Whether the array needs to be cut off or not.
   * @param {bool} showAll Whether all items should be shown on the client side.
   */
  getTable(holdings, shortenItems = false, showAll) {
    // If there are more than 20 items and we need to shorten it to 20 AND we are not
    // showing all items.
    const itemsToDisplay = shortenItems && !showAll ? holdings.slice(0, 20) : holdings;
    const bibId = this.props.bibId;

    return (
      (itemsToDisplay && _isArray(itemsToDisplay) && itemsToDisplay.length > 0) ?
        <ItemTable items={itemsToDisplay} bibId={bibId} getRecord={this.getRecord} /> : null
    );
  }

  /*
   * updatePage(page)
   * @description Update the client-side state of the component's page value.
   * @param {number} page The next number/index of what items should be displayed.
   */
  updatePage(page) {
    this.setState({ page });
  }

  /*
   * chunk(arr, n)
   * @description Break up all the items in the array into array of size n arrays.
   * @param {array} arr The array of items.
   * @param {n} number The number we want to break the array into.
   */
  chunk(arr, n) {
    if (_isArray(arr) && !arr.length) {
      return [];
    }
    return [arr.slice(0, n)].concat(this.chunk(arr.slice(n), n));
  }

  /*
   * showAll()
   * @description Display all items on the page.
   */
  showAll() {
    this.setState({ showAll: true });
  }

  render() {
    let holdings = this.props.holdings;
    const shortenItems = !this.props.shortenItems;
    let itemPagination = null;

    if (this.state.js && holdings && holdings.length >= 20 && !this.state.showAll) {
      itemPagination = (
        <ItemPagination
          total={holdings.length}
          page={this.state.page}
          updatePage={this.updatePage}
        />
      );

      holdings = this.state.chunkedHoldings[this.state.page + 1];
    }

    const itemTable = this.getTable(holdings, shortenItems, this.state.showAll);

    return (
      <div id="item-holdings" className="item-holdings">
        <h2>{this.props.title}</h2>
        {itemTable}
        {
          !!(shortenItems && holdings.length >= 20 && !this.state.showAll) &&
            (<div className="view-all-items-container">
              {
                this.state.js ?
                  (<a href="#" onClick={this.showAll}>View All Items</a>) :
                  (<Link
                    to={`/bib/${this.props.bibId}/all`}
                    className="view-all-items"
                  >
                    View All Items
                  </Link>)
              }
            </div>)
        }
        {itemPagination}
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
