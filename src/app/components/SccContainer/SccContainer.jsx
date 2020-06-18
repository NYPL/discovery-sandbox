import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import Notification from '../Notification/Notification';

import Store from '../../stores/Store';

const SccContainer = (props, context) => {
  const { includeDrbb } = context;
  return (
    <main className="main-page">
      <LoadingLayer
        status={Store.getState().isLoading}
        title={props.loadingLayerText}
      />
      <div className="nypl-page-header">
        <div className={`nypl-full-width-wrapper filter-page${includeDrbb ? ' drbb-integration' : ''}`}>
          <div className="nypl-row">
            <div className="nypl-column-full">
              <Breadcrumbs type={props.breadcrumbsType} />
              <Notification notificationType="searchResultsNotification" />
              <h1
                aria-label={props.bannerOptions.ariaLabel || props.bannerOptions.text}
              >
                { props.bannerOptions.text }
              </h1>
              { props.extraBannerElement }
            </div>
          </div>
        </div>
        { props.secondaryExtraBannerElement }
      </div>
      { props.extraRow }
      <div className={`nypl-full-width-wrapper${includeDrbb ? ' drbb-integration' : ''}`}>
        { props.mainContent }
      </div>
    </main>
  );
};

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
  loadingLayerText: 'Loading',
};

SccContainer.contextTypes = {
  router: PropTypes.object,
  includeDrbb: PropTypes.bool,
};

export default SccContainer;
