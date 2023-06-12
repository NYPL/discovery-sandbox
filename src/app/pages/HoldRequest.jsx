/* globals window document */
import { Link as DSLink } from '@nypl/design-system-react-components';
import axios from 'axios';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
} from 'underscore';

import SccContainer from '../components/SccContainer/SccContainer';
import Notification from '../components/Notification/Notification';
import LoadingLayer from '../components/LoadingLayer/LoadingLayer';

import appConfig from '../data/appConfig';
import LibraryItem from '../utils/item';
import {
  trackDiscovery,
  institutionNameByNyplSource,
} from '../utils/utils';
import { updateLoadingStatus } from '../actions/Actions';

export class HoldRequest extends React.Component {
  constructor(props) {
    super(props);
    const deliveryLocationsFromAPI = this.props.deliveryLocations;
    const isEddRequestable = this.props.isEddRequestable;
    const firstLocationValue = (
      deliveryLocationsFromAPI.length &&
      deliveryLocationsFromAPI[0]['@id'] &&
      typeof deliveryLocationsFromAPI[0]['@id'] === 'string') ?
      deliveryLocationsFromAPI[0]['@id'].replace('loc:', '') : '';
    let defaultDelivery = 'edd';
    let checkedLocNum = -1;

    // Sets EDD as the default delivery location and the selected option as "-1" to indicate it.
    // If there's no EDD, set the default delivery location as the first one from the location list,
    // and set the selected option as "0".
    // If neither EDD or physical locations available, we will show an error message on the page.
    if (!isEddRequestable && deliveryLocationsFromAPI.length) {
      defaultDelivery = firstLocationValue;
      checkedLocNum = 0;
    }

    this.state = {
      delivery: defaultDelivery,
      checkedLocNum,
      serverRedirect: true,
      checkingPatronEligibility: true
    };

    this.onRadioSelect = this.onRadioSelect.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
  }


  componentDidMount() {
    const title = document.getElementById('item-title');
    if (title) {
      title.focus();
    }
    if (this.state.serverRedirect) this.setState({ serverRedirect: false });
  }

  onRadioSelect(e, i) {
    trackDiscovery('Delivery Location', e.target.value);
    this.setState({
      delivery: e.target.value,
      checkedLocNum: i,
    });
  }

