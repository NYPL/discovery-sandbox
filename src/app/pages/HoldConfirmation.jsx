/* global window */
import { Link as DSLink } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Link, withRouter } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  findWhere as _findWhere,
} from 'underscore';
import Url from 'url-parse';
import { connect } from 'react-redux';

import appConfig from '../data/appConfig';
import SccContainer from '../components/SccContainer/SccContainer';
import {
  trackDiscovery,
} from '../utils/utils';

export class HoldConfirmation extends React.Component {
  componentDidMount() {
    this.requireUser();
  }

  expiredMessage() {
    return (<li className="errorItem">Your account has expired -- Please see <DSLink href="https://www.nypl.org/help/library-card/terms-conditions#renew">Library Terms and Conditions -- Renewing or Validating Your Library Card</DSLink> about renewing your card</li>);
  }

  moneyOwedMessage() {
    return (
      <li className='errorItem'>
        {`Your fines have exceeded the limit — you can pay your fines in a branch or online from the links under "My Account"`}
      </li>
    );
  }

  blockedMessage() {
    return (<li className="errorItem">There is a problem with your library account</li>);
  }

  ptypeDisallowsHolds() {
    return (<li className="errorItem">Your card does not permit placing holds on ReCAP materials.</li>);
  }

  reachedHoldLimit() {
    return (<li className="errorItem">You have reached the allowed number of holds.</li>);
  }

  /**
   * eligibilityErrorText supplies the appropriate text when a patron is ineligible to place holds.
   * @return {HTML Element}
   */
  eligibilityErrorText() {
    if (this.props.location.query.errorStatus === 'eligibility') {
      const errors = JSON.parse(this.props.location.query.errorMessage);
      const expired = errors.expired ? this.expiredMessage() : null;
      const blocked = errors.blocked ? this.blockedMessage() : null;
      const moneyOwed = errors.moneyOwed ? this.moneyOwedMessage() : null;
      const ptypeDisallowsHolds = errors.ptypeDisallowsHolds ? this.ptypeDisallowsHolds() : null;
      const reachedHoldLimit = errors.reachedHoldLimit ? this.reachedHoldLimit() : null;
      const defaultText = expired || blocked || moneyOwed || ptypeDisallowsHolds || reachedHoldLimit ? null : 'There is a problem with your library account.';
      return (
        <p> This is because:
          <ul>
            {moneyOwed}
            {expired}
            {blocked}
            {ptypeDisallowsHolds}
            {reachedHoldLimit}
            {defaultText}
          </ul>
          Please see a librarian or contact 917-ASK-NYPL (<DSLink href="tel:19172756975">917-275-6975</DSLink>) if you require assistance.
        </p>);
    }
    return '';
  }

  defaultErrorText() {
    return (
      <span>Please try again or contact 917-ASK-NYPL(<DSLink href="tel:19172756975">917-275-6975</DSLink>)</span>
    );
  }

  /**
   * requireUser()
   * Redirects the patron to OAuth log in page if he/she hasn't been logged in yet.
   *
   * @return {Boolean}
   */
  requireUser() {
    if (this.props.patron && this.props.patron.id && this.props.patron.loggedIn) {
      return true;
    }

    const fullUrl = encodeURIComponent(window.location.href);
    window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);

