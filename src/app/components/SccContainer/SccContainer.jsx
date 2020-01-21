import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'
import LoadingLayer from '../LoadingLayer/LoadingLayer'

import Store from '../../stores/Store';
import Actions from '../../actions/Actions'

const SccContainer = (props) => {
  return (
    <main className="main-page">
      <LoadingLayer
        status={ Store.state.isLoading }
        title={ props.loadingLayerText }
      />
    <div className="header-wrapper">
        <div className="header-topWrapper filter-page">
          <div className="nypl-row">
            <div className="nypl-column-full">
              <Breadcrumbs type={props.breadcrumbsType}/>
              { props.extraBannerElement }
              <h1
                aria-label={props.bannerOptions.ariaLabel || props.bannerOptions.text}
              >
                  { props.bannerOptions.text }
              </h1>
            </div>
          </div>
        </div>
        { props.secondaryExtraBannerElement }
      </div>
      { props.extraRow }
      <div className="header-wrapper">
        <div className="header-topWrapper">
          <div className="nypl-row">
            <div className="nypl-column-full">
              { props.mainContent }
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

SccContainer.defaultProps = {
  bannerText: null,
  bannerRightElement: null,
  mainContent: null
};

export default SccContainer;
