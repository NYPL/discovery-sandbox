import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import LoadingLayer from '../LoadingLayer/LoadingLayer';

import Store from '../../stores/Store';

const SccContainer = props => (
  <main className="main-page">
    <LoadingLayer
      status={Store.state.isLoading}
      title={props.loadingLayerText}
    />
    <div className="nypl-page-header">
      <div className="nypl-full-width-wrapper filter-page">
        <div className="nypl-row">
          <div className="nypl-column-full">
            <Breadcrumbs type={props.breadcrumbsType} />
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
    <div className="nypl-full-width-wrapper">
      <div className="nypl-row">
        <div className="nypl-column-full">
          { props.mainContent }
        </div>
      </div>
    </div>
  </main>
);

SccContainer.propTypes = {
  mainContent: PropTypes.element,
  extraBannerElement: PropTypes.element,
  secondaryExtraBannerElement: PropTypes.element,
  extraRow: PropTypes.element,
  loadingLayerText: PropTypes.string,
  breadcrumbsType: PropTypes.string,
  bannerOptions: PropTypes.object,
};

SccContainer.defaultProps = {
  mainContent: null,
  extraBannerElement: null,
  loadingLayerText: "Loading",
};

export default SccContainer;
