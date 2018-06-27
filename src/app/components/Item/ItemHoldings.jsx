import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import axios from 'axios';
import { isArray as _isArray } from 'underscore';

import Actions from '../../actions/Actions';
import Pagination from '../Pagination/Pagination';
import ItemTable from './ItemTable';
import appConfig from '../../../../appConfig';
import { trackDiscovery } from '../../utils/utils';

class ItemHoldings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chunkedItems: [],
      showAll: false,
      js: false,
      page: parseInt(this.props.itemPage.substring(10), 10) || 1,
    };

    this.getRecord = this.getRecord.bind(this);
    this.updatePage = this.updatePage.bind(this);
    this.chunk = this.chunk.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    // Mostly things we want to do on the client-side only:
    const items = this.props.items;
    let chunkedItems = [];
    let noItemPage = false;

    if (items && items.length >= 20) {
      chunkedItems = this.chunk(items, 20);
    }

    // If the `itemPage` URL query is more than the number of pages, then
    // go back to page 1 in the state and remove the query from the URL.
    if (this.state.page > chunkedItems.length) {
      noItemPage = true;
    }

    this.setState({
      js: true,
      chunkedItems,
      page: noItemPage ? 1 : this.state.page,
    });

    if (noItemPage) {
      this.context.router.push(`${appConfig.baseUrl}/bib/${this.props.bibId}`);
    }
  }

  /*
   * getRecord(e, bibId, itemId)
   * @description Get updated information for an item along with its delivery locations,
   * and the route to the correct page.
   * @param {object} e Event object.
   * @param {string} bibId The bib's id.
   * @param {string} itemId The item's id.
   */
  getRecord(e, bibId, itemId) {
    e.preventDefault();
    this.props.updateIsLoadingState(true);

    trackDiscovery('Bib Item Request', `Item Details - ${itemId}`);
    // Search for the bib? Just pass the data.
    axios
      .get(`${appConfig.baseUrl}/api/hold/request/${bibId}-${itemId}`)
      .then((response) => {
        Actions.updateBib(response.data.bib);
        Actions.updateDeliveryLocations(response.data.deliveryLocations);
        Actions.updateIsEddRequestable(response.data.isEddRequestable);
        setTimeout(() => {
          this.props.updateIsLoadingState(false);
          this.context.router.push(`${appConfig.baseUrl}/hold/request/${bibId}-${itemId}`);
        }, 500);
      })
      .catch((error) => {
        console.error('Error attemping to make an ajax Bib request in ItemHoldings', error);

        setTimeout(() => {
          this.props.updateIsLoadingState(false);
        }, 500);
      });
  }

  /*
   * getTable(items, shortenItems, showAll)
   * @description Display an HTML table with item data.
   * @param {array} items The array of items.
   * @param {bool} shortenItems Whether the array needs to be cut off or not.
   * @param {bool} showAll Whether all items should be shown on the client side.
   */
  getTable(items, shortenItems = false, showAll) {
    // If there are more than 20 items and we need to shorten it to 20 AND we are not
    // showing all items.
    const itemsToDisplay = items && shortenItems && !showAll ? items.slice(0, 20) : items;
    const bibId = this.props.bibId;

    return (
      (itemsToDisplay && _isArray(itemsToDisplay) && itemsToDisplay.length) ?
        <ItemTable
          items={itemsToDisplay}
          bibId={bibId}
          getRecord={this.getRecord}
          id="bib-item-table"
          searchKeywords={this.props.searchKeywords}
        /> : null
    );
  }

  /*
   * updatePage(page)
   * @description Update the client-side state of the component's page value.
   * @param {number} page The next number/index of what items should be displayed.
   * @param {string} type Either Next or Previous.
   */
  updatePage(page, type) {
    this.setState({ page });
    trackDiscovery('Pagination', `${type} - page ${page}`);
    this.context.router.push(`${appConfig.baseUrl}/bib/${this.props.bibId}?itemPage=${page}`);
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
    trackDiscovery('View All Items', `Click - ${this.props.bibId}`);
    this.setState({ showAll: true });
  }

  render() {
    const bibId = this.props.bibId;
    let items = this.props.items;
    const shortenItems = !this.props.shortenItems;
    let pagination = null;

    if (this.state.js && items && items.length >= 20 && !this.state.showAll) {
      pagination = (
        <Pagination
          total={items.length}
          perPage={20}
          page={this.state.page}
          updatePage={this.updatePage}
          to={{ pathname: `${appConfig.baseUrl}/bib/${bibId}?itemPage=` }}
          ariaControls="bib-item-table"
        />
      );

      items = this.state.chunkedItems[this.state.page - 1];
    }

    const itemTable = this.getTable(items, shortenItems, this.state.showAll);

    if (!items || !items.length) {
      return null;
    }

    return (
      <div className="nypl-results-item">
        <h2>Availability</h2>
        {itemTable}
        {
          !!(shortenItems && items.length >= 20 && !this.state.showAll) &&
            (<div className="view-all-items-container">
              {
                this.state.js ?
                  (<a href="#" onClick={this.showAll}>View All Items</a>) :
                  (<Link
                    to={`${appConfig.baseUrl}/bib/${bibId}/all`}
                    className="view-all-items"
                    onClick={() => trackDiscovery('View All Items', `Click - ${bibId}`)}
                  >
                    View All Items
                  </Link>)
              }
            </div>)
        }
        {pagination}
      </div>
    );
  }
}

ItemHoldings.propTypes = {
  items: PropTypes.array,
  itemPage: PropTypes.string,
  bibId: PropTypes.string,
  shortenItems: PropTypes.bool,
  searchKeywords: PropTypes.string,
  updateIsLoadingState: PropTypes.func,
};

ItemHoldings.defaultProps = {
  shortenItems: false,
  searchKeywords: '',
  itemPage: '0',
};

ItemHoldings.contextTypes = {
  router: PropTypes.object,
};

export default ItemHoldings;
