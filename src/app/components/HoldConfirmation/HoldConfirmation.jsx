import React from 'react';
import PropTypes from 'prop-types';
import PatronStore from '../../stores/PatronStore.js';
import appConfig from '../../../../appConfig.js';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';

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

    window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);

    return false;
  }

  /**
   * goRestart(e)
   * @param {event}
   * Renders the route back to home page for single page application implementation.
   *
   */
  goRestart(e) {
    e.preventDefault();

    this.context.router.push(`${appConfig.baseUrl}/`);
  }

  /**
   * goSearchResults(e)
   * @param {event}
   * Renders the route back to search results page.
   *
   */
  goSearchResults(e) {
    e.preventDefault();

    this.context.router.push(`${appConfig.baseUrl}/search?q=${this.props.searchKeywords}`);
  }

  /**
   * modelDeliveryLocationName(prefLabel, shortName)
   * Renders the names of the radio input fields of delivery locations except EDD.
   *
   * @param {String} prefLabel
   * @param {String} shortName
   * @return {String}
   */
  modelDeliveryLocationName(prefLabel, shortName) {
    if (prefLabel && typeof prefLabel === 'string' && shortName) {
      const deliveryRoom = (prefLabel.split(' - ')[1]) ? ` - ${prefLabel.split(' - ')[1]}` : '';

      return `${shortName}${deliveryRoom}`;
    }

    return '';
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

    if (loc.shortName === 'n/a') {
      return (
        <span>
          {loc.prefLabel}
        </span>
      );
    }

    const prefLabel = this.modelDeliveryLocationName(loc.prefLabel, loc.shortName);

    return (
      <span>
        {prefLabel}
      </span>
    );
  }

  /**
   * renderStartOverLink
   * Renders the link back to homepage.
   *
   * @return {HTML Element}
   */
  renderStartOverLink() {
    return (
      <Link
        className="nypl-request-button"
        to={`${appConfig.baseUrl}/`}
        onClick={(e) => this.goRestart(e)}
      >
        Start Over
      </Link>
    );
  }

  /**
   * renderBackToSearchLink
   * Renders the link back to the page of search results.
   *
   * @return {HTML Element}
   */
  renderBackToSearchLink() {
    if (!this.props.location.query.searchKeywords) {
      return false;
    }

    return (
      <Link
        className="nypl-request-button"
        // We use this.props.location.query.searchKeywords here for the query from
        // the URL to deal with no js situation.
        to={`${appConfig.baseUrl}/search?q=${this.props.location.query.searchKeywords}`}
        onClick={(e) => this.goSearchResults(e)}
      >
        Back to results
      </Link>
    );
  }

  render() {
    // Need to better clarify variable names later.
    const bib = this.props.bib;
    const title = (bib && _isArray(bib.title) && bib.title.length > 0) ?
      bib.title[0] : '';
    const bibId = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    const itemId = this.props.params.itemId;
    const pickupLocation = this.props.location.query.pickupLocation;
    let deliveryLocation = null;
    let confirmationPageTitle = 'Submission Error';
    let confirmationInfo = (
      <div className="item">
        <p>
          We could not process your request at this time. Please try again or contact 917-ASK-NYPL
          (<a href="tel:19172756975">917-275-6975</a>).
        </p>
        {this.renderBackToSearchLink()}
        {this.renderStartOverLink()}
      </div>
    );

    if (!this.props.location.query.errorStatus && !this.props.location.query.errorMessage) {
      confirmationPageTitle = 'Request Confirmation';
      confirmationInfo = (
      <div className="item">
        <h2>Submission Received</h2>
        <h3>Item Information</h3>
        <p>
          We've received your request for <Link to={`${appConfig.baseUrl}/bib/${bibId}`}>
          {title}</Link>
        </p>
        <p>
          Please check your library account for updates. The item will be listed as
          Ready under your Holds tab when it is available. You will also recieve an email
          confirmation after your item has arrived.
        </p>
        <p>
          Your item will be delivered to: {this.renderLocationInfo(deliveryLocation)}
        </p>
        <p>
          For off-site materials, requests made before 2:30 PM will be delivered the
          following business day. Requests made after 2:30 PM on Fridays or over the
          weekend will be delivered the following Tuesday. We will hold books for up
          to seven days, so you can request materials up to a week in advance.
        </p>

        <h3>Electronic Delivery</h3>
        <p>
          If you selected Electronic delivery, you will be notified via email when the
          item is available.
        </p>
        <p>
          If you would like to cancel your request, or if you have further questions,
          please contact 917-ASK-NYPL (<a href="tel:19172756975">917-275-6975</a>).
        </p>
        {this.renderBackToSearchLink()}
        {this.renderStartOverLink()}
      </div>
    );
    }

    if (this.props.deliveryLocations && this.props.deliveryLocations.length) {
      if (pickupLocation !== 'edd') {
        deliveryLocation = _findWhere(
          this.props.deliveryLocations, { '@id': `loc:${pickupLocation}` }
        );
      } else {
        deliveryLocation = {
          id: null,
          address: null,
          prefLabel: 'n/a (electronic delivery)',
          shortName: 'n/a',
        };
      }
    }

    return (
      <DocumentTitle title={`${confirmationPageTitle} | Shared Collection Catalog | NYPL`}>
        <main id="mainContent" className="main-page">
          <div className="nypl-request-page-header">
            <div className="row">
              <div className="nypl-full-width-wrapper">
                <div className="nypl-column-full">
                  <Breadcrumbs
                    query={this.props.location.query.searchKeywords}
                    type="confirmation"
                    bibUrl={`/bib/${bibId}`}
                    itemUrl={`/hold/request/${bibId}-${itemId}`}
                    edd={pickupLocation === 'edd'}
                  />
                  <h2>{appConfig.displayTitle}</h2>
                </div>
              </div>
            </div>
          </div>

          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <div className="item-header">
                  <h1>{confirmationPageTitle}</h1>
                </div>
              </div>
            </div>
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <div className="nypl-request-item-summary">
                  {confirmationInfo}
                </div>
              </div>
            </div>
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <a target="_blank" href="https://www.nypl.org/help/request-research-materials">
                  Learn more about our off-site collections.
                </a>
              </div>
            </div>
          </div>
        </main>
      </DocumentTitle>
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

HoldConfirmation.contextTypes = {
  router: PropTypes.object,
};

export default HoldConfirmation;
