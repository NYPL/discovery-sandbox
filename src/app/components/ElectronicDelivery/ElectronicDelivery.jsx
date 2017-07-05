import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import PatronStore from '../../stores/PatronStore.js';
import config from '../../../../appConfig.js';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  extend as _extend,
} from 'underscore';
import ElectronicDeliveryForm from './ElectronicDeliveryForm';

class ElectronicDelivery extends React.Component {
  constructor(props) {
    super(props);

    const bib = (this.props.bib && !_isEmpty(this.props.bib)) ? this.props.bib : null;
    const title = (bib && _isArray(bib.title) && bib.title.length) ? bib.title[0] : '';
    const bibId = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    const itemId = (this.props.params && this.props.params.itemId) ? this.props.params.itemId : '';

    this.state = _extend({
      title,
      bibId,
      itemId,
    }, { patron: PatronStore.getState() });
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
  submitRequest(fields) {
    const {
      bibId,
      itemId,
    } = this.state;
    const path = `/hold/confirmation/${bibId}-${itemId}`;

    // console.log(fields)
    // This will give you the form values in the form of:
    // {
    //   name: '',
    //   email: '',
    //   chapter: '',
    //   author: '',
    //   date: '',
    //   volume: '',
    //   issue: '',
    //   'starting-page': '',
    //   'ending-page': '',
    // };
    // This can then be serialized and sent to the Request API endpoint once we get it.
    // For now it's just functionally getting this data for a client side ajax EDD request.
    // Please delete this later.

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

  render() {
    const searchKeywords = this.props.searchKeywords || '';
    const {
      bibId,
      itemId,
      title,
    } = this.state;

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

              <h3>Material request for Electronic Delivery:</h3>
              <p>More content here that will be added later.</p>

              <ElectronicDeliveryForm
                bibId={bibId}
                itemId={itemId}
                submitRequest={this.submitRequest}
              />
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
  location: PropTypes.object,
  bib: PropTypes.object,
  searchKeywords: PropTypes.string,
  params: PropTypes.object,
};

export default ElectronicDelivery;
