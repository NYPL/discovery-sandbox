import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'

const SccContainer = (props) => {
  return (
    <main className="main-page">
      <div className="nypl-page-header">
        <div className="nypl-full-width-wrapper filter-page">
          <div className="nypl-row">
            <div className="nypl-column-full">
              <Breadcrumbs type="subjectHeading" headingDetails={false}/>
              <h1>
                  { props.bannerText }
              </h1>
              { props.bannerRightElement }
            </div>
          </div>
        </div>
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
