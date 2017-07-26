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
        to="/"
        onClick={(e) => this.goRestart(e)}
      >
        Start Over
      </Link>
    );
  }

  render() {
    // Need to better clarify variable names later.
    const bib = this.props.bib;
    const title = (bib && _isArray(bib.title) && bib.title.length > 0) ?
      bib.title[0] : '';
    const id = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    let deliveryLocation = null;

    if (this.props.deliveryLocations && this.props.deliveryLocations.length) {
      if (this.props.location.query.pickupLocation !== 'edd') {
        deliveryLocation = _findWhere(
          this.props.deliveryLocations, { '@id': `loc:${this.props.location.query.pickupLocation}` }
        );
      } else {
        deliveryLocation = {
          id: null,
          address: null,
          prefLabel: 'n/a (electronic delivery)',
        };
      }
    }

    return (
      <div id="mainContent">
        <div className="nypl-request-page-header">
          <div className="content-wrapper">
            <Breadcrumbs
              query={this.props.searchKeywords}
              type="holdConfirmation"
              title={title}
              url={id}
            />
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <div className="item-header">
                <h3>Request Confirmation</h3>
              </div>
            </div>
          </div>
          <div className="nypl-row">
            <div className="nypl-column-three-quarters">
              <div className="nypl-request-item-summary">
                <div className="item">
                  <h4>Submission Received</h4>
                  <p>Item Information</p>
                  <p>We've received your request for <Link to={`${appConfig.baseUrl}/bib/${id}`}>{title}</Link></p>
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

                  <h4>Electronic Delivery</h4>
                  <p>
                    If you selected Electronic delivery, you will be notified via email when the item
                    is available.
                  </p>
                  <p>
                    If you would like to cancel your request, or if you have further questions, please
                    contact 917-ASK-NYPL (917-275-6975).
                  </p>
                  {this.renderStartOverLink()}
                </div>
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

HoldConfirmation.contextTypes = {
  router: PropTypes.object,
};

export default HoldConfirmation;
