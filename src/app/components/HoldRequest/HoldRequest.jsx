import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import axios from 'axios';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  extend as _extend,
} from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import PatronStore from '../../stores/PatronStore.js';
import appConfig from '../../../../appConfig.js';
import LibraryItem from '../../utils/item.js';

class HoldRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      delivery: false,
    }, { patron: PatronStore.getState() });

    // change all the components :(
    this.onChange = this.onChange.bind(this);
    this.onRadioSelect = this.onRadioSelect.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
  }

  componentDidMount() {
    this.requireUser();
  }

  onChange() {
    this.setState({ patron: PatronStore.getState() });
  }

  onRadioSelect(e) {
    this.setState({ delivery: e.target.value });
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

    let path = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}`;

    if (this.state.delivery === 'edd') {
      path = `${appConfig.baseUrl}/hold/request/${bibId}-${itemId}/edd`;

      this.context.router.push(path);
      return;
    }

    axios
      .get(`${appConfig.baseUrl}/api/newHold?itemId=${itemId}&pickupLocation=` +
        `${this.state.delivery}&itemSource=${itemSource}`)
      .then(response => {
        if (response.data.error && response.data.error.status !== 200) {
          this.context.router.push(`${path}?errorMessage=${response.data.error.statusText}`);
        } else {
          this.context.router.push(
            `${path}?pickupLocation=${response.data.pickupLocation}&requestId=${response.data.id}`
          );
        }
      })
      .catch(error => {
        console.log(error);
        this.context.router.push(`${path}?errorMessage=${error}`);
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
          onChange={this.onRadioSelect}
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

      return (
        <label htmlFor={`location${i}`} id={`location${i}-label`} key={i}>
          <input
            aria-labelledby={`radiobutton-group1 location${i}-label`}
            type="radio"
            name="delivery-location"
            id={`location${i}`}
            value={location['@id'].replace('loc:', '')}
            onChange={this.onRadioSelect}
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
    const callNo =
      (selectedItem && selectedItem.callNumber && selectedItem.callNumber.length) ?
      (
        <div className="call-number">
          <span>Call number:</span><br />{selectedItem.callNumber}
        </div>
      ) : null;
    const itemSource = selectedItem.itemSource;
    let form = null;

    if (bib) {
      form = (
        <form
          className="place-hold-form form"
          action={`/hold/request/${bibId}-${itemId}-${itemSource}`}
          method="POST"
          onSubmit={(e) => this.submitRequest(e, bibId, itemId, itemSource)}
        >
          <h4>Choose a delivery option or location</h4>
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
          <button type="submit" className="nypl-request-button">
            Submit request
          </button>
        </form>
      );
    }

    return (
      <div id="mainContent">
        <div className="nypl-request-page-header">
          <div className="nypl-full-width-wrapper">
            <div className="row">
              <div className="nypl-column-full">
                <Breadcrumbs
                  query={`q=${searchKeywords}`}
                  bibUrl={`/bib/${bibId}`}
                  type="hold"
                />
                <h2>Research Discovery (beta)</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="nypl-full-width-wrapper">
          <div className="row">
            <div className="nypl-column-three-quarters">
              <div className="item-header">
                <h3>Research item hold request</h3>
              </div>

              <div className="nypl-request-item-summary">
                <div className="item">
                  {!bib && <p>Something went wrong with your request</p>}
                  <h4>
                    <Link to={`${appConfig.baseUrl}/bib/${bibId}`}>{title}</Link>
                  </h4>
                  {callNo}
                </div>
              </div>

              {form}
            </div>
          </div>
        </div>
      </div>
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
};

HoldRequest.defaultProps = {
  location: {},
  bib: {},
  searchKeywords: '',
  params: {},
  deliveryLocations: [],
  isEddRequestable: false,
};

export default HoldRequest;