  /**
   * submitRequest()
   * Client-side submit call.
   */
  submitRequest(e, bibId, itemId, itemSource, title) {
    e.preventDefault();
    const searchKeywordsQuery =
      (this.props.searchKeywords) ? `q=${this.props.searchKeywords}` : '';
    const searchKeywordsQueryPhysical = searchKeywordsQuery ? `&${searchKeywordsQuery}` : '';
    const fromUrlQuery = this.props.location.query && this.props.location.query.fromUrl ?
      `&fromUrl=${encodeURIComponent(this.props.location.query.fromUrl)}` : '';
    const partnerEvent = itemSource !== 'sierra-nypl' ?
      ` - Partner item - ${institutionNameByNyplSource(itemSource)}` : '';
    let path = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}`;

    if (this.state.delivery === 'edd') {
      path = `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}` +
        `/edd?${searchKeywordsQuery}${fromUrlQuery}`;

      this.context.router.push(path);
      return;
    }

    trackDiscovery(`Submit Request${partnerEvent}`, `${title} - ${itemId}`);
    const formData = new FormData(document.getElementById('place-hold-form'));
    this.props.updateLoadingStatus(true);
    axios.post(
      `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}-${itemSource}`,
      Object.fromEntries(formData.entries()),
    )
      .then((response) => {
        const { data } = response;
        if (data.redirect) {
          const fullUrl = encodeURIComponent(window.location.href);
          window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
          return;
        }
        this.context.router.push(response.data);
      })
      .catch((error) => {
        console.error('Error attempting to make an ajax Hold Request in HoldRequest', error);
        this.context.router.push(
          `${path}?errorMessage=${error}${searchKeywordsQueryPhysical}${fromUrlQuery}`,
        );
      });
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
     * renderDeliveryLocation(deliveryLocations = [])
     * Renders the radio input fields of delivery locations except EDD.
     *
     * @param {Array} deliveryLocations
     * @return {HTML Element}
     */
  renderDeliveryLocation(deliveryLocations = []) {
    const { closedLocations } = this.props;
    const { openLocations } = appConfig;
    return deliveryLocations.map((location, i) => {
      const displayName = this.modelDeliveryLocationName(location.prefLabel, location.shortName);
      const value = (location['@id'] && typeof location['@id'] === 'string') ?
        location['@id'].replace('loc:', '') : '';

      if (
        closedLocations.some(closedLocation => displayName.startsWith(closedLocation)) ||
        (openLocations && !openLocations.some(openLocation => displayName.includes(openLocation)))
      ) {
        return null;
      }

      return (
        <label htmlFor={`location${i}`} id={`location${i}-label`} key={location['@id']}>
          <input
            aria-labelledby={`radiobutton-group1 location${i}-label`}
            type="radio"
            name="delivery-location"
            id={`location${i}`}
            value={value}
            checked={i === this.state.checkedLocNum}
            onChange={e => this.onRadioSelect(e, i)}
          />
          <span className="nypl-screenreader-only">Send to:</span>
          <span className="nypl-location-name">{displayName}</span><br />
          {location.address && <span className="nypl-location-address">{location.address}</span>}
        </label>
      );
    });
  }

  /**
  * renderEDD()
  * Renders the radio input fields of EDD.
  *
  * @return {HTML Element}
  */
  renderEDD() {
    const { closedLocations } = this.props;
    if (closedLocations.includes('')) return null;
    return (
      <label
        className="electronic-delivery"
        id="radiobutton-group1_electronic-delivery"
        htmlFor="available-electronic-delivery"
      >
        <input
          aria-labelledby="radiobutton-group1 radiobutton-group1_electronic-delivery"
          type="radio"
          name="delivery-location"
          id="available-electronic-delivery"
          value="edd"
          checked={this.state.checkedLocNum === -1}
          onChange={e => this.onRadioSelect(e, -1)}
        />
        Have a small portion (one chapter, one article, around 10% of work or 50 pages for public domain works) scanned and sent to you via electronic mail.
      </label>
    );
  }

  render() {
    const {
      closedLocations,
      recapClosedLocations,
      nonRecapClosedLocations,
      searchKeywords,
      loading,
      params,
    } = this.props;

    const { serverRedirect } = this.state;
    const bib =
      this.props.bib && !_isEmpty(this.props.bib) ? this.props.bib : null;
    const title =
      bib && _isArray(bib.title) && bib.title.length ? bib.title[0] : '';
    const bibId =
      bib && bib['@id'] && typeof bib['@id'] === 'string'
        ? bib['@id'].substring(4)
        : '';
    const itemId = params && params.itemId ? params.itemId : '';
    const selectedItem = bib && itemId ? LibraryItem.getItem(bib, itemId) : {};
    const selectedItemAvailable = selectedItem && selectedItem.available
      // Note: The .eddRequestability check should be removed with separate
      // request buttons rollout (i.e. when this page shows only physical,
      // non-edd delivery options):
      ? selectedItem.physRequestable || selectedItem.eddRequestable
      : false;
    const bibLink =
      bibId && title ? (
        <h2>
          <Link
            id='item-link'
            to={`${appConfig.baseUrl}/bib/${bibId}`}
            onClick={() => trackDiscovery('Hold Request - Bib', title)}
          >
            {title}
          </Link>
        </h2>
      ) : null;
    const callNo =
      (selectedItem && selectedItem.callNumber && selectedItem.callNumber.length) ?
        (<div className="call-number">
          <span>Call number:</span><br />{selectedItem.callNumber}
        </div>) : null;
    let itemClosedLocations = closedLocations;
    if (selectedItem && selectedItem.isRecap) {
      itemClosedLocations = itemClosedLocations.concat(recapClosedLocations);
    } else {
      itemClosedLocations = itemClosedLocations.concat(nonRecapClosedLocations);
    }
    const deliveryLocations = this.props.deliveryLocations.filter(
      deliveryLocation => !itemClosedLocations.some(closedLocation =>
        deliveryLocation.shortName && deliveryLocation.shortName.includes(closedLocation),
      ),
    );
    const isEddRequestable = this.props.isEddRequestable && !itemClosedLocations.includes('edd');
    const allClosed = itemClosedLocations.includes('');
    const deliveryLocationInstruction =
      ((!deliveryLocations.length && !isEddRequestable) || allClosed) ?
        (
          <h2 className="nypl-request-form-title">
          Delivery options for this item are currently unavailable. Please try again later or
          contact 917-ASK-NYPL (<DSLink href="tel:917-275-6975">917-275-6975</DSLink>).
          </h2>) :
        <h2 className="nypl-request-form-title">Choose a delivery location</h2>;
    let form = null;

    if (bib && selectedItemAvailable && !allClosed) {
      const itemSource = selectedItem.itemSource;
      form = (
        <form
          id="place-hold-form"
          className="place-hold-form form"
          action={`${appConfig.baseUrl}/hold/request/${bibId}-${itemId}-${itemSource}`}
          method="POST"
          onSubmit={e => this.submitRequest(e, bibId, itemId, itemSource, title)}
        >
          {deliveryLocationInstruction}
          <div className="nypl-request-radiobutton-field">
            <fieldset>
              <legend className="visuallyHidden" id="radiobutton-group1">
                Select a pickup location
              </legend>
              {this.renderDeliveryLocation(deliveryLocations)}
            </fieldset>

            <input type="hidden" name="pickupLocation" value="test" />
          </div>
          {
            (deliveryLocations.length || isEddRequestable) &&
              <button type="submit" className="nypl-request-button">
                Submit Request
              </button>
          }
          <input
            type="hidden"
            name="search-keywords"
            value={searchKeywords}
          />
          <input
            type="hidden"
            name="serverRedirect"
            value={serverRedirect}
          />
        </form>
      );
    }

    const userLoggedIn = this.props.patron && this.props.patron.loggedIn;

    return (
      <>
        {
          !userLoggedIn || loading ? <LoadingLayer loading /> : null
        }
        <SccContainer
          activeSection="search"
          pageTitle="Item Request"
        >
          <Notification notificationType="holdRequestNotification" />
          <div className="row">
            <div className="nypl-column-three-quarters">
              <div className="nypl-request-item-summary">
                <div className="item">
                  {
                    (userLoggedIn && !loading && (!bib || !selectedItemAvailable)) &&
                      <h2>
                        This item cannot be requested at this time. Please try again later or
                        contact 917-ASK-NYPL (<DSLink href="tel:917-275-6975">917-275-6975</DSLink>).
                      </h2>
                  }
                  {bibLink}
                  {callNo}
                </div>
              </div>

              {
                form
              }
            </div>
          </div>
        </SccContainer>
      </>
    );
  }
}

HoldRequest.contextTypes = {
  router: PropTypes.object,
};

HoldRequest.propTypes = {
  location: PropTypes.object,
  bib: PropTypes.object,
  searchKeywords: PropTypes.string,
  params: PropTypes.object,
  deliveryLocations: PropTypes.array,
  isEddRequestable: PropTypes.bool,
  patron: PropTypes.object,
  closedLocations: PropTypes.array,
  recapClosedLocations: PropTypes.array,
  nonRecapClosedLocations: PropTypes.array,
  holdRequestNotification: PropTypes.string,
  loading: PropTypes.bool,
  updateLoadingStatus: PropTypes.func,
};

HoldRequest.defaultProps = {
  location: {},
  bib: {},
  params: {},
  deliveryLocations: [],
  isEddRequestable: false,
  closedLocations: [],
  recapClosedLocations: [],
  nonRecapClosedLocations: [],
};

const mapStateToProps = state => ({
  closedLocations: state.appConfig.closedLocations,
  recapClosedLocations: state.appConfig.recapClosedLocations,
  nonRecapClosedLocations: state.appConfig.nonRecapClosedLocations,
  holdRequestNotification: state.appConfig.holdRequestNotification,
  deliveryLocations: state.deliveryLocations,
  isEddRequestable: state.isEddRequestable,
  patron: state.patron,
  bib: state.bib,
  loading: state.loading,
});

const mapDispatchToProps = dispatch => ({
  updateLoadingStatus: status => dispatch(updateLoadingStatus(status)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HoldRequest));
