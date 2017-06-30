import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import PatronStore from '../../stores/PatronStore.js';
import config from '../../../../appConfig.js';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
} from 'underscore';

class ElectronicDelivery extends React.Component {
  constructor(props) {
    super(props);

    this.state = { patron: PatronStore.getState() };
    this.renderForm = this.renderForm.bind(this);
    this.requireUser = this.requireUser.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
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
   * submitRequest()
   * Client-side submit call.
   */
  submitRequest(e, bibId, itemId) {
    e.preventDefault();
    const path = `/hold/confirmation/${bibId}-${itemId}`;

    axios
      .get(`/api/newHold?itemId=${itemId}`)
      .then(response => {
        if (response.data.error && response.data.error.status !== 200) {
          this.context.router.push(`${path}?errorMessage=${response.data.error.statusText}`);
        } else {
          this.context.router.push(`${path}?requestId=${response.data.id}`);
        }
      })
      .catch(error => {
        console.log(error);
        this.context.router.push(`${path}?errorMessage=${error}`);
      });
  }

  renderForm(bibId, itemId) {
    return (
      <form
        className="place-hold-form form"
        action=""
        method="POST"
        onSubmit={(e) => this.submitRequest(e, bibId, itemId)}
      >
        <button
          type="submit"
          className="large"
        >
          Submit your item hold request
        </button>
      </form>
    );
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
        <div className="nypl-full-width-wrapper">
          <div className="nypl-row">
            <div className="nypl-column-full">
              <h1>Electronic Delivery Request</h1>

              {this.renderForm(bibId, itemId)}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ElectronicDelivery.contextTypes = {
  router: PropTypes.object,
};

ElectronicDelivery.propTypes = {
  location: React.PropTypes.object,
  bib: React.PropTypes.object,
  searchKeywords: React.PropTypes.string,
  params: React.PropTypes.object,
};

export default ElectronicDelivery;
