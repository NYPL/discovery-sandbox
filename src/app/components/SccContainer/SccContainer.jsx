import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import Notification from '../Notification/Notification';

const SccContainer = (props) => {
  const { features } = props;
  const includeDrbb = features.includes('drb-integration');
  return (
    <main className="main-page">
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
  breadcrumbsType: PropTypes.string,
  bannerOptions: PropTypes.object,
  features: PropTypes.array,
};

SccContainer.defaultProps = {
  mainContent: null,
  extraBannerElement: null,
};

SccContainer.contextTypes = {
  router: PropTypes.object,
};

export default connect(({ appConfig }) => ({ features: appConfig.features }))(SccContainer);