    return false;
  }

  /**
   * backToHome(e)
   * @param {event}
   * Renders the route back to home page for single page application implementation.
   *
   */
  backToHome(event) {
    event.preventDefault();

    trackDiscovery('Discovery Search', 'New Search');
    this.context.router.push(`${appConfig.baseUrl}/`);
  }

  /**
   * goToSearchResults(e)
   * @param {event}
   * Renders the route back to search results page.
   *
   */
  goToSearchResults(event) {
    event.preventDefault();

    trackDiscovery('Discovery Search', 'Existing Search');
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
  deliveryLocationInfo(loc) {
    if (loc.id === 'edd') return 'The item will be delivered to the email address you provided.';

    let content;
    if (!loc || _isEmpty(loc)) {
      content = (
        <Fragment>
          please <DSLink href="https://gethelp.nypl.org/customer/portal/emails/new">email us</DSLink> or
          call 917-ASK-NYPL (<DSLink href="tel:19172756975">917-275-6975</DSLink>) for your delivery location.
        </Fragment>
      );
    }

    if (loc.shortName === 'n/a') content = loc.prefLabel;

    if (!content) {
      content = this.modelDeliveryLocationName(loc.prefLabel, loc.shortName);
    }

    return (
      <Fragment>
        The item will be delivered to: <span>{content}</span>
      </Fragment>
    );
  }

  /**
   * renderStartOverLink
   * Renders the link back to homepage.
   *
   * @return {HTML Element}
   */
  renderStartOverLink() {
    if (this.props.location.query.fromUrl) {
      return (
        <span id='go-to-research-catalog'>
          {' '}
          You may also try your search in our{' '}
          <Link
            to={`${appConfig.baseUrl}/`}
            onClick={(event) => this.backToHome(event)}
          >
            {appConfig.displayTitle}
          </Link>
          .
        </span>
      );
    }

    let text = 'Start a new search';

    if (this.props.location.query.searchKeywords) {
      text = 'start a new search';
    }

    return (
      <span>
        <Link
          id="start-new-search"
          to={`${appConfig.baseUrl}/`}
          onClick={(event) => this.backToHome(event)}
        >
          {text}
        </Link>.
      </span>
    );
  }

  /**
   * renderBackToClassicLink
   * Renders the link back to the page of search results.
   *
   * @return {HTML Element}
   */
  renderBackToClassicLink() {
    if (!this.props.location.query.fromUrl) {
      return false;
    }

    const fromUrl = decodeURIComponent(this.props.location.query.fromUrl);

    const reg = /\.nypl\.org$/;
    const hrefToCheck = fromUrl.startsWith('http') ? fromUrl : `http://${fromUrl}`;
    if (!(new Url(hrefToCheck).hostname).match(reg)) return false;

    return (
      <span id="go-back-catalog">
        <DSLink
          href={this.props.location.query.fromUrl}
          onClick={() => trackDiscovery('Catalog Link', 'Existing Search')}
        >
          Go back to your search results
        </DSLink>
        {' '}or{' '}
        <DSLink
          href="https://catalog.nypl.org/search"
          onClick={() => trackDiscovery('Catalog Link', 'New Search')}
        >
          start a new search
        </DSLink>.
      </span>
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
      <span>
        <DSLink>
          <Link
            id='go-back-search-results'
            // We use this.props.location.query.searchKeywords here for the query from
            // the URL to deal with no js situation.
            to={`${appConfig.baseUrl}/search?q=${this.props.location.query.searchKeywords}`}
            onClick={(event) => this.goToSearchResults(event)}
          >
            Go back to your search results
          </Link>
        </DSLink>
        {' '}or{' '}
      </span>
    );
  }


  render() {
    const {
      bib,
      deliveryLocations,
      params: {
        itemId,
      },
      location: {
        query: {
          pickupLocation,
          errorStatus,
          errorMessage,
        },
      },
    } = this.props;
    const title = (bib && _isArray(bib.title) && bib.title.length > 0) ?
      bib.title[0] : '';
    const bibId = this.props.params.bibId || (
      (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
        bib['@id'].substring(4) : ''
    );

    let confirmationPageTitle = 'Submission Error';
    let confirmationInfo = (
      <div className="item">
        <p>
          We could not process your request at this time. {
            this.eligibilityErrorText() || this.defaultErrorText()
          }
        </p>
        {this.renderBackToClassicLink()}
        {this.renderBackToSearchLink()}
        {this.renderStartOverLink()}
      </div>
    );

    let deliveryLocation = {};
    if (pickupLocation === 'edd') {
      deliveryLocation = {
        id: 'edd',
        address: null,
        prefLabel: 'n/a (electronic delivery)',
        shortName: 'n/a',
      };
    } else {
      if (deliveryLocations && deliveryLocations.length) {
        deliveryLocation = _findWhere(
          this.props.deliveryLocations, { '@id': `loc:${pickupLocation}` },
        ) || {};
      }
    }

    if (!errorStatus && !errorMessage) {
      confirmationPageTitle = 'Request Confirmation';
      confirmationInfo = (
        <div className="item">
          <p>
            {`We've received your request for `}
            <Link id='item-link' to={`${appConfig.baseUrl}/bib/${bibId}`}>
              {title}
            </Link>
          </p>
          <p id="delivery-location">
            {this.deliveryLocationInfo(deliveryLocation)}
          </p>
          <h3 id="electronic-delivery">Electronic Delivery</h3>
          <p>
            If you selected electronic delivery,
            you will receive an email when the item is available to download.
          </p>
          <h3 id="physical-delivery">Physical Delivery</h3>
          <p>
            Please log in to your <DSLink href="https://www.nypl.org/research/research-catalog/account">patron account</DSLink> to 
            check for updates. The item will be listed as "Ready for pickup" under your holds tab when
            it is available. You will receive an email confirmation after your item has arrived.
          </p>
          <p>
            On-site materials requested up to an hour before closing are usually ready for pickup within
            an hour. On-site materials requested within an hour of closing or outside business hours are
            ready about an hour after opening on the next business day.
          </p>
          <p>
            Off-site materials requested before 2:30 PM will be delivered the following business day.
            Off-site materials requested after 2:30 PM are usually ready in two business days, not
            including Saturdays.
          </p>
          <p>
            Check <DSLink href="https://nypl.org/">nypl.org</DSLink> for library hours. We will hold
            books for up to fourteen days, so you can request materials up to two weeks in advance.
          </p>
          <p>
            If you would like to cancel your request, or if you have questions, 
            please <DSLink href="https://gethelp.nypl.org/customer/portal/emails/new">email us</DSLink> or 
            call 917-ASK-NYPL (<DSLink href="tel:19172756975">917-275-6975</DSLink>).
          </p>

          {this.renderBackToClassicLink()}
          {this.renderBackToSearchLink()}
          {this.renderStartOverLink()}
        </div>
      );
    }

    // If running client-side, generate GA event
    if ((typeof window !== 'undefined') && errorStatus && errorMessage) {
      trackDiscovery('Error', 'Hold Confirmation');
    }

    return (
      <SccContainer
        activeSection="search"
        pageTitle={confirmationPageTitle}
      >
        <div className="nypl-row">
          <div className="nypl-column-three-quarters">
            <div className="nypl-request-item-summary">
              {confirmationInfo}
            </div>
          </div>
        </div>
      </SccContainer>
    );
  }
}

HoldConfirmation.propTypes = {
  bib: PropTypes.object,
  location: PropTypes.object,
  searchKeywords: PropTypes.string,
  params: PropTypes.object,
  deliveryLocations: PropTypes.array,
  patron: PropTypes.object,
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

const mapStateToProps = ({ bib, searchKeywords, deliveryLocations, patron }) => ({
  bib,
  searchKeywords,
  deliveryLocations,
  patron,
});

export default withRouter(connect(mapStateToProps)(HoldConfirmation));
