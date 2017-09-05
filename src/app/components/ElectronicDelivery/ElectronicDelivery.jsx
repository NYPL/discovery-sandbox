import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router';
import {
  isArray as _isArray,
  isEmpty as _isEmpty,
  extend as _extend,
  mapObject as _mapObject,
} from 'underscore';
import DocumentTitle from 'react-document-title';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import PatronStore from '../../stores/PatronStore.js';
import appConfig from '../../../../appConfig.js';
import ElectronicDeliveryForm from './ElectronicDeliveryForm';
import LibraryItem from '../../utils/item.js';
import LoadingLayer from '../LoadingLayer/LoadingLayer.jsx';
import { trackDiscovery } from '../../utils/utils.js';

class ElectronicDelivery extends React.Component {
  constructor(props) {
    super(props);

    const bib = (this.props.bib && !_isEmpty(this.props.bib)) ? this.props.bib : null;
    const title = (bib && _isArray(bib.title) && bib.title.length) ? bib.title[0] : '';
    const bibId = (bib && bib['@id'] && typeof bib['@id'] === 'string') ?
      bib['@id'].substring(4) : '';
    const itemId = (this.props.params && this.props.params.itemId) ? this.props.params.itemId : '';
    const selectedItem = (bib && itemId) ? LibraryItem.getItem(bib, itemId) : {};
    const itemSource = (selectedItem && selectedItem.itemSource) ? selectedItem.itemSource : null;
    const raiseError = _isEmpty(this.props.error) ? {} : this.props.error;

    this.state = _extend({
      title,
      bibId,
      itemId,
      itemSource,
      raiseError,
      isLoading: this.props.isLoading,
    }, { patron: PatronStore.getState() });

    this.requireUser = this.requireUser.bind(this);
    this.submitRequest = this.submitRequest.bind(this);
    this.raiseError = this.raiseError.bind(this);
    this.updateIsLoadingState = this.updateIsLoadingState.bind(this);
  }

  componentDidMount() {
    this.requireUser();
  }

  /*
   * componentDidUpdate()
   * If the component makes a request, it will focus on the loading layer component.
   * Also, after the component updates, if there are errors then the DOM for the error box message
   * is rendered. Since it exists, it should be focused so that the patron can get a better
   * idea of what is wrong.
   */
  componentDidUpdate() {
    if (this.loadingLayer) {
      this.loadingLayer.focus();
    }

    if (this.refs['nypl-form-error']) {
      ReactDOM.findDOMNode(this.refs['nypl-form-error']).focus();
    }
  }

  /*
   * getRaisedErrors(raiseError)
   * There's a set list of required inputs in the EDD form. If the key errors from the form
   * are found in the set list, it will render those errors. This is meant to be an
   * aggregate list that is displayed at the top of the form.
   * @param {object} raiseError An object with the key/value pair of input elements in the
   *   EDD form that have incorrect input.
   * @return {object}
   */
  getRaisedErrors(raiseError) {
    const headlineError = {
      emailAddress: 'Email Address',
      chapterTitle: 'Chapter / Article Title',
      startPage: 'Starting Page Number',
      endPage: 'Ending Page Number',
    };

    const raisedErrors = [];

    if (!raiseError || _isEmpty(raiseError)) {
      return null;
    }

    _mapObject(raiseError, (val, key) => {
      raisedErrors.push(<li key={key}><a href={`#${key}`}>{headlineError[key]}</a></li>);
    });

    return raisedErrors;
  }

  updateIsLoadingState(status) {
    this.setState({ isLoading: status });
  }

