import React from 'react';
import PropTypes from 'prop-types';

import Store from '@Store';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import LoadingLayer from '../LoadingLayer/LoadingLayer';

class ShepContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: Store.getState().isLoading,
    };
    this.onChange = this.onChange.bind(this);
    Store.listen(this.onChange);
  }

  onChange() {
    this.setState({ isLoading: Store.getState().isLoading });
  }

  render() {
    const {
      mainContent,
      extraBannerElement,
      secondaryExtraBannerElement,
      extraRow,
      loadingLayerText,
      breadcrumbsType,
      bannerOptions,
    } = this.props;
    const {
      isLoading,
    } = this.state;

    return (
      <main className="main-page shepcontainer">
        <LoadingLayer
          status={isLoading}
          title={loadingLayerText}
        />
        <div className="header-wrapper container-header">
          <div className="header-topWrapper filter-page">
            <div className="nypl-row container-row">
              <div className="nypl-column-full">
                <Breadcrumbs type={breadcrumbsType} />
                { extraBannerElement }
                <h1
                  aria-label={bannerOptions.ariaLabel || bannerOptions.text}
                >
                  { bannerOptions.text }
                </h1>
              </div>
            </div>
          </div>
          { secondaryExtraBannerElement }
        </div>
        { extraRow }
        <div className="header-wrapper">
          <div className="header-topWrapper">
            <div className="nypl-row container-row">
              <div className="nypl-column-full">
                { mainContent }
              </div>
            </div>
          </div>
        </div>
        { secondaryExtraBannerElement }

        { extraRow }
        <div className="nypl-full-width-wrapper">
          { null && mainContent }
        </div>
      </main>
    );
  }
}

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
  loadingLayerText: 'Loading',
};

export default ShepContainer;
