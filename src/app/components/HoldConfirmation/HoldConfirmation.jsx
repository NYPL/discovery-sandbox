import React from 'react';
import PropTypes from 'prop-types';
import PatronStore from '../../stores/PatronStore.js';
import config from '../../../../appConfig.js';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
} from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import LibraryItem from '../../utils/item.js';

class HoldConfirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patron: PatronStore.getState(),
    };
  }

  componentDidMount() {
    this.requireUser();
  }

  /**
   * requireUser()
   * Redirects the patron to OAuth log in page if he/she hasn't been logged in yet.
   *
   * @return {Boolean}
   */
  requireUser() {
    if (this.state.patron && this.state.patron.id) {
      return true;
    }

    const fullUrl = encodeURIComponent(window.location.href);

    window.location.replace(`${config.loginUrl}?redirect_uri=${fullUrl}`);

    return false;
  }

  /**
   * renderLocationInfo()
   * Renders the location information.
   *
   * @param {Object} loc
   * @return {HTML Element}
   */
  renderLocationInfo(loc) {
    if (!loc || _isEmpty(loc)) { return null; }

    const address = (loc.address) ? loc.address.address : null;
    const prefLabel = (loc.prefLabel) ? loc.prefLabel : null;

    return (
      <span>
        {prefLabel}
      </span>
    );
  }

  render() {
    // Need to better clarify variable names later.
    const bib = this.props.bib;
    const title = (bib && _isArray(bib.title) && bib.title.length > 0) ?
      bib.title[0] : '';
    const id = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    const itemId = (this.props.params && this.props.params.itemId) ? this.props.params.itemId : '';
    const selectedItem = LibraryItem.getItem(bib, itemId);
    const deliveryLocation = (this.props.deliveryLocations && this.props.deliveryLocations.length) ?
      _findWhere(
        this.props.deliveryLocations, { '@id': `loc:${this.props.location.query.pickupLocation}` }
      ) : '';
    const shelfMarkInfo =
      (selectedItem && _isArray(selectedItem.shelfMark) && selectedItem.shelfMark.length > 0) ?
        <li>Call number: {selectedItem.shelfMark[0]}</li> : null;

    return (
      <div id="mainContent">
        <div className="page-header">
          <div className="content-wrapper">
            <Breadcrumbs
              query={this.props.searchKeywords}
              type="holdConfirmation"
              title={title}
              url={id}
            />
          </div>
        </div>

        <div className="content-wrapper">
          <div className="item-header">
            <h1>Request Confirmation</h1>
            <h2>Submission Received</h2>
          </div>

          <div className="item-summary row">
            <div className="details two-third">
              <h2>Item Information</h2>
                <p>We've received your request for <Link to={`/bib/${id}`}>{title}</Link></p>
                <p>Please check your library account for updates. The item will be listed as Ready under your Holds tab when it is available. You will also reciev an email confirmation after your item has arrived.</p>
                <p>Your item will be delivered to: {this.renderLocationInfo(deliveryLocation)}</p>
                <p>For off-site materials, requests made before 2:30 PM will be delivered the following busniness day. Requests made after 2:30 PM on Fridays or over the weekends will be delivered the following Tuesday. We will hold books for up to seven days, so you can request materials up to a week in advance.</p>

                <h2>Electronic Delivery</h2>
                <p>If you selected Electronic delivery, you will be notified via email when the item is available.</p>
                <p>If you would like to cancel your request, or if you have further questions, please contact 917-ASK-NYPL (917-275-6975).</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

HoldConfirmation.propTypes = {
  bib: PropTypes.object,
  location: PropTypes.object,
  searchKeywords: PropTypes.string,
  params: PropTypes.object,
  deliveryLocations: PropTypes.array,
};

HoldConfirmation.defaultProps = {
  bib: {},
  location: {},
  searchKeywords: '',
  params: {},
  deliveryLocations: [],
};

export default HoldConfirmation;
