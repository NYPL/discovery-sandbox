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
      <div className="nypl-page-header">
        <div className="nypl-full-width-wrapper filter-page">
          <div className="nypl-row">
            <div className="nypl-column-full">
              <Breadcrumbs type="subjectHeading" headingDetails={false}/>
              { props.extraBannerElement }
              <h1>
                  { props.bannerOptions.text }
              </h1>
            </div>
          </div>
        </div>
        { props.secondaryExtraBannerElement }
      </div>
      { props.mainContent }
    </main>
  )
}

SccContainer.defaultProps = {
  bannerText: null,
  bannerRightElement: null,
  mainContent: null
};

export default SccContainer;
