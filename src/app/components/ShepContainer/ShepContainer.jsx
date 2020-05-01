import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const ShepContainer = (props) => {
  return (
    <main className="main-page shepcontainer">
      <div className="header-wrapper container-header">
        <div className="header-topWrapper filter-page">
          <div className="nypl-row container-row" id="mainContent">
            <div className="nypl-column-full">
              <Breadcrumbs
                type={props.breadcrumbsType}
              />
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
          <div className="nypl-row container-row">
            <div className="nypl-column-full">
              { props.mainContent }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

ShepContainer.propTypes = {
  mainContent: PropTypes.element,
  extraBannerElement: PropTypes.element,
  secondaryExtraBannerElement: PropTypes.element,
  extraRow: PropTypes.element,
  loadingLayerText: PropTypes.string,
  breadcrumbsType: PropTypes.string,
  bannerOptions: PropTypes.object,
};

ShepContainer.defaultProps = {
  mainContent: null,
  extraBannerElement: null,
  loadingLayerText: "Loading",
};

export default ShepContainer;
