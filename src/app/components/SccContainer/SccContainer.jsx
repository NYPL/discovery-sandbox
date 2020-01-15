import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'

const useSccContainer = (MainPageComponent, bannerText) => {
  return class extends React.Component {
    render() {
      return (
        <main className="main-page">
          <div className="nypl-page-header">
            <div className="nypl-full-width-wrapper filter-page">
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <Breadcrumbs type="subjectHeading" headingDetails={false}/>
                  <h1>
                      { bannerText }
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <MainPageComponent {...this.props}/>
        </main>
      )
    }
  }
}

useSccContainer.defaultProps = {
  bannerText: ''
};

export default useSccContainer;
