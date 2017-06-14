import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Store from '../../stores/Store.js';
import PatronStore from '../../stores/PatronStore.js';
import config from '../../../../appConfig.js';
import LibraryItem from '../../utils/item.js';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
} from 'underscore';

class HoldRequest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
    };
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.requireUser();
  }

  onChange() {
    this.setState({ data: Store.getState() });
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
   * renderLoggedInInstruction(patronName)
   * Renders the HTML elements and contents based on the patron data
   *
   * @param {String} patronName
   * @return {HTML Element}
   */
  renderLoggedInInstruction(patronName) {
    return (patronName) ?
      <p className="loggedInInstruction">You are currently logged in as <strong>{patronName}</strong>. If this is not you, please <a href="https://isso.nypl.org/auth/logout">Log out</a> and sign in using your library card.</p>
      : <p className="loggedInInstruction">Something went wrong during retrieving your patron data.</p>;
  }

  render() {
    const searchKeywords = this.state.data.searchKeywords || '';
    const record = (this.state.data.item && !_isEmpty(this.state.data.item)) ?
      this.state.data.item : null;
    const title = (record && _isArray(record.title) && record.title.length) ?
      record.title[0] : '';
    const bibId = (record && record['@id'] && typeof record['@id'] === 'string') ?
      record['@id'].substring(4) : '';
    const patronName = (
      this.state.patron.names && _isArray(this.state.patron.names) && this.state.patron.names.length
      ) ? this.state.patron.names[0] : '';
    const itemId = (this.props.params && this.props.params.id) ? this.props.params.id : '';
    const selectedItem = (record && itemId) ? LibraryItem.getItem(record, itemId) : null;
    const shelfMarkInfo =
      (selectedItem && _isArray(selectedItem.shelfMark) && selectedItem.shelfMark.length > 0) ?
      (
        <span className="col">
          <small>Call number:</small><br />{selectedItem.shelfMark[0]}
        </span>
      ) : null;
    const location = (record && itemId) ? LibraryItem.getLocation(record, itemId) : null;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July',
      'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const dateDisplay = `${monthNames[monthIndex]} ${day}`;
    let content = null;

    if (record) {
      content =
        <div className="content-wrapper">
          <div className="item-header">
            <h1>Research item hold request</h1>
          </div>

          <div className="item-summary">
            <div className="item">
              <h2>You are about to request a hold on the following research item:</h2>
              <Link href={`/bib/${bibId}`}>{title}</Link>
            </div>
          </div>

          <form className="place-hold-form form" action={`/hold/request/${itemId}`} method="POST">
            <h2>Confirm account</h2>
            {this.renderLoggedInInstruction(patronName)}
            <h2>Confirm delivery location</h2>
            <p>When this item is ready, you will use it in the following location:</p>
            <fieldset className="select-location-fieldset">
              <legend className="visuallyHidden">Select a pickup location</legend>
              <div className="group selected">
                <span className="col location">
                  <a href={`${location.uri}`}>{location['full-name']}</a><br />{location.address.address1}<br />
                  {location.prefLabel}
                  {location.offsite &&
                    <span>
                      <br /><small>(requested from offsite storage)</small><br />
                    </span>
                  }
                </span>
                {shelfMarkInfo}
                {/* <span className="col"><small>Ready by approximately:</small><br />{dateDisplay}, 9am.</span> */}
              </div>
            </fieldset>

            <input type="hidden" name="pickupLocation" value={location.code} />

            <button type="submit" className="large">
              Submit your item hold request
            </button>
          </form>
        </div>;
    } else {
      content =
        <div className="content-wrapper">
          <div className="item-header">
            <h1>Research item hold request</h1>
          </div>
          <div className="item-summary">
            <div className="item">
              <h2>Something wrong with your request</h2>
              <Link href={`/bib/${bibId}`}>{title}</Link>
            </div>
          </div>
          <h2>Confirm account</h2>
          {this.renderLoggedInInstruction(patronName)}
        </div>;
    }

    return (
      <div id="mainContent">
        <div className="page-header">
          <div className="content-wrapper">
            <Breadcrumbs
              query={searchKeywords}
              type="hold"
              title={title}
              url={bibId}
            />
          </div>
        </div>
        {content}
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
};

export default HoldRequest;