  /**
   * submitRequest()
   * Client-side submit call.
   */
  submitRequest(fields) {
    const {
      bibId,
      itemId,
      itemSource,
      title,
    } = this.state;
    const path = `${appConfig.baseUrl}/hold/confirmation/${bibId}-${itemId}`;
    const data = _extend({
      bibId,
      itemId,
      pickupLocation: 'edd',
      itemSource,
    }, fields);
    const searchKeywords = this.props.searchKeywords;
    const searchKeywordsQuery = (searchKeywords) ? `&searchKeywords=${searchKeywords}` : '';
    const fromUrlQuery = this.props.location.query && this.props.location.query.fromUrl ?
      `&fromUrl=${encodeURIComponent(this.props.location.query.fromUrl)}` : '';
    const itemSourceMapping = {
      'recap-pul': 'Princeton',
      'recap-cul': 'Columbia',
    };
    const partnerEvent = itemSource !== 'sierra-nypl' ?
      ` - Partner item - ${itemSourceMapping[itemSource]}` : '';

    // This is to remove the error box on the top of the page on a successfull submission.
    this.setState({ raiseError: null });
    this.updateIsLoadingState(true);
    trackDiscovery(`Submit Request EDD${partnerEvent}`, `${title} - ${itemId}`);

    axios
      .post(`${appConfig.baseUrl}/api/newHold`, data)
      .then(response => {
        if (response.data.error && response.data.error.status !== 200) {
          this.updateIsLoadingState(false);
          this.context.router.push(
            `${path}?errorStatus=${response.data.error.status}` +
            `&errorMessage=${response.data.error.statusText}${searchKeywordsQuery}${fromUrlQuery}`
          );
        } else {
          this.updateIsLoadingState(false);
          this.context.router.push(
            `${path}?pickupLocation=edd&requestId=${response.data.id}` +
            `${searchKeywordsQuery}${fromUrlQuery}`
          );
        }
      })
      .catch(error => {
        console.error(
          'Error attempting to submit an ajax EDD request at ElectronicDelivery',
          error
        );

        this.updateIsLoadingState(false);
        this.context.router.push(
          `${path}?errorMessage=${error}${searchKeywordsQuery}${fromUrlQuery}`
        );
      });
  }

  /*
   * raiseError()
   * Simple function that sets the component's State's raiseError value to the error that
   * gets returned after validation.
   * @param {object} error
   */
  raiseError(error) {
    this.setState({ raiseError: error });
    trackDiscovery('Error', 'EDD');
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

  render() {
    const {
      bibId,
      itemId,
      title,
      raiseError,
    } = this.state;
    const bib = (this.props.bib && !_isEmpty(this.props.bib)) ? this.props.bib : null;
    const callNo = bib && bib.shelfMark && bib.shelfMark.length ? bib.shelfMark[0] : null;
    const { error, form } = this.props;
    const patronEmail = (
      this.state.patron.emails && _isArray(this.state.patron.emails)
      && this.state.patron.emails.length
      ) ? this.state.patron.emails[0] : '';
    const searchKeywords = this.props.searchKeywords;

    return (
      <DocumentTitle title="Electronic Delivery Request | Shared Collection Catalog | NYPL">
        <div id="mainContent">
          <LoadingLayer
            status={this.state.isLoading}
            title="Requesting"
            childRef={(c) => { this.loadingLayer = c; }}
          />
          <div className="nypl-request-page-header">
            <div className="row">
              <div className="content-wrapper">
                <Breadcrumbs
                  query={searchKeywords}
                  type="edd"
                  bibUrl={`/bib/${bibId}`}
                  itemUrl={`/hold/request/${bibId}-${itemId}`}
                />
                <h1>Electronic Delivery Request</h1>
              </div>
            </div>
          </div>
          <div className="nypl-full-width-wrapper">
            <div className="nypl-row">
              <div className="nypl-column-three-quarters">
                <div className="nypl-request-item-summary">
                  <h2>
                    <Link
                      to={`${appConfig.baseUrl}/bib/${bibId}`}
                      onClick={() => trackDiscovery('EDD - Bib', title)}
                    >
                      {title}
                    </Link>
                  </h2>
                  {
                    callNo && (
                      <div className="call-number">
                        <span>Call Number:</span><br />
                        {callNo}
                      </div>
                    )
                  }
                </div>
              </div>
            </div>

            <div className="nypl-row">
              {
                !_isEmpty(raiseError) && (
                  <div className="nypl-form-error" ref="nypl-form-error" tabIndex="0">
                    <h2>Error</h2>
                    <p>Please check the following required fields and resubmit your request:</p>
                    <ul>
                      {this.getRaisedErrors(raiseError)}
                    </ul>
                  </div>
                )
              }
              <ElectronicDeliveryForm
                bibId={bibId}
                itemId={itemId}
                itemSource={this.state.itemSource}
                submitRequest={this.submitRequest}
                raiseError={this.raiseError}
                error={error}
                form={form}
                defaultEmail={patronEmail}
                searchKeywords={searchKeywords}
              />
            </div>
          </div>
        </div>
      </DocumentTitle>
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
  error: PropTypes.object,
  form: PropTypes.object,
  isLoading: PropTypes.bool,
};

ElectronicDelivery.defaultProps = {
  searchKeywords: '',
  isLoading: false,
};


export default ElectronicDelivery;
