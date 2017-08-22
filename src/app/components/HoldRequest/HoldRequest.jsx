import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import axios from 'axios';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  extend as _extend,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import PatronStore from '../../stores/PatronStore.js';
import appConfig from '../../../../appConfig.js';
import LibraryItem from '../../utils/item.js';
import LoadingLayer from '../LoadingLayer/LoadingLayer.jsx';

class HoldRequest extends React.Component {
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

    this.state = _extend({
      delivery: defaultDelivery,
      isLoading: this.props.isLoading,
      checkedLocNum,
    }, { patron: PatronStore.getState() });

    // change all the components :(
    this.onChange = this.onChange.bind(this);
    this.onRadioSelect = this.onRadioSelect.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
  }

  componentDidMount() {
    this.requireUser();
  }

  onChange() {
    this.setState({ patron: PatronStore.getState() });
  }

  onRadioSelect(e, i) {
    this.setState({
      delivery: e.target.value,
      checkedLocNum: i,
    });
  }

  updateIsLoadingState(status) {
    this.setState({ isLoading: status });
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
   * submitRequest()
   * Client-side submit call.
   */
  submitRequest(e, bibId, itemId, itemSource) {
    e.preventDefault();

    const searchKeywordsQuery =
      (this.props.searchKeywords) ? `searchKeywords=${this.props.searchKeywords}` : '';
    const searchKeywordsQueryPhysical = searchKeywordsQuery ? `&${searchKeywordsQuery}` : '';
    const fromUrlQuery = this.props.location.query && this.props.location.query.fromUrl ?
      `&fromUrl=${encodeURIComponent(this.props.location.query.fromUrl)}` : '';
    let path = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}`;

    if (this.state.delivery === 'edd') {
      path = `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}` +
        `/edd?${searchKeywordsQuery}${fromUrlQuery}`;

      this.context.router.push(path);
      return;
    }

    this.updateIsLoadingState(true);

    axios
      .get(`${appConfig.baseUrl}/api/newHold?itemId=${itemId}&pickupLocation=` +
        `${this.state.delivery}&itemSource=${itemSource}`)
      .then(response => {
        if (response.data.error && response.data.error.status !== 200) {
          this.updateIsLoadingState(false);
          this.context.router.push(
            `${path}?errorStatus=${response.data.error.status}` +
            `&errorMessage=${response.data.error.statusText}${searchKeywordsQueryPhysical}` +
            `${fromUrlQuery}`
          );
        } else {
          this.updateIsLoadingState(false);
          this.context.router.push(
            `${path}?pickupLocation=${response.data.pickupLocation}&requestId=${response.data.id}` +
            `${searchKeywordsQueryPhysical}${fromUrlQuery}`
          );
        }
      })
      .catch(error => {
        console.error('Error attempting to make an ajax Hold Request in HoldRequest', error);

        this.updateIsLoadingState(false);
        this.context.router.push(
          `${path}?errorMessage=${error}${searchKeywordsQueryPhysical}${fromUrlQuery}`
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
   * renderEDD()
   * Renders the radio input fields of EDD.
   *
   * @return {HTML Element}
   */
  renderEDD() {
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
          onChange={(e) => this.onRadioSelect(e, -1)}
        />
        Have up to 50 pages scanned and sent to you via electronic mail.
      </label>
    );
  }

  /**
   * renderDeliveryLocation(deliveryLocations = [])
   * Renders the radio input fields of delivery locations except EDD.
   *
   * @param {Array} deliveryLocations
   * @return {HTML Element}
   */
  renderDeliveryLocation(deliveryLocations = []) {
    return deliveryLocations.map((location, i) => {
      const displayName = this.modelDeliveryLocationName(
        location.prefLabel, location.shortName
      );

      const value = (location['@id'] && typeof location['@id'] === 'string') ?
        location['@id'].replace('loc:', '') : '';

      return (
        <label htmlFor={`location${i}`} id={`location${i}-label`} key={i}>
          <input
            aria-labelledby={`radiobutton-group1 location${i}-label`}
            type="radio"
            name="delivery-location"
            id={`location${i}`}
            value={value}
            checked={i === this.state.checkedLocNum}
            onChange={(e) => this.onRadioSelect(e, i)}
          />
          <span className="nypl-screenreader-only">Send to:</span>
          <span>{displayName}</span><br />
          {location.address && <span>{location.address}</span>}
        </label>
      );
    });
  }

  render() {
    const searchKeywords = this.props.searchKeywords || '';
    const bib = (this.props.bib && !_isEmpty(this.props.bib)) ?
      this.props.bib : null;
    const title = (bib && _isArray(bib.title) && bib.title.length) ?
      bib.title[0] : '';
    const bibId = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    const itemId = (this.props.params && this.props.params.itemId) ? this.props.params.itemId : '';
    const selectedItem = (bib && itemId) ? LibraryItem.getItem(bib, itemId) : {};
    const bibLink = (bibId && title) ?
      (<h2>
        <Link to={`${appConfig.baseUrl}/bib/${bibId}`}>{title}</Link>
      </h2>) : null;
    const callNo =
      (selectedItem && selectedItem.callNumber && selectedItem.callNumber.length) ?
      (
        <div className="call-number">
          <span>Call number:</span><br />{selectedItem.callNumber}
        </div>
      ) : null;
    const itemSource = selectedItem.itemSource;
    const deliveryLocations = this.props.deliveryLocations;
    const isEddRequestable = this.props.isEddRequestable;
    const deliveryLocationInstruction =
      (!deliveryLocations.length && !isEddRequestable) ?
        <h2>
          Delivery options for this item are currently unavailable. Please try again later or
          contact 917-ASK-NYPL (<a href="tel:917-275-6975">917-275-6975</a>).
        </h2> :
        <h2>Choose a delivery option or location</h2>;
    let form = null;

    if (bib) {
      form = (
        <form
          className="place-hold-form form"
          action={`${appConfig.baseUrl}/hold/request/${bibId}-${itemId}-${itemSource}`}
          method="POST"
          onSubmit={(e) => this.submitRequest(e, bibId, itemId, itemSource)}
        >
          {deliveryLocationInstruction}
          <div className="nypl-request-radiobutton-field">
            <fieldset>
              <legend className="visuallyHidden" id="radiobutton-group1">
                Select a pickup location
              </legend>
              {(this.props.isEddRequestable) && this.renderEDD()}
              {this.renderDeliveryLocation(this.props.deliveryLocations)}
            </fieldset>

            <input type="hidden" name="pickupLocation" value="test" />
          </div>
          {
            (deliveryLocations.length || isEddRequestable) &&
              <button type="submit" className="nypl-request-button">
                Submit request
              </button>
          }
          <input
            type="hidden"
            name="search-keywords"
            value={searchKeywords}
          />
        </form>
      );
    }

    return (
      <DocumentTitle title="Item Request | Shared Collection Catalog | NYPL">
        <div id="mainContent">
          <LoadingLayer status={this.state.isLoading} title="Searching" />
          <div className="nypl-request-page-header">
            <div className="nypl-full-width-wrapper">
              <div className="row">
                <div className="nypl-column-full">
                  <Breadcrumbs
                    query={`q=${searchKeywords}`}
                    bibUrl={`/bib/${bibId}`}
                    type="hold"
                  />
                  <h1>Item Request</h1>
                </div>
              </div>
            </div>
          </div>

          <div className="nypl-full-width-wrapper">
            <div className="row">
              <div className="nypl-column-three-quarters">
                <div className="nypl-request-item-summary">
                  <div className="item">
                    {
                      !bib &&
                        <h2>
                          This item cannot be requested at this time. Please try again later or
                          contact 917-ASK-NYPL (<a href="tel:917-275-6975">917-275-6975</a>).
                        </h2>
                    }
                    {bibLink}
                    {callNo}
                  </div>
                </div>

                {form}
              </div>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

HoldRequest.contextTypes = {
  router: PropTypes.object,
};

HoldRequest.propTypes = {
  location: React.PropTypes.object,
  bib: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  params: React.PropTypes.object,
  deliveryLocations: React.PropTypes.array,
  isEddRequestable: React.PropTypes.bool,
  isLoading: React.PropTypes.bool,
};

HoldRequest.defaultProps = {
  location: {},
  bib: {},
  searchKeywords: '',
  params: {},
  deliveryLocations: [],
  isEddRequestable: false,
  isLoading: false,
};

export default HoldRequest;
